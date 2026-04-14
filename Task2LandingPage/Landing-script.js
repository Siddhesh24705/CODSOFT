document.body.classList.add('js-ready');

const revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(function(el, i) {
  el.style.transitionDelay = ((i % 5) * 0.07) + 's';
  revealObserver.observe(el);
});

setTimeout(function() {
  document.querySelectorAll('.reveal').forEach(function(el) {
    el.classList.add('in');
  });
}, 2000);


// nav shadow on scroll
const nav = document.querySelector('nav');
window.addEventListener('scroll', function() {
  if (window.scrollY > 40) {
    nav.style.boxShadow = '0 4px 0 #0d0d0d';
  } else {
    nav.style.boxShadow = 'none';
  }
});


// nav link highlight on section scroll
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      navLinks.forEach(function(link) {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = 'var(--orange)';
        }
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(function(sec) { sectionObserver.observe(sec); });


// skill pill hover effect
document.querySelectorAll('.skill-pill').forEach(function(pill) {
  pill.addEventListener('mouseenter', function() {
    this.style.transform = 'translate(-2px, -2px) rotate(-1deg)';
  });
  pill.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});


// work card click to open link
document.querySelectorAll('.work-card[data-href]').forEach(function(card) {
  card.addEventListener('click', function() {
    window.open(this.dataset.href, '_blank');
  });
});