import { createSignal, onMount } from "solid-js";

export default function VisitorCounter() {
	const [count, setCount] = createSignal<string>("...");

	onMount(async () => {
		try {
			const res = await fetch(
				"https://visitor-counter.rony000013.workers.dev/portfolio",
			);
			if (res.ok) {
				const text = await res.text();
				setCount(text);
			}
		} catch (e) {
			console.error("Visitor counter error:", e);
		}
	});

	return (
		<div class="flex items-center gap-3">
			<div class="relative">
				<div class="size-2 bg-primary rounded-full animate-pulse"></div>
				<div
					class="absolute inset-0 size-2 bg-primary rounded-full animate-ping opacity-40"
				></div>
			</div>
			<span class="font-orbitron text-[10px] tracking-[0.3em] text-white/50 uppercase">
				Visitors: <span class="text-primary font-bold">{count()}</span>
			</span>
		</div>
	);
}
