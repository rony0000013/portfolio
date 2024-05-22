// Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";
// Define a `type` and `schema` for each collection
// const dataCollection = defineCollection({
// 	type: "content",
// 	schema: z.object({
// 		title: z.string(),
// 		description: z.string(),
// 	}),
// });

const projects = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		date: z.string().date(),
		image: z.string().url(),
		description: z.string(),
		tech: z.array(z.string()),
		features: z.array(z.string()),
		links: z.object({
            github: z.string().url().optional(),
            demo: z.string().url().optional(),
        }),
	}),
});
// Export a single `collections` object to register your collection(s)
export const collections = {
	// data: dataCollection,
	projects
};
