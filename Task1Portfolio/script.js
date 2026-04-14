document.body.classList.add('js-loaded');

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -30px 0px'
});

document.querySelectorAll('.reveal').forEach(function(el, i) {
  el.style.transitionDelay = ((i % 4) * 0.08) + 's';
  observer.observe(el);
});

setTimeout(function() {
  document.querySelectorAll('.reveal').forEach(function(el) {
    el.classList.add('visible');
  });
}, 2000);
