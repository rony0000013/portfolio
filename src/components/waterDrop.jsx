import anime from "animejs";


const GRID_WIDTH = 30;
const GRID_HEIGHT = 30;

const DotGrid = () => {
  const handleDotClick = (e) => {
    anime({
      targets: ".dot-point",
      scale: [
        { value: 1.35, easing: "easeOutSine", duration: 250 },
        { value: 1, easing: "easeInOutQuad", duration: 500 },
      ],
      translateY: [
        { value: -15, easing: "easeOutSine", duration: 250 },
        { value: 0, easing: "easeInOutQuad", duration: 500 },
      ],
      opacity: [
        { value: 1, easing: "easeOutSine", duration: 250 },
        { value: 0.5, easing: "easeInOutQuad", duration: 500 },
      ],
      delay: anime.stagger(100, {
        grid: [GRID_WIDTH, GRID_HEIGHT],
        from: e.target.dataset.index,
      }),
    });
  };
  
  const dots = [];
  let index = 0;
  
  for (let i = 0; i < GRID_WIDTH; i++) {
    for (let j = 0; j < GRID_HEIGHT; j++) {
      dots.push(
        <div
        class="group cursor-crosshair rounded-full p-2 transition-colors hover:bg-slate-600"
        data-index={index}
        key={`${i}-${j}`}
        >
          <div
            class="dot-point h-2 w-2  bg-gradient-to-b from-slate-700 to-slate-400 opacity-50 group-hover:from-indigo-600 group-hover:to-white"
            data-index={index}
            />
        </div>
      );
      index++;
    }
  }
  
  return (
    <div
    onclick={handleDotClick}
    class="grid w-fit grid-cols-30"
    >
      {dots}
    </div>
  );
};
const WaterDropGrid = () => {
  return (
    <div class="relative grid place-content-center bg-slate-900 px-8 py-12">
      <DotGrid />
    </div>
  );
};

export default WaterDropGrid;