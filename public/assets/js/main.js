// BOSSO Origin — Rev3 interaction layer

const BOSSO_CONFIG = {
  whatsappNumber: '6285111586285',
  sheetEndpoint: '',
};

// ─── Reveal on scroll ───
function initReveal() {
  const els = document.querySelectorAll('.kicker, h2, .lead, .hero-meta, .hero-actions, .lot-card, .origin-text, .origin-collage figure, .lot-visual, .lot-specs, .step, .export-text, .procurement-sheet, .faq-list, .contact-copy, .contact-form');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.style.opacity = 1); return; }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transition = `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 0.04}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 0.04}s`;
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(28px)';
    obs.observe(el);
  });
}

// ─── GSAP cinematic motion ───
function initGsap() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero parallax zoom
  gsap.to('.hero-bg', {
    scale: 1.12,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  // Ghost text drift
  gsap.utils.toArray('.ghost').forEach(g => {
    gsap.to(g, {
      x: g.classList.contains('right') ? -60 : 60,
      ease: 'none',
      scrollTrigger: { trigger: g.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  // Origin collage stagger
  gsap.utils.toArray('.origin-collage figure').forEach((fig, i) => {
    gsap.fromTo(fig, { y: 50 + i * 20, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: '.origin-collage', start: 'top 78%' },
      delay: i * 0.15
    });
  });

  // Process steps stagger
  gsap.utils.toArray('.step').forEach((step, i) => {
    gsap.fromTo(step, { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: step, start: 'top 82%' },
      delay: i * 0.06
    });
  });

  // Lot image subtle float
  gsap.to('.lot-hero-img', {
    y: -14,
    ease: 'none',
    scrollTrigger: { trigger: '.lot', start: 'top bottom', end: 'bottom top', scrub: true }
  });
}

// ─── WhatsApp form ───
function initForm() {
  const form = document.getElementById('inquiryForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const msg = [
      '*BOSSO Origin Inquiry*', '',
      `*Name:* ${d.get('name') || '-'}`,
      `*Company:* ${d.get('company') || '-'}`,
      `*Country:* ${d.get('country') || '-'}`,
      `*Buyer Type:* ${d.get('buyerType') || '-'}`,
      `*Quantity:* ${d.get('quantity') || '-'}`,
      `*Email:* ${d.get('email') || '-'}`,
      '', `*Message:* ${d.get('message') || '-'}`,
      '', '_Sent from BOSSO Origin_'
    ].join('\n');

    const url = `https://wa.me/${BOSSO_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;

    if (BOSSO_CONFIG.sheetEndpoint) {
      try { fetch(BOSSO_CONFIG.sheetEndpoint, { method: 'POST', mode: 'no-cors', body: JSON.stringify(Object.fromEntries(d)) }); } catch(err) {}
    }

    status.textContent = 'Opening WhatsApp...';
    window.open(url, '_blank');
    setTimeout(() => { status.textContent = ''; form.reset(); }, 2000);
  });
}

// ─── Init ───
window.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initGsap();
  initForm();
});
