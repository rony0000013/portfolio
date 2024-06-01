const themes = [
	"light",
	"dark",
	"cupcake",
	"bumblebee",
	"emerald",
	"corporate",
	"synthwave",
	"retro",
	"cyberpunk",
	"valentine",
	"halloween",
	"garden",
	"forest",
	"aqua",
	"lofi",
	"pastel",
	"fantasy",
	"wireframe",
	"black",
	"luxury",
	"dracula",
	"cmyk",
	"autumn",
	"business",
	"acid",
	"lemonade",
	"night",
	"coffee",
	"winter",
	"dim",
	"nord",
	"sunset",
];

export default function Themes() {
	return (
		<div class="dropdown ">
			<div
				tabindex="-1"
				role="button"
				class="flex justify-center items-center gap-1 align-middle h-[3.5rem] p-2"
			>
				{/* <span class="icon-[line-md--star-pulsating-twotone-loop] btn btn-primary size-8 " /> */}
				<dotlottie-player
					autoplay
					loop
					playMode="normal"
					src="/src/assets/theme.lottie"
					class="p-0 m-0 size-10"
				></dotlottie-player>
				Theme
				<span class="icon-[la--chevron-down] size-4 text-white" />
			</div>
			<ul
				tabindex="-1"
				class="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-full"
			>
				{themes.map((theme, i) => (
				<li key={i}>
					<input
						type="radio"
						name="theme-dropdown"
						class="btn btn-sm btn-block btn-ghost justify-start"
						aria-label={theme}
						value={theme}
						data-set-theme={theme}
						data-act-class="ACTIVECLASS"
					/>
				</li>))}
				
			</ul>
		</div>
	);
}
