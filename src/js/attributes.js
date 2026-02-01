const all = document.querySelectorAll("body *");

const transformMap = new WeakMap();

document.querySelectorAll(".set").forEach((el) => {
  if (!transformMap.has(el)) {
    transformMap.set(el, {});
  }

  const transforms = transformMap.get(el);

  Array.from(el.attributes).forEach((attr) => {
    const name = attr.name;
    const value = attr.value;

    switch (name) {
      case "thickness":
        el.style.borderWidth = value + "px";
        break;

      case "x-mult":
        transforms.scaleX = `scaleX(${value})`;
        break;

      case "y-mult":
        transforms.scaleY = `scaleY(${value})`;
        break;

      case "z-mult":
        transforms.scaleZ = `scaleZ(${value})`;
        break;

      case "mult":
        transforms.scale = `scale(${value})`;
        break;

      case "turn":
        transforms.rotate = `rotate(${value}deg)`;
        break;

      case "x-turn":
        transforms.rotate = `rotateX(${value}deg)`;
        break;

      case "y-turn":
        transforms.rotate = `rotateY(${value}deg)`;
        break;

      case "z-turn":
        transforms.rotate = `rotateZ(${value}deg)`;
        break;

      case "pointer":
        const cursorMap = {
          hand: "pointer",
          grab: "grab",
          cross: "crosshair",
          move: "move",
          script: "text",
          idle: "wait",
          basic: "default",
          abort: "not-allowed",
          query: "help",
          magnify_in: "zoom-in",
          magnify_out: "zoom-out",
          disabled: "none",
        };

        el.style.cursor = cursorMap[value] || value;
        break;

      case "blur":
        el.style.filter = `blur(${value})`;
        break;

      case "grayscale":
        el.style.filter = `grayscale(${value})`;
        break;

      case "light":
        el.style.filter = `brightness(${value})`;
        break;

      case "contrast":
        el.style.filter = `contrast(${value})`;
        break;
    }
  });

  // Rebuild the transform string
  el.style.transform = Object.values(transforms).join(" ");
});

document.querySelectorAll(".rainbow").forEach((el) => {
  const offset = el.getAttribute("offset");
  if (offset) {
    el.style.setProperty("--offset", offset);
  }
});
