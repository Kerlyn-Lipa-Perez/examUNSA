'use client';

import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

interface FooterProps {
  /** Agrega margen superior (útil en páginas de contenido como /privacidad, /terminos) */
  withTopMargin?: boolean;
}

export function Footer({ withTopMargin = false }: FooterProps) {
  return (
    <footer
      className={`border-t border-white/5 bg-neutral-900/80 py-12 ${withTopMargin ? 'mt-12' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold tracking-tight text-sm">
              Combo <span className="text-primary">UNSA</span>
            </span>
          </div>

          {/* Copyright */}
          <p className="text-[#8B949E] text-sm text-center">
            © 2026 Combo UNSA. Hecho con 🧉 en Arequipa, la Ciudad Blanca.
          </p>

          {/* Links */}
          <div className="flex items-center gap-4 text-[#8B949E]">
            <Link href="/terminos" className="hover:text-white transition-colors text-sm">
              Términos y condiciones
            </Link>
            <Link href="/privacidad" className="hover:text-white transition-colors text-sm">
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
