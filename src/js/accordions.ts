const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const item = header.parentElement;
    if(item) item.classList.toggle('active');

    accordionHeaders.forEach(h => {
      if (h !== header) h.parentElement?.classList.remove('active');
    });
  });
});