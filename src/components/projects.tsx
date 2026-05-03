import { For, Show } from "solid-js";

interface ProjectItem {
	id: string;
	data: {
		title: string;
		image: string;
		description: string;
		tech: string[];
		links: {
			github?: string;
		};
	};
}

function Card({ item }: { item: ProjectItem }) {
	return (
		<div
			class="group relative card w-96 backdrop-blur-md bg-[rgba(20,20,30,0.5)] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:border-primary/40 hover:shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.3)] transition-all duration-500 p-2"
			data-tilt
			data-tilt-glare
			data-tilt-max-glare="0.3"
			data-tilt-max="10"
			data-tilt-scale="1.02"
			data-aos="fade-up"
		>
			{/* Scanline overlay effect */}
			<div class="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-size-[100%_2px,3px_100%] z-20 opacity-20"></div>

			<figure class="relative rounded-xl overflow-hidden aspect-video">
				<img
					src={item.data.image}
					alt={item.data.title}
					style={{ "view-transition-name": `project-image-${item.id}` }}
					class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
					onError={(e) => {
						const target = e.currentTarget as HTMLImageElement;
						target.onerror = null;
						target.src =
							"https://res.cloudinary.com/rony-personal/image/upload/v1716479781/cld-sample-2.jpg";
					}}
				/>
				<div class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent z-10Opacity"></div>
			</figure>

			<div class="card-body relative z-30 p-4">
				<h2 class="card-title font-orbitron text-lg tracking-widest text-white flex justify-between items-center group-hover:text-primary transition-colors">
					{item.data.title}
					<Show when={item.data.links.github !== undefined}>
						<a
							href={item.data.links.github}
							target="_blank"
							aria-label="github-link"
							rel="noopener"
							class="hover:scale-110 transition-transform"
						>
							<span class="icon-[line-md--github-loop] size-8 text-primary shadow-[0_0_10px_var(--color-primary)]"></span>
						</a>
					</Show>
				</h2>
				<p class="text-xs opacity-60 font-space-mono line-clamp-2 mt-2 leading-relaxed">
					{item.data.description}
				</p>
				<div class="flex flex-wrap gap-2 mt-4">
					<For each={item.data.tech.slice(0, 4)}>
						{(tech) => (
							<span class="px-2 py-0.5 text-[8px] font-orbitron border border-primary/20 bg-primary/5 rounded-full text-primary/80 tracking-widest uppercase">
								{tech}
							</span>
						)}
					</For>
				</div>
				<div class="card-footer mt-6">
					<a
						href={`/projects/${item.id}/`}
						aria-label="next-page"
						class="w-full"
					>
						<button
							class="w-full py-2.5 rounded-lg font-orbitron text-[9px] tracking-[0.3em] font-bold border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary/60 transition-all duration-300 relative overflow-hidden group/btn"
							type="button"
						>
							<span class="relative z-10 flex items-center justify-center gap-2">
								VIEW
								<span class="icon-[iconamoon--arrow-top-right-5-circle-fill] size-4"></span>
							</span>
							<div class="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
						</button>
					</a>
				</div>
			</div>
			{/* HUD Corner Decorations */}
			<div class="absolute top-2 left-2 size-4 border-t-2 border-l-2 border-primary/20 pointer-events-none group-hover:border-primary group-hover:size-6 transition-all duration-500"></div>
			<div class="absolute bottom-2 right-2 size-4 border-b-2 border-r-2 border-primary/20 pointer-events-none group-hover:border-primary group-hover:size-6 transition-all duration-500"></div>
		</div>
	);
}

export default function Projects({ projects }: { projects: ProjectItem[] }) {
	return (
		<div class="flex flex-wrap items-center justify-center gap-5 mb-10">
			<For each={projects}>{(item) => <Card item={item} />}</For>
		</div>
	);
}
