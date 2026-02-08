//Dropdown Logic

document.querySelectorAll(".dropdown-toggle").forEach(btn =>{
    btn.addEventListener('click', e =>{
        const dropdown = btn.parentElement;

        dropdown.classList.toggle("show");
    });
});

document.addEventListener('click', e => {
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });
});