//built in events

const eventMap = {
  "@click": "click",
  "@dbclick": "dblclick",
  "@m-down": "mousedown",
  "@m-move": "mousemove",
  "@m-over": "mouseover",
  "@m-up": "mouseup",
  "@m-out": "mouseout",
  "@m-wheel": "wheel",
  "@scroll": "scroll",
  "@paste": "paste",
  "@copy": "copy",
  "@k-press": "keypress",
  "@k-down": "keydown",
  "@k-up": "keyup",
  "@load": "load",
  "@change": "change",
  "@resize": "resize",
  "@blur": "blur",
  "@submit": "submit",
  "@search": "search",
  "@input": "input",
  "@select": "select",
  "@reset": "reset",
  "@focus": "focus",
  "@drag": "drag",
  "@drag-end": "dragend",
  "@drag-enter": "dragenter",
  "@drag-leave": "dragleave",
  "@drag-over": "dragover",
  "@drag-start": "dragstart",
};

const attrs = {};

for (const attr in eventMap) {
  const domEvent = eventMap[attr];
  if (!attrs[domEvent]) attrs[domEvent] = [];
  attrs[domEvent].push(attr);
}

Object.keys(attrs).forEach((domEvent) => {
  document.addEventListener(domEvent, (e) => {
    let el = e.target;

    while (el && el !== document) {
      for (const attr of attrs[domEvent]) {
        const handlerName = el.getAttribute(attr);

        if (handlerName) {
          const handler = window[handlerName];
          if (typeof handler === "function") {
            handler.call(el, e);
          } else {
            console.warn(
              `Handler "${handlerName}" for "${attr}" is not defined`,
            );
          }
          return;
        }
      }
      el = el.parentElement;
    }
  });
});

// setInterval => @interlude

document.querySelectorAll("[\\@interlude]").forEach((el) => {
  const fnName = el.getAttribute("@interlude");
  const time = parseInt(el.getAttribute("@time")) || 1000;
  const fn = window[fnName];
  if (typeof fn === "function") {
    setInterval(() => fn.call(el), time);
  }
});

// setTimeout => @halt

document.querySelectorAll("[\\@halt]").forEach((el) => {
  const fnName = el.getAttribute("@halt");
  const time = parseInt(el.getAttribute("@time")) || 1000;
  const fn = window[fnName];
  if (typeof fn === "function") {
    setTimeout(() => fn.call(el), time);
  }
});

//@countdown & @tick

document.querySelectorAll("[\\@countdown]").forEach((el) => {
  const handlerName = el.getAttribute("@countdown");
  const handler = window[handlerName];
  const duration = parseInt(el.getAttribute("@tick")) || 3000;

  if (typeof handler !== "function") {
    console.warn(`Handler "${handlerName}" for @countdown is not defined`);
    return;
  }

  let remaining = duration;
  const interval = 100; // update every 100ms

  // Initialize content using template {{countdown}}
  const originalText = el.textContent;

  const countdownTimer = setInterval(() => {
    remaining -= interval;

    // Replace {{countdown}} placeholder
    const seconds = Math.ceil(remaining / 1000);
    el.textContent = originalText.replace("((countdown))", seconds);

    if (remaining <= 0) {
      clearInterval(countdownTimer);
      el.textContent = originalText.replace("((countdown))", 0);
      handler.call(el); // call the handler
    }
  }, interval);
});

//@input-min & @input-max

document.querySelectorAll("form").forEach((form) => {
  form.querySelectorAll("input, textarea").forEach((el) => {
    const minAttr = el.getAttribute("@input-min");
    const maxAttr = el.getAttribute("@input-max");
    const min = minAttr ? parseInt(minAttr) : null;
    const max = maxAttr ? parseInt(maxAttr) : null;

    el.dataset.validMin = min ? "false" : "true";
    el.dataset.validMax = max ? "false" : "true";

    el.addEventListener("input", () => {
      const len = el.value.length;

      if (min && len < min) {
        el.dataset.validMin = "false";
      } else {
        el.dataset.validMin = "true";
      }

      if (max && len > max) {
        el.dataset.validMax = "false";
      } else {
        el.dataset.validMax = "true";
      }
    });
  });

  form.addEventListener("submit", (e) => {
    const invalidInput = form.querySelector(
      "input[\\@input-min][data-valid-min='false'], textarea[\\@input-min][data-valid-min='false'], " +
        "input[\\@input-max][data-valid-max='false'], textarea[\\@input-max][data-valid-max='false']",
    );

    if (invalidInput) {
      e.preventDefault();
      const minVal = invalidInput.getAttribute("@input-min");
      const maxVal = invalidInput.getAttribute("@input-max");
      let msg = "Invalid input.";

      if (minVal && invalidInput.dataset.validMin === "false") {
        msg = `Please enter at least ${minVal} characters`;
      } else if (maxVal && invalidInput.dataset.validMax === "false") {
        msg = `Please enter no more than ${maxVal} characters`;
      }

      alert(msg);
      invalidInput.focus();
    }
  });
});

//@regex

const regexTypes = {
  letters: /^[a-zA-Z]+$/,
  numbers: /^[0-9]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  hex: /^[0-9a-fA-F]+$/,
  pass_special: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
  pass_simple: /^[\w!@#$%^&*()_+]{6,}$/,
  date: /^\d{4}-\d{2}-\d{2}$/,
  time: /^([01]\d|2[0-3]):([0-5]\d)$/,
  phone: /^\+?[0-9]{7,15}$/,
};

document
  .querySelectorAll("input[\\@regex], textarea[\\@regex]")
  .forEach((el) => {
    const type = el.getAttribute("@regex");
    const regex = regexTypes[type];

    if (!regex) {
      console.warn(`Unknown @regex type: "${type}"`);
      return;
    }

    el.dataset.validRegex = "false";

    el.addEventListener("input", () => {
      if (regex.test(el.value)) {
        el.dataset.validRegex = "true";
      } else {
        el.dataset.validRegex = "false";
      }
    });
  });

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (e) => {
    const invalid = form.querySelector(
      "input[\\@regex][data-valid-regex='false'], textarea[\\@regex][data-valid-regex='false']",
    );
    if (invalid) {
      e.preventDefault();
      const type = invalid.getAttribute("@regex");
      alert(`Please enter valid ${type}`);
      invalid.focus();
    }
  });
});

//@toggle

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[\\@toggle]").forEach((el) => {
    const classNames = el
      .getAttribute("@toggle")
      .split(",")
      .map((c) => c.trim());
    const targetSelectors = el.getAttribute("@target")
      ? el
          .getAttribute("@target")
          .split(",")
          .map((s) => s.trim())
      : [null];

    el.addEventListener("click", () => {
      classNames.forEach((cls, index) => {
        const selector =
          targetSelectors[index] || targetSelectors[targetSelectors.length - 1];
        const targets = selector ? document.querySelectorAll(selector) : [el];

        targets.forEach((target) => {
          if (!target) return;
          target.classList.toggle(cls);
        });
      });
    });
  });
});

//@resize

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[\\@resize]").forEach((el) => {
    const value = el.getAttribute("@resize");
    if (!value) return;

    const [w, h] = value.split(",");
    const width = parseInt(w);
    const height = parseInt(h);

    if (isNaN(width) || isNaN(height)) return;

    document.body.style.width = width + "px";
    document.body.style.height = height + "px";

    document.documentElement.style.width = width + "px";
    document.documentElement.style.height = height + "px";
  });
});

//@log

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[\\@log]").forEach((el) => {
    const targetValue = el.getAttribute("@log");
    let target;

    if (targetValue === "this") {
      target = el;
    } else if (targetValue === "window") {
      target = window;
    } else if (targetValue === "document") {
      target = document;
    } else {
      target = document.querySelector(targetValue);
    }

    if (!target) {
      console.warn(`@log target "${targetValue}" not found`);
      return;
    }

    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement
    ) {
      console.log(target.value);
    } else if (target instanceof HTMLElement) {
      console.log(target.textContent.trim());
    } else {
      console.log(target);
    }
  });
});

//@trim

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll("input[\\@trim], textarea[\\@trim]")
    .forEach((el) => {
      el.addEventListener("input", () => {
        const cursor = el.selectionStart;
        el.value = el.value.trim();
        el.setSelectionRange(cursor, cursor);
      });
    });
});

//@sanitize

const sanitizeModes = {
  soft: /[<>]/g,
  strict: /[<>{}"'`;]/g,
};

document
  .querySelectorAll("input[\\@sanitize], textarea[\\@sanitize]")
  .forEach((el) => {
    const mode = el.getAttribute("@sanitize") || "soft";
    const regex = sanitizeModes[mode] || sanitizeModes.soft;

    el.addEventListener("input", () => {
      el.value = el.value.replace(regex, "");
    });
  });

//@show & @hide

document.querySelectorAll("[\\@show]").forEach((el) => {
  el.style.visibility = "visible";
});

document.querySelectorAll("[\\@hide]").forEach((el) => {
  el.style.visibility = "hidden";
});

//@src & @alt

document.querySelectorAll("[\\@src]").forEach((el) => {
  const value = el.getAttribute("@src");
  if (!value) return;

  el.setAttribute("src", value);
  el.removeAttribute("@src");
});

document.querySelectorAll("[\\@fallback]").forEach((el) => {
  const value = el.getAttribute("@fallback");
  if (!value) return;

  el.setAttribute("alt", value);
  el.removeAttribute("@fallback");
});

//@link

document.querySelectorAll("[\\@link]").forEach((el) => {
  const value = el.getAttribute("@link");
  if (!value) return;

  el.setAttribute("href", value);
  el.removeAttribute("@link");
});

//@text

document.querySelectorAll("[\\@text]").forEach((el) => {
  const value = el.getAttribute("@text");
  if (!value) return;

  el.innerHTML = value;
  el.removeAttribute("@text");
});

//@placeholder

document.querySelectorAll("[\\@placeholder]").forEach((el) => {
  const value = el.getAttribute("@placeholder");
  if (!value) return;

  if ("placeholder" in el) {
    el.placeholder = value;
  } else {
    el.setAttribute("placeholder", value);
  }

  el.removeAttribute("@placeholder");
});

//@compute

document.querySelectorAll("[\\@compute]").forEach((el) => {
  const value = el.getAttribute("@compute");
  if (!value) return;

  try {
    const fn = new Function("Math", `return ${value};`);
    const result = fn(Math);

    el.innerText += result;
  } catch (e) {
    console.error("Error evaluating @compute:", value, e);
    el.innerText = "";
  }
  el.removeAttribute("@compute");
});

//@class & @id

document.querySelectorAll("[\\@class]").forEach((el) => {
  const value = el.getAttribute("@class");
  if (!value) return;

  el.className = value;
  el.removeAttribute("@class");
});

document.querySelectorAll("[\\@id]").forEach((el) => {
  const value = el.getAttribute("@id");
  if (!value) return;

  el.id = value;
  el.removeAttribute("@id");
});

//@clip

document.querySelectorAll('[\\@clip]').forEach(el => {
  const expr = el.getAttribute('\\@clip'); 
  el.addEventListener('click', async () => {
    let text = el.textContent; 

    if (expr) {
      try {
        const fn = new Function("Math", "el", `return ${expr};`);
        text = fn(Math, el);
      } catch (e) {
        console.error("Error evaluating @clip:", expr, e);
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      console.log("Copied to clipboard:", text);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  });

  el.removeAttribute('@clip');
});



