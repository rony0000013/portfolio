import { createSignal, onCleanup, onMount } from "solid-js";

interface Props {
	institution: string;
	degree: string;
	image: string;
	from: number;
	to: number | string;
	cgpa: string;
	flip: boolean;
	link: string;
}

export default function EducationEventHorizon(props: Props) {
	const [scrollPos, setScrollPos] = createSignal(0);
	let cardRef: HTMLDivElement | undefined;
	let targetScroll = 0;
	let currentScroll = 0;
	let rafId: number;

	const smoothScroll = () => {
		// Lerp factor (0.1 = slow/smooth, 0.2 = faster)
		currentScroll += (targetScroll - currentScroll) * 0.1;
		setScrollPos(currentScroll);

		if (Math.abs(targetScroll - currentScroll) > 0.0001) {
			rafId = requestAnimationFrame(smoothScroll);
		}
	};

	const handleScroll = () => {
		if (!cardRef) return;
		const rect = cardRef.getBoundingClientRect();
		const viewHeight = window.innerHeight;

		// Update target
		targetScroll = Math.max(
			0,
			Math.min(1, (viewHeight - rect.top) / (viewHeight + rect.height)),
		);

		// Start animation if not already running
		cancelAnimationFrame(rafId);
		rafId = requestAnimationFrame(smoothScroll);
	};

	onMount(() => {
		if (typeof window !== "undefined") {
			window.addEventListener("scroll", handleScroll, { passive: true });
			handleScroll();
		}
	});

	onCleanup(() => {
		if (typeof window !== "undefined") {
			window.removeEventListener("scroll", handleScroll);
			cancelAnimationFrame(rafId);
		}
	});

	// ... (rest of the component logic)

	return (
		<div
			ref={cardRef}
			class={`relative w-full min-h-[400px] flex items-center mb-32 group ${props.flip ? "flex-row-reverse" : "flex-row"}`}
			style={{
				perspective: "2000px",
				"will-change": "transform",
			}}
		>
			{/* Backlight Glow (The Event Horizon) */}
			<div
				class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 opacity-40 blur-[140px] rounded-full transition-all duration-1000 group-hover:opacity-60 group-hover:scale-[2.5] pointer-events-none"
				style={{
					background: `radial-gradient(circle, var(--color-primary) 0%, transparent 70%)`,
					transform: `translateZ(-100px) scale(${1 + scrollPos() * 0.3})`,
					"will-change": "transform, opacity",
				}}
			/>

			{/* Main Image Container (The Archive) */}
			<div
				class="relative w-full md:w-4/5 lg:w-3/5 aspect-video overflow-hidden transition-transform duration-500 ease-out"
				style={{
					transform: `rotateY(${props.flip ? "-12deg" : "12deg"}) rotateX(${(scrollPos() - 0.5) * 10}deg)`,
					"box-shadow": "0 0 50px rgba(0,0,0,0.5)",
					"will-change": "transform",
				}}
			>
				{/* Dynamic Morphing Mask */}
				<div
					class="absolute inset-0 w-full h-full bg-neutral-900 shadow-2xl overflow-hidden"
					style={{
						"clip-path": `polygon(
                            ${5 + scrollPos() * 10}% 0%, 
                            ${95 - scrollPos() * 10}% 0%, 
                            100% ${20 + scrollPos() * 20}%, 
                            100% ${80 - scrollPos() * 20}%, 
                            ${95 - scrollPos() * 10}% 100%, 
                            ${5 + scrollPos() * 10}% 100%, 
                            0% ${80 - scrollPos() * 20}%, 
                            0% ${20 + scrollPos() * 20}%
                        )`,
						transition: "clip-path 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
						"will-change": "clip-path",
					}}
				>
					<img
						src={props.image}
						alt={props.institution}
						class="w-full h-full object-cover shadow-2xl transition-all duration-1000 group-hover:scale-125 select-none"
						style={{
							transform: `translateY(${(scrollPos() - 0.5) * -80}px) scale(1.1)`,
							"will-change": "transform",
						}}
					/>

					{/* Scanning Overlay */}
					<div class="absolute inset-0 bg-linear-to-b from-transparent via-white/5 to-transparent h-1/2 w-full -translate-y-full group-hover:animate-scan" />
					<div
						class="absolute inset-0 pointer-events-none opacity-10 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] mix-blend-overlay"
						style={{ filter: "contrast(170%) brightness(1000%)" }}
					/>
					<div class="absolute inset-0 bg-linear-to-t from-black/95 via-black/20 to-transparent" />
				</div>
			</div>

			{/* Floating Data Overlay */}
			<div
				class={`absolute z-10 w-full md:w-2/3 p-6 md:p-12 flex flex-col pointer-events-none transition-all duration-500 ease-out ${props.flip ? "left-0 items-start md:pl-24" : "right-0 items-end text-right md:pr-24"}`}
				style={{
					transform: `translateZ(150px) translateY(${(scrollPos() - 0.5) * 120}px)`,
					"text-shadow": "0 10px 30px rgba(0,0,0,0.8)",
					"will-change": "transform",
				}}
			>
				<div
					class={`flex flex-col ${props.flip ? "items-start" : "items-end"}`}
				>
					<h2 class="text-4xl md:text-7xl font-black text-white mb-2 tracking-tight uppercase italic leading-none">
						{props.institution}
					</h2>
					<h3 class="text-xl md:text-3xl text-secondary-content font-bold mb-4 max-w-xl">
						{props.degree}
					</h3>
					<div class="flex items-center gap-6 text-xl text-secondary/60 font-mono">
						<span>
							{props.from} — {props.to}
						</span>
						<div class="h-1 w-12 bg-white/20" />
						<span class="text-white font-bold">{props.cgpa}</span>
					</div>
				</div>

				{/* Decorative Elements */}
				<div class={`mt-12 flex gap-2 ${props.flip ? "" : "flex-row-reverse"}`}>
					<div class="h-2 w-24 bg-primary/50" />
					<div class="h-2 w-8 bg-primary" />
					<div class="h-2 w-4 bg-white/20" />
				</div>
			</div>
		</div>
	);
}
