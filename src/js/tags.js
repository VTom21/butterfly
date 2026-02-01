

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

function Divider() {
  document.querySelectorAll("divider").forEach(d => {
    const div = document.createElement("hr");
    d.parentNode?.replaceChild(div, d);
  });
}

function highlight(){
  document.querySelectorAll("highlight").forEach(b => {
    const div = document.createElement("strong");
    div.innerHTML = b.innerHTML; 
    b.parentNode?.replaceChild(div, b);
  });
}


document.addEventListener("DOMContentLoaded", () => {
  Break(); 
  Extra_Break();
  Custom_Break();
  Divider();
  highlight();
});
