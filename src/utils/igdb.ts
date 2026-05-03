import fs from "node:fs";
import path from "node:path";

interface TwitchTokenResponse {
	access_token: string;
	expires_in: number;
	token_type: string;
}

interface IGDBCover {
	id: number;
	url: string;
}

interface IGDBGame {
	id: number;
	name: string;
	cover?: IGDBCover;
}

const CLIENT_ID = process.env.IGDB_CLIENT_ID;
const CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;

const GAMES_MDX_PATH = path.resolve(
	process.cwd(),
	"src/content/data/games.mdx",
);
const OUTPUT_DIR = path.resolve(process.cwd(), "public/images/games");

/**
 * Fetches an access token from Twitch for IGDB API access.
 */
export async function getIGDBAccessToken(): Promise<string> {
	if (!CLIENT_ID || !CLIENT_SECRET) {
		throw new Error(
			"IGDB_CLIENT_ID and IGDB_CLIENT_SECRET must be set in environment variables",
		);
	}

	const url = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`;
	const response = await fetch(url, { method: "POST" });

	if (!response.ok) {
		throw new Error(`Failed to fetch Twitch token: ${response.statusText}`);
	}

	const data = (await response.json()) as TwitchTokenResponse;
	return data.access_token;
}

/**
 * Searches for a game on IGDB and returns its name and high-res cover URL.
 */
export async function fetchGameCover(
	accessToken: string,
	gameTitle: string,
): Promise<{ title: string; url: string } | null> {
	const url = "https://api.igdb.com/v4/games";
	const query = `search "${gameTitle}"; fields name, cover.url; limit 1;`;

	if (!CLIENT_ID) return null;

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Client-ID": CLIENT_ID,
			Authorization: `Bearer ${accessToken}`,
		},
		body: query,
	});

	if (!response.ok) {
		console.error(`IGDB API error for "${gameTitle}": ${response.statusText}`);
		return null;
	}

	const data = (await response.json()) as IGDBGame[];

	if (data.length > 0 && data[0].cover) {
		// Convert thumb URL to 1080p cover URL
		const coverUrl = `https:${data[0].cover.url.replace("t_thumb", "t_1080p")}`;
		return { title: data[0].name, url: coverUrl };
	}

	return null;
}

/**
 * Downloads an image from a URL and saves it to the specified output directory.
 */
export async function downloadImage(
	url: string,
	fileName: string,
): Promise<string> {
	if (!fs.existsSync(OUTPUT_DIR)) {
		fs.mkdirSync(OUTPUT_DIR, { recursive: true });
	}

	const response = await fetch(url);
	const arrayBuffer = await response.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	const filePath = path.join(OUTPUT_DIR, fileName);

	fs.writeFileSync(filePath, buffer);
	return filePath;
}

/**
 * Simple parser to get game titles from the MDX file.
 */
export function extractGamesFromMdx(): string[] {
	if (!fs.existsSync(GAMES_MDX_PATH)) {
		throw new Error(`MDX file not found at ${GAMES_MDX_PATH}`);
	}

	const content = fs.readFileSync(GAMES_MDX_PATH, "utf-8");
	const games: string[] = [];
	const lines = content.split("\n");

	for (const line of lines) {
		const titleMatch = line.match(/^\s*-\s*title:\s*"(.*)"/);
		if (titleMatch) {
			games.push(titleMatch[1]);
		}
	}
	return games;
}

/**
 * Main execution function to sync all game covers.
 */
export async function syncGameCovers() {
	try {
		console.log("--- Starting Game Cover Sync ---");
		const accessToken = await getIGDBAccessToken();
		const gameTitles = extractGamesFromMdx();

		console.log(`Processing ${gameTitles.length} games...`);

		for (const title of gameTitles) {
			const gameData = await fetchGameCover(accessToken, title);

			if (gameData) {
				const fileName = `${title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.jpg`;
				await downloadImage(gameData.url, fileName);
				console.log(`✓ Synchronized: ${title}`);
			} else {
				console.warn(`× No cover found: ${title}`);
			}
		}

		console.log("--- Sync Completed ---");
	} catch (error) {
		console.error(
			"Fatal Error during sync:",
			error instanceof Error ? error.message : error,
		);
	}
}

// If this file is run directly with bun
if (
	import.meta.url === `file://${process.argv[1]}` ||
	process.argv[1]?.endsWith("igdb.ts")
) {
	syncGameCovers();
}
