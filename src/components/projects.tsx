import { For, Show } from "solid-js";

function Card({ item }) {
	return (
		<div
			class="card w-96 backdrop-blur-md  text-white  p-2"
			data-tilt
			data-tilt-reverse
			data-aos="fade-in-out"
		>
			<figure class="rounded-lg">
				<img
					src={item.data.image}
					alt={item.data.title}
					onError={(e) => {
						e.target.onerror = null;
						e.target.src = "https://res.cloudinary.com/dddwknrcm/image/upload/v1716479781/cld-sample-2.jpg";
					}}
				/>
			</figure>
			<div class="card-body">
				<h2 class="card-title">
					{item.data.title}
					<Show when={item.data.links.github !== undefined}>
						<a
							href={item.data.links.github}
							target="_blank"
							aria-label="github-link"
						>
							<span class="icon-[line-md--github-loop] size-8  badge badge-secondary "></span>
						</a>
					</Show>
				</h2>
				<p>{item.data.description}</p>
				<div class="flex flex-wrap gap-2">
					<For each={item.data.tech.slice(0, 4)}>
						{(tech) => <span class="badge badge-primary">{tech}</span>}
					</For>
				</div>
				<div class="card-footer justify-center ">
					<a href={`/projects/${item.slug}/`} aria-label="next-page">
						<button
							class="btn btn-primary w-full h-full"
							type="button"
							data-tilt
							data-tilt-full-page-listening
						>
							Visit
							<span class="icon-[iconamoon--arrow-top-right-5-circle-fill] w-8 h-8 text-error"></span>
						</button>
					</a>
				</div>
			</div>
		</div>
	);
}

export default function Projects({ projects }) {
	// console.log(typeof(projects.features), projects.links);
	return (
		<div class="flex flex-wrap items-center justify-center gap-5">
			<For each={projects}>{(item) => <Card item={item} />}</For>
		</div>
	);
}
