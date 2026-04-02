document.querySelectorAll<HTMLElement>(".range").forEach((t) => {
  const color = t.getAttribute("@range-color");
  const bg = t.getAttribute("@range-bg");

  if (color) t.style.setProperty("--range-color", color);
  if (bg) t.style.setProperty("--range-bg", bg);

  const input = t.querySelector<HTMLInputElement>("input[type='range']");
  if (input) {
    input.style.setProperty("--value", input.value);
    input.addEventListener("input", () => {
      input.style.setProperty("--value", input.value);
    });
  }
});