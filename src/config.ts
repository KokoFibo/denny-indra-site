// Pengaturan situs: ubah di sini, berlaku di seluruh halaman.
export const SITE = {
  name: 'Denny Indra',
  whatsapp: '6287860000788', // format internasional tanpa +
  whatsappDisplay: '+62 878-6000-0788',
  email: 'dennytan788@gmail.com',
  // Isi dengan alamat website setelah online, mis. 'https://dennyindra.com'.
  // Kosongkan agar QR memakai alamat yang sedang dibuka.
  siteUrl: '',
};

export const waLink = (text = 'Halo Pak Denny Indra, saya ingin berkonsultasi mengenai perencanaan proteksi.') =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

// Data kontak: dipakai oleh halaman /add-contact DAN file vCard (/denny-indra.vcf),
// sehingga yang tampil di halaman sama persis dengan yang tersimpan di ponsel.
export const CONTACT = {
  firstName: 'Denny',
  lastName: 'Indra',
  suffix: 'CFP®',
  displayName: 'Denny Indra, CFP®',
  title: 'Senior Wealth Advisor & MDRT Premier Consultant',
  org: 'Denny Indra - Insurance Agent',
  phone: `+${SITE.whatsapp}`,
  phoneDisplay: SITE.whatsappDisplay,
  email: SITE.email,
};

const esc = (v: string) => v.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

export const buildVCard = () =>
  [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${esc(CONTACT.lastName)};${esc(CONTACT.firstName)};;;${esc(CONTACT.suffix)}`,
    `FN:${esc(CONTACT.displayName)}`,
    `ORG:${esc(CONTACT.org)}`,
    `TITLE:${esc(CONTACT.title)}`,
    `TEL;TYPE=CELL,VOICE:${CONTACT.phone}`,
    `EMAIL;TYPE=WORK,INTERNET:${CONTACT.email}`,
    ...(SITE.siteUrl ? [`URL:${SITE.siteUrl}`] : []),
    'END:VCARD',
  ].join('\r\n');
