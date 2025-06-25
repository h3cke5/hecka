document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.querySelector('.preloader');

  window.addEventListener('load', () => {
    preloader.classList.add('hidden');

    document.body.style.overflow = 'auto';

    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  });

  document.body.style.overflow = 'hidden';
});
