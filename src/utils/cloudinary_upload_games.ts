import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const cloudName = process.env.PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.PUBLIC_CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

/**
 * Uploads a local file to Cloudinary using the signed upload API.
 */
export async function uploadToCloudinary(
	filePath: string,
	folder: string,
): Promise<string> {
	if (!cloudName || !apiKey || !apiSecret) {
		throw new Error("Cloudinary credentials missing in environment variables");
	}

	const timestamp = Math.round(Date.now() / 1000);
	const publicId = path.basename(filePath, path.extname(filePath));

	// Create signature
	const paramsToSign = {
		folder,
		public_id: publicId,
		timestamp,
	};

	const signatureString =
		Object.entries(paramsToSign)
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([key, value]) => `${key}=${value}`)
			.join("&") + apiSecret;

	const signature = crypto
		.createHash("sha1")
		.update(signatureString)
		.digest("hex");

	// Prepare form data
	const formData = new FormData();
	const file = Bun.file(filePath);
	formData.append("file", file);
	formData.append("folder", folder);
	formData.append("public_id", publicId);
	formData.append("timestamp", timestamp.toString());
	formData.append("api_key", apiKey);
	formData.append("signature", signature);

	const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
	const response = await fetch(url, {
		method: "POST",
		body: formData,
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(`Cloudinary upload failed: ${JSON.stringify(error)}`);
	}

	const data = await response.json();
	return data.secure_url;
}

const GAMES_MDX_PATH = path.resolve(
	process.cwd(),
	"src/content/data/games.mdx",
);
const LOCAL_IMAGES_DIR = path.resolve(process.cwd(), "public/images/games");

async function syncGamesToCloudinary() {
	if (!fs.existsSync(GAMES_MDX_PATH)) {
		console.error("games.mdx not found");
		return;
	}

	const mdxContent = fs.readFileSync(GAMES_MDX_PATH, "utf-8");
	const lines = mdxContent.split("\n");
	const updatedLines = [...lines];

	console.log("Starting Cloudinary sync...");

	for (let i = 0; i < lines.length; i++) {
		const titleMatch = lines[i].match(/^\s*-\s*title:\s*"(.*)"/);
		if (titleMatch) {
			const title = titleMatch[1];
			const slug = title.toLowerCase().replace(/[^a-z0-9]/g, "-");
			const files = fs.readdirSync(LOCAL_IMAGES_DIR);
			const match = files.find((f) => {
				const nameWithoutExt = path.basename(f, path.extname(f));
				return (
					nameWithoutExt === slug || nameWithoutExt === slug.replace(/-+/g, "-")
				);
			});

			if (match) {
				const localImagePath = path.join(LOCAL_IMAGES_DIR, match);
				try {
					console.log(`Uploading ${title}...`);
					const cloudinaryUrl = await uploadToCloudinary(
						localImagePath,
						"portfolio/games",
					);

					// Find the next image field
					for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
						if (lines[j].trim().startsWith("image:")) {
							updatedLines[j] = `    image: "${cloudinaryUrl}"`;
							break;
						}
					}
				} catch (error) {
					console.error(`Failed to upload ${title}:`, error);
				}
			} else {
				console.warn(`Local image not found for ${title}: ${localImagePath}`);
			}
		}
	}

	fs.writeFileSync(GAMES_MDX_PATH, updatedLines.join("\n"));
	console.log("Sync complete and games.mdx updated.");
}

// Runnable script
if (
	import.meta.url === `file://${process.argv[1]}` ||
	process.argv[1]?.endsWith("cloudinary_upload_games.ts")
) {
	syncGamesToCloudinary();
}
