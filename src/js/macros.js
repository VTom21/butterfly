function processTemplate(root = document.body) {
  // First, convert text-based markers to comment nodes
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach((node) => {
    const text = node.textContent.trim();
    const directives = ["@cycle", "@endcycle", "@stop", "@resume"];

    if (directives.some((d) => text.startsWith(d))) {
      const comment = document.createComment(text);
      node.parentNode.replaceChild(comment, node);
    }
  });

  // Now process comment-based cycles
  const allNodes = Array.from(root.querySelectorAll("*")).flatMap((el) =>
    Array.from(el.childNodes),
  );

  for (const node of allNodes) {
    if (
      node.nodeType === Node.COMMENT_NODE &&
      node.textContent.trim().startsWith("@cycle")
    ) {
      const match = node.textContent.match(/@cycle\s+(\w+)\s+in\s+(\w+)/);
      if (!match) continue;

      const [_, varName, arrName] = match;
      const array = window[arrName];
      if (!array || !Array.isArray(array)) continue;

      const parent = node.parentNode;
      const templateNodes = [];
      let current = node.nextSibling;

      // Collect all nodes until @endcycle comment
      while (current) {
        if (
          current.nodeType === Node.COMMENT_NODE &&
          current.textContent.trim().startsWith("@endcycle")
        ) {
          break;
        }
        templateNodes.push(current);
        current = current.nextSibling;
      }

      const endCycleNode = current;

      const fragments = [];

      outer: for (let index = 0; index < array.length; index++) {
        const val = array[index];
        const fragment = document.createDocumentFragment();
        let skipIteration = false;

        for (const n of templateNodes) {
          // 🔁 @continue
          if (
            n.nodeType === Node.COMMENT_NODE &&
            n.textContent.trim().startsWith("@resume")
          ) {
            const expr = n.textContent.match(/@resume\((.+)\)/)?.[1];
            if (expr) {
              try {
                const fn = new Function(
                  varName,
                  "index",
                  "array",
                  "Math",
                  `return ${expr};`,
                );
                if (fn(val, index, array, Math)) {
                  skipIteration = true;
                  break;
                }
              } catch (e) {
                console.error("Error in @resume:", expr, e);
              }
            }
            continue;
          }

          // 🛑 @break
          if (
            n.nodeType === Node.COMMENT_NODE &&
            n.textContent.trim().startsWith("@stop")
          ) {
            const expr = n.textContent.match(/@stop\((.+)\)/)?.[1];
            if (expr) {
              try {
                const fn = new Function(
                  varName,
                  "index",
                  "array",
                  "Math",
                  `return ${expr};`,
                );
                if (fn(val, index, array, Math)) {
                  break outer;
                }
              } catch (e) {
                console.error("Error in @stop:", expr, e);
              }
            }
            continue;
          }

          const clone = n.cloneNode(true);
          const keep = processNode(clone, varName, val, index, array);
          if (keep) fragment.appendChild(clone);
        }

        if (skipIteration) continue;

        if (fragment.hasChildNodes()) {
          fragments.push(fragment);
        }
      }

      // Remove original template
      templateNodes.forEach((n) => n.remove());

      // Insert all fragments
      fragments.forEach((frag) => parent.insertBefore(frag, endCycleNode));

      // Remove markers
      node.remove();
      if (endCycleNode) endCycleNode.remove();
    }
  }
}

function processNode(node, varName, value, index, array) {
  // Handle @if attribute on elements
  if (node.nodeType === Node.ELEMENT_NODE && node.hasAttribute("@if")) {
    const expr = node.getAttribute("@if");
    try {
      const fn = new Function(
        varName,
        "index",
        "array",
        "Math",
        `return ${expr};`,
      );
      if (!fn(value, index, array, Math)) {
        return false; // Don't include this node
      }
    } catch (e) {
      console.error("Error in @if:", expr, e);
      return false;
    }
    node.removeAttribute("@if");
  }

  // Replace expressions in text content
  if (node.nodeType === Node.TEXT_NODE) {
    node.textContent = node.textContent.replace(/@\{([^}]+)\}/g, (_, expr) => {
      try {
        const fn = new Function(
          varName,
          "index",
          "array",
          "Math",
          `return ${expr};`,
        );
        return fn(value, index, array, Math);
      } catch (e) {
        console.error("Expression error:", expr, e);
        return "";
      }
    });
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    // Process all child nodes recursively
    Array.from(node.childNodes).forEach((child) => {
      processNode(child, varName, value, index, array);
    });
  }

  return true; // Include this node
}

function processRepeat(root = document.body) {
  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) return;

    if (node.innerHTML && node.innerHTML.includes("@repeat")) {
      const repeatRegex = /@repeat\((\d+)\)([\s\S]*?)@endrepeat/g;
      let html = node.innerHTML;
      let match;

      while ((match = repeatRegex.exec(html)) !== null) {
        const count = parseInt(match[1], 10);
        const content = match[2];
        let repeated = "";

        for (let i = 0; i < count; i++) {
          repeated += content.replace(/@{index}/g, i);
        }

        html = html.replace(match[0], repeated);
        repeatRegex.lastIndex = 0;
      }

      node.innerHTML = html;
    }

    node.childNodes.forEach((child) => processNode(child));
  }

  processNode(root);
}

document.addEventListener("DOMContentLoaded", () => processTemplate());
document.addEventListener("DOMContentLoaded", () => processRepeat());
