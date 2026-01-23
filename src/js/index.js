
function Break() {
  document.querySelectorAll("break").forEach(b => {
    const div = document.createElement("br");
    b.parentNode?.replaceChild(div, b);
  });
}


function Extra_Break(counter = 2) {
  document.querySelectorAll("extra-break").forEach(b => {
    const fragment = document.createDocumentFragment();
    for(let i = 0; i < counter; i++){
        const div = document.createElement("br");
        fragment.appendChild(div);
    }
    b.parentNode?.replaceChild(fragment, b);
  });
}

function Custom_Break() {
  document.querySelectorAll("custom-break").forEach(b => {
    const fragment = document.createDocumentFragment();
    const howMany = parseInt(b.getAttribute("n") || "0");
    for(let i = 0; i < howMany; i++){
        const div = document.createElement("br");
        fragment.appendChild(div);
    }
    b.parentNode?.replaceChild(fragment, b);
  });
}


document.addEventListener("DOMContentLoaded", () => {
  Break(); 
  Extra_Break();
  Custom_Break();
});
