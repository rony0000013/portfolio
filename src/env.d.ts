/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module "*.lottie" {
	const content: string;
	export default content;
}

declare module "*.dotlottie" {
	const content: string;
	export default content;
}

declare namespace JSX {
	interface IntrinsicElements {
		"dotlottie-player": {
			src?: string;
			autoplay?: boolean;
			loop?: boolean;
			class?: string;
			style?: string;
			playMode?: string;
		};
	}
}
