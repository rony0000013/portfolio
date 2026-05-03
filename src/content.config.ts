import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
	schema: z.object({
		title: z.string(),
		date: z.string(),
		image: z.url(),
		description: z.string(),
		tech: z.array(z.string()),
		links: z.object({
			github: z.url().optional(),
			demo: z.url().optional(),
			githubReadme: z.url().optional(),
		}),
	}),
});

export const collections = {
	projects,
};
