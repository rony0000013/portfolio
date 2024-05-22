export default function Themes() {
	return (
		<div class="dropdown ">
			<div tabindex="0" role="button" class="btn m-1 dark:border-white">
				<span class="icon-[line-md--star-pulsating-twotone-loop] btn btn-primary size-8 " />
				Theme
				<span class="icon-[la--angle-down] size-4 text-black" />
			</div>
			<ul
				tabindex="0"
				class="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-full"
			>
				<li>
					<input
						type="radio"
						name="theme-dropdown"
						class="btn btn-sm btn-block btn-ghost justify-start"
						aria-label="White"
						value="light"
						data-set-theme=""
						data-act-class="ACTIVECLASS"
					/>
				</li>
				<li>
					<input
						type="radio"
						name="theme-dropdown"
						class="btn btn-sm btn-block btn-ghost justify-start"
						aria-label="Dark"
						value="dark"
						data-set-theme="dark"
						data-act-class="ACTIVECLASS"
					/>
				</li>
				<li>
					<input
						type="radio"
						name="theme-dropdown"
						class="btn btn-sm btn-block btn-ghost justify-start"
						aria-label="Retro"
						value="retro"
						data-set-theme="retro"
						data-act-class="ACTIVECLASS"
					/>
				</li>
				<li>
					<input
						type="radio"
						name="theme-dropdown"
						class="btn btn-sm btn-block btn-ghost justify-start"
						aria-label="Cyberpunk"
						value="cyberpunk"
						data-set-theme="cyberpunk"
						data-act-class="ACTIVECLASS"
					/>
				</li>
				<li>
					<input
						type="radio"
						name="theme-dropdown"
						class="btn btn-sm btn-block btn-ghost justify-start"
						aria-label="Valentine"
						value="valentine"
						data-set-theme="valentine"
						data-act-class="ACTIVECLASS"
					/>
				</li>
				<li>
					<input
						type="radio"
						name="theme-dropdown"
						class="btn btn-sm btn-block btn-ghost justify-start"
						aria-label="Aqua"
						value="aqua"
						data-set-theme="aqua"
						data-act-class="ACTIVECLASS"
					/>
				</li>
				<li>
					<input
						type="radio"
						name="theme-dropdown"
						class="btn btn-sm btn-block btn-ghost justify-start"
						aria-label="Cupcake"
						value="cupcake"
						data-set-theme="cupcake"
						data-act-class="ACTIVECLASS"
					/>
				</li>
			</ul>
		</div>
	);
}
