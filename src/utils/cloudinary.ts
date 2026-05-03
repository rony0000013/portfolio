export function getCloudinaryPublicId(url: string): string {
	try {
		const parts = url.split("/upload/");
		if (parts.length < 2) return url;

		// The part after /upload/ can contain transformations, version, and public ID
		// Example: v123456789/folder/image.jpg or c_fill,w_100/v1/folder/image.jpg
		const pathSegments = parts[1].split("/");

		// Find where the public ID starts.
		// We skip segments that are versions (v123...) or transformations (contain _)
		// However, for most user-provided "copy-pasted" URLs, the first segment is usually the version.
		// A safe bet for common Cloudinary URLs is to find the first segment that doesn't look like a version.

		let startIndex = 0;
		while (startIndex < pathSegments.length) {
			const segment = pathSegments[startIndex];
			// If it looks like a version (v followed by digits), skip it and the rest is public ID
			if (
				segment.startsWith("v") &&
				!Number.isNaN(Number(segment.substring(1)))
			) {
				startIndex++;
				break;
			}
			// Transformations usually contain commas (e.g., c_fill,w_100)
			if (segment.includes(",")) {
				startIndex++;
				continue;
			}
			// If we don't recognize it as a transformation/version, assume public ID starts here
			break;
		}

		const publicIdWithExt = pathSegments.slice(startIndex).join("/");

		// Remove extension - only the last part after the last dot
		const lastDotIndex = publicIdWithExt.lastIndexOf(".");
		if (lastDotIndex === -1) return publicIdWithExt;

		return publicIdWithExt.substring(0, lastDotIndex);
	} catch {
		return url;
	}
}
