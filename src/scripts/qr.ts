import QRCode from 'qrcode';
import gsap from 'gsap';

const modal = document.getElementById('qrModal');
const card = document.getElementById('qrModalContent');
const openBtn = document.getElementById('openQrBtn');
const closeBtn = document.getElementById('closeQrModal');
const img = document.getElementById('qrImage') as HTMLImageElement | null;
const urlText = document.getElementById('qrUrl');
const openLink = document.getElementById('qrOpenLink') as HTMLAnchorElement | null;

if (modal && card && openBtn && img) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const d = (v: number) => (reduce ? 0 : v);

  // Link yang dimuat QR = halaman tambah kontak
  const base = modal.dataset.siteUrl || window.location.origin;
  const target = new URL(document.documentElement.lang === 'en' ? '/en/add-contact' : '/add-contact', base).href;
  let built = false;

  async function build() {
    if (built) return;
    built = true;
    img!.src = await QRCode.toDataURL(target, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 560,
      color: { dark: '#0b1c30', light: '#ffffff' },
    });
    if (urlText) urlText.textContent = target;
    if (openLink) openLink.href = target;
  }

  function open() {
    build();
    modal!.classList.remove('hidden');
    modal!.classList.add('flex');
    document.body.style.overflow = 'hidden';
    gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: d(0.25) });
    gsap.fromTo(
      card,
      { scale: 0.88, y: 40, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: d(0.55), ease: 'back.out(1.6)' },
    );
    gsap.from(img, { scale: 0.85, opacity: 0, duration: d(0.5), delay: d(0.15), ease: 'power3.out' });
    closeBtn?.focus();
  }

  function close() {
    gsap.to(card, { scale: 0.92, y: 20, opacity: 0, duration: d(0.2), ease: 'power2.in' });
    gsap.to(modal, {
      opacity: 0,
      duration: d(0.25),
      onComplete: () => {
        modal!.classList.add('hidden');
        modal!.classList.remove('flex');
        document.body.style.overflow = '';
        openBtn!.focus();
      },
    });
  }

  openBtn.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) close();
  });
}
