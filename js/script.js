/* ============================================================
   Cleopatra Inflatable Events — Interactions
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Sticky header shadow ---------- */
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const toggleNav = (force) => {
    const open = force ?? !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => toggleNav());
  nav.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => toggleNav(false))
  );

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // stagger siblings a touch
            const delay = entry.target.dataset.delay || (i % 4) * 90;
            setTimeout(() => entry.target.classList.add('in'), delay);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const runCounter = (el) => {
    const target = +el.dataset.count;
    const dur = 1600;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => cio.observe(c));
  } else {
    counters.forEach((c) => (c.textContent = c.dataset.count));
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.acc').forEach((acc) => {
    const q = acc.querySelector('.acc__q');
    const a = acc.querySelector('.acc__a');
    q.addEventListener('click', () => {
      const isOpen = acc.classList.contains('open');
      // close others
      document.querySelectorAll('.acc.open').forEach((o) => {
        if (o !== acc) {
          o.classList.remove('open');
          o.querySelector('.acc__a').style.maxHeight = null;
        }
      });
      acc.classList.toggle('open', !isOpen);
      a.style.maxHeight = isOpen ? null : a.scrollHeight + 'px';
    });
  });

  /* ---------- Contact form (mailto delivery) ---------- */
  const CONTACT_EMAIL = 'info@cleopatrainflatables.co.uk';
  const form = document.getElementById('callbackForm');
  const msg = document.getElementById('formMsg');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#name');
      const phone = form.querySelector('#phone');
      const email = form.querySelector('#email');
      const product = form.querySelector('#product');
      const message = form.querySelector('#message');

      // validate required fields
      let ok = true;
      [name, phone].forEach((f) => {
        if (!f.value.trim()) {
          f.style.borderColor = '#e23b6d';
          ok = false;
        } else {
          f.style.borderColor = '';
        }
      });
      if (!ok) return;

      // build a pre-filled email
      const subject = `Callback request — ${name.value.trim()}`;
      const bodyLines = [
        `Name: ${name.value.trim()}`,
        `Phone: ${phone.value.trim()}`,
        `Email: ${email.value.trim() || '—'}`,
        `Interested in: ${product.value || '—'}`,
        '',
        'Message:',
        message.value.trim() || '—',
        '',
        '— Sent from cleopatrainflatables.co.uk',
      ];
      const href =
        `mailto:${CONTACT_EMAIL}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(bodyLines.join('\n'))}`;

      // open the visitor's email app
      window.location.href = href;

      // confirmation + reset
      msg.hidden = false;
      form.reset();
      setTimeout(() => (msg.hidden = true), 8000);
    });
  }

  /* ---------- Play buttons (placeholder) ---------- */
  document.querySelectorAll('.play-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.style.transform = 'scale(.9)';
      setTimeout(() => (btn.style.transform = ''), 150);
    });
  });

  /* ---------- Subtle parallax on hero background ---------- */
  const heroBg = document.querySelector('.hero__bg img');
  if (heroBg && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener(
      'scroll',
      () => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          heroBg.style.transform = `scale(1.15) translateY(${y * 0.15}px)`;
        }
      },
      { passive: true }
    );
  }
})();
