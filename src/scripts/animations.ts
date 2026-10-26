import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const ready = () => root.classList.add('anim-ready');
const $ = <T extends HTMLElement = HTMLElement>(sel: string, ctx: ParentNode = document) => ctx.querySelector<T>(sel);
const $$ = <T extends HTMLElement = HTMLElement>(sel: string, ctx: ParentNode = document) =>
  Array.from(ctx.querySelectorAll<T>(sel));

/**
 * Elemen dengan class `transition-all` bentrok dengan GSAP (transisi CSS ikut "mengejar" nilai
 * yang diubah GSAP tiap frame, sehingga elemen bisa tertahan transparan). Matikan transisi
 * selama animasi, lalu kembalikan.
 */
function lockTransitions(targets: gsap.TweenTarget): () => void {
  const els = gsap.utils.toArray<HTMLElement>(targets);
  els.forEach((el) => (el.style.transition = 'none'));
  return () => els.forEach((el) => (el.style.transition = ''));
}

/** Pecah teks judul jadi kata-kata yang muncul satu per satu. */
function splitWords(el: HTMLElement): HTMLElement[] {
  const text = (el.textContent || '').trim();
  el.setAttribute('aria-label', text);
  el.textContent = '';
  const inner: HTMLElement[] = [];
  text.split(/\s+/).forEach((word, i, arr) => {
    const mask = document.createElement('span');
    mask.setAttribute('aria-hidden', 'true');
    mask.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;padding-bottom:.12em;margin-bottom:-.12em';
    const w = document.createElement('span');
    w.style.display = 'inline-block';
    w.textContent = word;
    mask.appendChild(w);
    el.appendChild(mask);
    if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
    inner.push(w);
  });
  return inner;
}

function initHeader() {
  gsap.from('header', { yPercent: -100, opacity: 0, duration: 0.8, ease: 'power3.out', clearProps: 'transform,opacity' });

  // Bar progres scroll di paling atas
  const bar = document.getElementById('scrollProgress');
  if (bar) {
    gsap.fromTo(
      bar,
      { scaleX: 0 },
      { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.25 } },
    );
  }

  // Putar ikon saat ganti tema
  $$('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      gsap.fromTo(
        btn.querySelectorAll('.material-symbols-outlined'),
        { rotate: -90, scale: 0.5 },
        { rotate: 0, scale: 1, duration: 0.5, ease: 'back.out(2)', clearProps: 'transform' },
      );
    });
  });

  // Menu mobile: item masuk bergantian
  const menuBtn = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
      if (menu.classList.contains('hidden')) return;
      gsap.from(menu.querySelectorAll('a'), {
        x: -16,
        opacity: 0,
        duration: 0.4,
        stagger: 0.06,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      });
    });
  }
}

function initHero(): HTMLElement | null {
  const hero = $('main section[data-hero]');
  if (!hero) return null;

  const left = $('[class*="lg:col-span-7"]', hero);
  const right = $('[class*="lg:col-span-5"]', hero);
  if (!left || !right) return hero;

  const [badge, title, lead, actions, metrics] = Array.from(left.children) as HTMLElement[];
  const words = title ? splitWords(title) : [];

  const floats = $$('[data-float]', hero);
  const animated = [badge, lead, ...(Array.from(actions.children) as HTMLElement[]), metrics, right, ...floats];
  const unlock = lockTransitions(animated);

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from(badge, { y: 24, opacity: 0, duration: 0.7 })
    .from(words, { yPercent: 115, duration: 0.9, stagger: 0.06 }, '-=0.4')
    .from(lead, { y: 24, opacity: 0, duration: 0.7 }, '-=0.5')
    .from(Array.from(actions.children), { y: 20, opacity: 0, scale: 0.92, duration: 0.6, stagger: 0.1 }, '-=0.4')
    .from(metrics, { y: 30, opacity: 0, duration: 0.8 }, '-=0.3')
    .from(right, { x: 60, opacity: 0, scale: 0.94, duration: 1.1 }, 0.2)
    .from($$('[data-float]', hero), { y: 30, opacity: 0, scale: 0.8, duration: 0.8, stagger: 0.15, ease: 'back.out(1.7)' }, '-=0.5')
    .add(() => {
      // Pastikan semua elemen hero tampil normal setelah animasi masuk selesai
      unlock();
      gsap.set(animated, { clearProps: 'opacity,transform,visibility' });
      // Lencana melayang pelan
      floats.forEach((el, i) => {
        gsap.to(el, { y: -8, duration: 2.2 + i * 0.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      });
    });

  // Parallax foto & cahaya latar
  const photo = $('img[class*="h-[520px]"]', hero);
  if (photo) {
    gsap.fromTo(
      photo,
      { scale: 1.12, yPercent: -4 },
      { yPercent: 4, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } },
    );
  }
  $$('.blur-3xl', hero).forEach((el, i) => {
    gsap.to(el, {
      y: i % 2 ? -80 : 80,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
  });

  // Pengaman: bila ada elemen hero yang tertahan transparan, tampilkan paksa
  window.addEventListener('load', () => {
    window.setTimeout(() => {
      $$('*', hero).forEach((el) => {
        if (!gsap.isTweening(el) && getComputedStyle(el).opacity === '0') {
          gsap.set(el, { clearProps: 'opacity,transform,visibility' });
        }
      });
    }, 4500);
  });

  return hero;
}

function initSections(hero: HTMLElement | null) {
  const sections = $$('main section');
  sections.forEach((sec, idx) => {
    if (sec === hero) return;
    const inner =
      $(':scope > div[class*="max-w-"]', sec) || $(':scope > div:not([class*="absolute"])', sec) || sec;
    const items = (Array.from(inner.children) as HTMLElement[]).filter((el) => !String(el.className).includes('absolute'));

    items.forEach((el) => {
      const isGrid = /(^|\s)grid(\s|$)/.test(String(el.className)) && el.children.length > 1;
      const targets = (isGrid ? Array.from(el.children) : [el]) as HTMLElement[];
      const unlock = lockTransitions(targets);
      gsap.from(targets, {
        onComplete: unlock,
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        clearProps: 'transform,opacity',
        ...(idx === 0
          ? { delay: 0.15 }
          : { scrollTrigger: { trigger: el, start: 'top 88%', once: true } }),
      });
    });
  });

  // Daftar yang diberi data-stagger muncul berurutan
  $$('[data-stagger]').forEach((list) => {
    const kids = Array.from(list.children) as HTMLElement[];
    const unlock = lockTransitions(kids);
    gsap.from(kids, {
      onComplete: unlock,
      x: -24,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: list, start: 'top 88%', once: true },
    });
  });
}

function initFooter() {
  const grid = $('footer .grid');
  if (!grid) return;
  const kids = Array.from(grid.children) as HTMLElement[];
  const unlock = lockTransitions(kids);
  gsap.from(kids, {
    onComplete: unlock,
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out',
    clearProps: 'transform,opacity',
    scrollTrigger: { trigger: 'footer', start: 'top 92%', once: true },
  });
}

/** Angka naik dari 0: "350+" , "Rp 45,8 M", "10+ Thn" ... */
function initCounters() {
  $$('[data-countup]').forEach((el) => {
    const text = el.textContent || '';
    const m = text.match(/^([^\d]*)(\d+(?:[.,]\d+)?)([\s\S]*)$/);
    if (!m) return;
    const [, pre, num, suf] = m;
    const sep = num.includes(',') ? ',' : '.';
    const dec = (num.split(/[.,]/)[1] || '').length;
    const target = parseFloat(num.replace(',', '.'));
    const fmt = (v: number) => pre + v.toFixed(dec).replace('.', sep) + suf;
    const state = { v: 0 };
    el.textContent = fmt(0);
    gsap.to(state, {
      v: target,
      duration: 1.8,
      ease: 'power2.out',
      delay: el.closest('[data-hero]') ? 1.1 : 0,
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      onUpdate: () => {
        el.textContent = fmt(state.v);
      },
      onComplete: () => {
        el.textContent = text;
      },
    });
  });

  // Bar progres berbasis lebar (mis. persentase)
  $$('[style*="width:"]').forEach((el) => {
    gsap.from(el, {
      width: '0%',
      duration: 1.4,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    });
  });
}

const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  initHeader();
  const hero = initHero();
  initSections(hero);
  initFooter();
  initCounters();
  ready();
  window.addEventListener('load', () => ScrollTrigger.refresh());
});

mm.add('(prefers-reduced-motion: reduce)', () => {
  ready();
});
