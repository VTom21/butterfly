
function Break() {
  document.querySelectorAll("break").forEach(b => {
    const div = document.createElement("br");
    b.parentNode.replaceChild(div, b);
  });
}


function ExtraBreak(counter = 2) {
  document.querySelectorAll("extra-break").forEach(b => {
    const fragment = document.createDocumentFragment();
    for(let i = 0; i < counter; i++){
        const div = document.createElement("br");
        fragment.appendChild(div);
    }
    b.parentNode.replaceChild(fragment, b);
  });
}

function CustomBreak() {
  document.querySelectorAll("custom-break").forEach(b => {
    const fragment = document.createDocumentFragment();
    const howMany = parseInt(b.getAttribute("n"));
    for(let i = 0; i < howMany; i++){
        const div = document.createElement("br");
        fragment.appendChild(div);
    }
    b.parentNode.replaceChild(fragment, b);
  });
}


document.addEventListener("DOMContentLoaded", () => {
  Break(); 
  ExtraBreak();
  CustomBreak();
});
