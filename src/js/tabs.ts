const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".tab-panel");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const target = (tab as HTMLElement).dataset.tab;

    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    panels.forEach(panel => {
      panel.classList.toggle("active", (panel as HTMLElement).dataset.tab === target);
    });
  });
});