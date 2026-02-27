const toggleTheme = () => {
    document.body.classList.toggle('dark-theme');
  };
  
  const themeToggle = document.querySelector('#theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }