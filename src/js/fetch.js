function getNested(obj, path) {
  return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
}

document.querySelectorAll("[\\@fetch]").forEach(async container => {
  const url = container.getAttribute("@fetch");
  if (!url) return;

  try {
    const res = await fetch(url);
    const data = await res.json();

    let iterate = container.getAttribute("@iterate") || "all";
let indices = [];

if (Array.isArray(data)) {
  if (!iterate) iterate = "all";

  // --- Handle filter first ---
  if (iterate.startsWith("filter:")) {
    const expr = iterate.slice(7).trim();
    indices = data
      .map((item, index) => ({item, index}))
      .filter(({item, index}) => {
        try {
          return new Function("item", "index", `return ${expr}`)(item, index);
        } catch (e) {
          console.error("Error in filter expression:", expr, e);
          return false;
        }
      })
      .map(({index}) => index);
  } 
  // --- Other cases ---
  else {
    switch(iterate) {
      case "all":
        indices = Array.from(data.keys());
        break;
      case "first":
        indices = [0];
        break;
      case "last":
        indices = [data.length - 1];
        break;
      case "odd":
        indices = data.map((_, i) => i).filter(i => i % 2 !== 0);
        break;
      case "even":
        indices = data.map((_, i) => i).filter(i => i % 2 === 0);
        break;
      default:
        if (/^\d+$/.test(iterate)) {
          indices = Array.from({length: Math.min(Number(iterate), data.length)}, (_, i) => i);
        } else if (/^range:(\d+)-(\d+)$/.test(iterate)) {
          const [, start, end] = iterate.match(/^range:(\d+)-(\d+)$/);
          indices = Array.from({length: end-start+1}, (_, i) => parseInt(start)+i)
                          .filter(i => i < data.length);
        } else {
          indices = [0]; // fallback
        }
        break;
    }
  }

  // --- Render template ---
  const template = container.innerHTML;
  let output = "";

  indices.forEach(i => {
    const item = data[i];
    let html = template;

    html = html.replace(/@fetch\.([\w\d_.-]+)/g, (_, path) => {
      const val = getNested(item, path);
      return val ?? "";
    });

    output += html;
  });

  container.innerHTML = output;
}
else {
      // Single object fallback
      container.querySelectorAll("*").forEach(el => {
        el.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = node.textContent.replace(
              /@fetch\.([\w\d_.-]+)/g,
              (_, path) => getNested(data, path) ?? ""
            );
          }
        });
      });
    }

  } catch (err) {
    console.error("Fetch failed:", err);
    container.textContent = "⚠ Fetch error";
  }

  container.removeAttribute("@fetch");
  container.removeAttribute("@iterate");
});
