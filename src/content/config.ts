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
		date: z.string(),
		image: z.string().url(),
		description: z.string(),
		tech: z.array(z.string()),
		links: z.object({
			github: z.string().url().optional(),
			demo: z.string().url().optional(),
			githubReadme: z.string().url().optional(),
		}),
	}),
});

// const EducationSchema = z.object({
// 	degree: z.string(),
// 	institution: z.string(),
// 	year_from: z.number(),
// 	year_to: z.number(),
// 	image: z.string(),
// });

// const data = defineCollection({
// 	type: "content",
// 	schema: z.object({
// 		name: z.string(),
// 		role: z.string(),
// 		email: z.string(),
// 		phone: z.string(),
// 		location: z.string(),
// 		education: z.array(EducationSchema),
// 	}),
// });
// Export a single `collections` object to register your collection(s)
export const collections = {
	// data,
	projects,
};
