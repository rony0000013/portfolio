import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import { brandColors, techCategories } from "../constants/techIcons";

interface TechIcon {
	name: string;
	icon: string;
	color?: string;
}

interface Props {
	title: string;
	icons?: Record<string, string>;
	category?: keyof typeof techCategories;
}

export default function HoneycombGrid(props: Props) {
	const [mousePos, setMousePos] = createSignal({ x: -1000, y: -1000 });

	// CRITICAL: We MUST initialize to a constant value (390) for both SSR and initial Client render
	// to ensure hydration successfuly matches the server's output.
	// The real window width will be set immediately after in onMount.
	const [windowWidth, setWindowWidth] = createSignal(390);

	onMount(() => {
		// Track the exact window width reactively
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener("resize", handleResize);

		// Track mouse for the proximity neon glow
		const handleMouseMove = (e: MouseEvent) =>
			setMousePos({ x: e.clientX, y: e.clientY });
		window.addEventListener("mousemove", handleMouseMove);

		// Force an immediate layout calculation on mount
		handleResize();

		onCleanup(() => {
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("mousemove", handleMouseMove);
		});
	});

	// Pure reactive math: This automatically recalculates if windowWidth changes
	const layoutData = createMemo(() => {
		const w = windowWidth();
		let cols = 7;
		let hexW = 130;

		// Enforce 2-3 hexagons per layer strictly on mobile (< 640px)
		if (w < 640) {
			cols = 3;
			// Safe math: Viewport width minus padding (32px), divided by 3, minus CSS margins (4px)
			hexW = Math.floor((w - 32) / 3) - 4;
		} else if (w < 800) {
			cols = 4;
			hexW = 100;
		} else if (w < 1024) {
			cols = 5;
			hexW = 110;
		} else if (w < 1280) {
			cols = 6;
			hexW = 120;
		} else {
			cols = 7;
			hexW = 130;
		}

		// Bounded limits: Never smaller than 60px, never larger than 130px
		hexW = Math.max(60, Math.min(130, hexW));

		// SAFETY FIX: Ensure cols is at least 2 to prevent infinite loops in the layout worker
		const finalCols = Math.max(2, cols);

		if (typeof window === "undefined") {
			// console.log(`[SSR] HoneycombGrid: w=${w}, cols=${finalCols}`);
		}

		return { cols: finalCols, hexW };
	});

	const techRows = createMemo(() => {
		// Use category if provided (to avoid Astro prop serialization issues), otherwise fallback to icons
		const rawIcons = props.category
			? techCategories[props.category]
			: props.icons;
		if (!rawIcons || typeof rawIcons !== "object") return [];

		// Handle potential Astro serialization artifacts if still using icons prop directly
		const sanitizedIcons = (
			Array.isArray(rawIcons)
				? (
						rawIcons as unknown as [
							unknown,
							Record<string, string | { src: string }>,
						]
					)[1]
				: rawIcons
		) as Record<string, string | { src: string }>;

		const list: TechIcon[] = (
			Object.entries(sanitizedIcons) as [string, string | { src: string }][]
		).map(([name, icon]) => ({
			name,
			icon: typeof icon === "string" ? icon : icon.src,
			color: brandColors[name] || "#60a5fa",
		}));

		const rows: (TechIcon | { isPadding: boolean; id: string })[][] = [];
		const { cols } = layoutData();

		if (cols < 1) return []; // Safety

		let tempI = 0;
		let isMax = true;
		let safety = 0;

		while (tempI < list.length && safety < 100) {
			safety++;
			const size = isMax ? cols : cols - 1;
			const slice = list.slice(tempI, tempI + Math.max(1, size));

			// Padding
			if (slice.length < size) {
				const diff = size - slice.length;
				const left = Math.floor(diff / 2);
				const right = diff - left;
				const padded = [
					...Array(left)
						.fill(0)
						.map((_, idx) => ({
							isPadding: true,
							id: `pad-l-${safety}-${idx}`,
						})),
					...slice,
					...Array(right)
						.fill(0)
						.map((_, idx) => ({
							isPadding: true,
							id: `pad-r-${safety}-${idx}`,
						})),
				];
				rows.push(padded);
			} else {
				rows.push(slice);
			}

			tempI += Math.max(1, size);
			isMax = !isMax;
		}
		return rows;
	});

	return (
		<div class="w-full max-w-7xl mx-auto pt-8 pb-4 px-2 sm:px-4 select-none overflow-visible">
			<h3 class="text-xl md:text-2xl font-bold text-white/80 mb-10 text-center tracking-[0.4em] uppercase">
				{props.title}
			</h3>

			<div class="flex flex-col items-center pb-12 overflow-visible">
				<For each={techRows()}>
					{(row, rowIndex) => {
						// Perfect geometric math: Pointy hexagons interlock vertically by exactly 25% of their height
						const hexHeight = layoutData().hexW * 1.1547;

						// We use negative top margin on all rows after the first to pull them up into the interlock
						const overlapMargin = rowIndex() === 0 ? 0 : -(hexHeight * 0.25);

						return (
							<div
								class="flex justify-center flex-nowrap"
								style={{ "margin-top": `${overlapMargin}px` }}
							>
								<For each={row}>
									{(tech) => (
										<div
											class="mx-[2px] shrink-0"
											style={{
												width: `${layoutData().hexW}px`,
												height: `${hexHeight}px`,
											}}
										>
											{!("isPadding" in tech) && (
												<Hexagon
													tech={tech}
													mousePos={mousePos()}
													size={layoutData().hexW}
												/>
											)}
										</div>
									)}
								</For>
							</div>
						);
					}}
				</For>
			</div>
		</div>
	);
}

function Hexagon(p: {
	tech: TechIcon;
	mousePos: { x: number; y: number };
	size: number;
}) {
	let hexRef: HTMLButtonElement | undefined;
	const [isHovered, setIsHovered] = createSignal(false);

	const proximityGlow = createMemo(() => {
		if (!hexRef || isHovered()) return 0;
		const rect = hexRef.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;
		const dist = Math.hypot(p.mousePos.x - centerX, p.mousePos.y - centerY);

		const maxDist = 200;
		if (dist < maxDist) return 1 - dist / maxDist;
		return 0;
	});

	return (
		<button
			type="button"
			ref={hexRef}
			tabIndex={0}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={() => setIsHovered(!isHovered())}
			class="relative w-full h-full cursor-pointer group transition-all duration-300 bg-transparent border-none p-0 block appearance-none text-left"
			style={{
				"z-index": isHovered() ? 50 : 1,
				filter: isHovered()
					? `drop-shadow(0 0 15px ${p.tech.color}80) drop-shadow(0 0 30px ${p.tech.color}40)`
					: `drop-shadow(0 0 ${10 * proximityGlow()}px ${p.tech.color}40)`,
			}}
		>
			<div
				class="absolute inset-0 transition-colors duration-300"
				style={{
					"clip-path":
						"polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
					background: isHovered()
						? `${p.tech.color}80`
						: proximityGlow() > 0
							? `${p.tech.color}40`
							: "#222",
				}}
			/>

			<div
				class="absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 origin-center"
				style={{
					"clip-path":
						"polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
					transform: isHovered() ? "scale(0.92)" : "scale(0.96)",
					background: "rgba(10, 10, 10, 0.6)",
					"backdrop-filter": "blur(12px)",
					border: "1px solid rgba(255, 255, 255, 0.05)",
				}}
			>
				<div class="relative flex flex-col items-center justify-center w-full h-full">
					<div
						class="absolute transition-opacity duration-500 rounded-full"
						style={{
							background: `radial-gradient(circle, ${p.tech.color} 0%, ${p.tech.color}00 70%)`,
							filter: "blur(30px)",
							width: `${p.size * 0.8}px`,
							height: `${p.size * 0.8}px`,
							opacity: isHovered() ? 0.8 : 0.35,
						}}
					/>

					<img
						src={p.tech.icon}
						alt={p.tech.name}
						class="relative object-contain transition-all duration-500"
						style={{
							width: `${p.size * 0.4}px`,
							height: `${p.size * 0.4}px`,
							filter: isHovered()
								? `drop-shadow(0 0 10px ${p.tech.color})`
								: "none",
							opacity: isHovered() ? 1 : 0.8,
							transform: isHovered()
								? "scale(1.1) translateY(-4px)"
								: "scale(1) translateY(0px)",
						}}
					/>
				</div>
			</div>

			<div
				class="absolute left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-300 z-100"
				style={{
					opacity: isHovered() ? 1 : 0,
					bottom: `-${p.size * 0.3}px`,
					transform: isHovered() ? "translateY(0)" : "translateY(-10px)",
				}}
			>
				<div
					class="px-2 py-1 bg-black/95 backdrop-blur-md border rounded-md whitespace-nowrap font-mono font-bold tracking-widest shadow-xl uppercase"
					style={{
						"border-color": `${p.tech.color}40`,
						color: p.tech.color,
						"box-shadow": `0 4px 12px ${p.tech.color}30`,
						"font-size": `${Math.max(9, p.size * 0.095)}px`,
					}}
				>
					{p.tech.name}
				</div>
			</div>
		</button>
	);
}
