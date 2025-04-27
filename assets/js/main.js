function switchLang() {
  const html = document.documentElement;
  const langBtn = document.querySelector('.lang-switch');
  if (html.lang === 'ar') {
    html.lang = 'en';
    html.dir = 'ltr';
    langBtn.textContent = 'AR';
    // Optionally, swap text content to English here
  } else {
    html.lang = 'ar';
    html.dir = 'rtl';
    langBtn.textContent = 'EN';
    // Optionally, swap text content to Arabic here
  }
} 