import type { APIRoute } from 'astro';
import { buildVCard } from '../config';

// File kontak (.vcf) statis: dibuat saat build, dibuka ponsel sebagai "tambah kontak".
export const GET: APIRoute = () =>
  new Response(buildVCard(), {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': 'attachment; filename="Denny_Indra.vcf"',
    },
  });
