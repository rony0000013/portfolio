import { For, Show } from "solid-js";

export default function Projects({ projects }) {
	// console.log(typeof(projects.features), projects.links);
	return (
		<div class="flex">

			<For each={projects}>
				{(item) => (
					<div
						class="card w-96 backdrop-blur-md mt-[10vh] text-white mask mask-decagon p-5"
						data-tilt
						data-tilt-reverse
						data-tilt-full-page-listening
					>
						<figure>
							<img
								src={item.data.image}
								alt={item.data.title}
								class="rounded-lg"
							/>
						</figure>
						<div class="card-body">
							<h2 class="card-title">
								{item.data.title}
								<Show when={item.data.links.github !== undefined}>
									<a href={item.data.links.github}>
										<span class="icon-[line-md--github-loop] size-8  badge badge-secondary "></span>
									</a>
								</Show>
							</h2>
							<p>{item.data.description}</p>
							<div class="flex flex-wrap gap-2">
								<For each={item.data.tech}>
									{(tech) => <span class="badge badge-primary">{tech}</span>}
								</For>
							</div>
							<div class="card-actions justify-center gap-5">
									<a href={`/projects/${item.slug}/`}>
										<button
											class="btn btn-primary w-full h-full"
											type="button"
											data-tilt
											data-tilt-full-page-listening
										>
											Visit
											<span class="icon-[iconamoon--arrow-top-right-5-circle-fill] w-8 h-8 text-error" ></span>
										</button>
									</a>
							</div>
						</div>
					</div>
				)}
			</For>
		</div>
	);
}
