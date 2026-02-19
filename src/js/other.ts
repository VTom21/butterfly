//Dropdown Logic

document.querySelectorAll(".dropdown-toggle").forEach(btn =>{
    btn.addEventListener('click', e =>{
        const dropdown = btn.parentElement;
        if(!dropdown){return};
        dropdown.classList.toggle("show");
    });
});

document.addEventListener('click', e => {
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    if (!dropdown.contains(e.target as Node)) {
      dropdown.classList.remove('show');
    }
  });
});