'use client';

import { GraduationCap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';

const LAST_UPDATED = '27 de marzo de 2026';
const WEBSITE_URL = 'https://combounsa.com'; // TODO: Reemplazar con la URL 

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-white/5 bg-neutral-900/80 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold tracking-tight text-sm">
              Combo <span className="text-primary">UNSA</span>
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[#8B949E] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-2">Términos y Condiciones</h1>
        <p className="text-[#8B949E] text-sm mb-10">
          Última actualización: {LAST_UPDATED}
        </p>

        <div className="space-y-10 text-[#9CA3AF] leading-relaxed">
          {/* 1. Aceptación de los términos */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Aceptación de los términos</h2>
            <p>
              Al acceder y utilizar <strong className="text-white">Combo UNSA</strong> ({WEBSITE_URL}),
              aceptas estar sujeto a estos Términos y Condiciones. Si no estás de acuerdo con
              alguna parte de estos términos, no podrás utilizar la plataforma.
            </p>
            <p className="mt-3">
              Estos términos aplican a todos los usuarios de la plataforma, incluyendo
              postulantes, visitantes y cualquier persona que acceda al servicio.
            </p>
          </section>

          {/* 2. Descripción del servicio */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Descripción del servicio</h2>
            <p>
              Combo UNSA es una plataforma de preparación académica que ofrece:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
              <li>Simulacros de examen de admisión estilo UNSA.</li>
              <li>Flashcards de estudio organizadas por materia.</li>
              <li>Generación de flashcards con inteligencia artificial (plan Pro).</li>
              <li>Estadísticas de rendimiento y progreso académico.</li>
              <li>Herramientas de análisis de fortalezas y debilidades.</li>
            </ul>
            <p className="mt-3">
              Combo UNSA <strong className="text-white">no es un servicio oficial</strong> de la
              Universidad Nacional de San Agustín. No garantizamos que el uso de la plataforma
              resulte en aprobación del examen de admisión.
            </p>
          </section>

          {/* 3. Registro y cuenta */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Registro y cuenta</h2>
            <p>Para utilizar la plataforma debes:</p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
              <li>Proporcionar información veraz y actualizada durante el registro.</li>
              <li>Mantener la confidencialidad de tu contraseña.</li>
              <li>Notificarnos inmediatamente si detectas uso no autorizado de tu cuenta.</li>
              <li>Ser responsable de toda actividad que ocurra bajo tu cuenta.</li>
            </ul>
            <p className="mt-3">
              Nos reservamos el derecho de suspender o eliminar cuentas que incumplan
              estos términos, compartan credenciales o utilicen la plataforma de forma indebida.
            </p>
          </section>

          {/* 4. Planes y pagos */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Planes y pagos</h2>

            <h3 className="text-lg font-semibold text-white mt-6 mb-2">4.1. Plan Free</h3>
            <p>
              El plan gratuito permite acceso limitado a las funcionalidades de la plataforma,
              incluyendo un número restringido de simulacros diarios, flashcards y acceso
              al historial básico.
            </p>

            <h3 className="text-lg font-semibold text-white mt-6 mb-2">4.2. Plan Pro</h3>
            <p>
              El plan Pro es un servicio de suscripción pagada que desbloquea funcionalidades
              avanzadas. Los pagos se procesan a través de <strong className="text-white">Culqi</strong>.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
              <li>Los precios están expresados en soles peruanos (PEN) e incluyen impuestos aplicables.</li>
              <li>La suscripción se renueva automáticamente al final de cada período de facturación.</li>
              <li>Puedes cancelar tu suscripción en cualquier momento desde tu perfil.</li>
              <li>La cancelación será efectiva al final del período de facturación vigente.</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6 mb-2">4.3. Reembolsos</h3>
            <p>
              Los pagos realizados no son reembolsables, excepto en los siguientes casos:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
              <li>Fallo técnico que impida el acceso al servicio por más de 48 horas consecutivas.</li>
              <li>Cobro duplicado o error en el procesamiento del pago.</li>
              <li>Solicitudes realizadas dentro de las 24 horas posteriores al pago.</li>
            </ul>
          </section>

          {/* 5. Propiedad intelectual */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">5. Propiedad intelectual</h2>
            <p>
              Todo el contenido de la plataforma — incluyendo textos, preguntas de simulacro,
              flashcards, diseño, logotipos, código fuente y funcionalidades — es propiedad
              de Combo UNSA y está protegido por las leyes de propiedad intelectual de Perú.
            </p>
            <p className="mt-3">
              <strong className="text-white">Está prohibido:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
              <li>Copiar, reproducir o distribuir contenido de la plataforma sin autorización.</li>
              <li>Usar scrapers, bots o herramientas automatizadas para extraer contenido.</li>
              <li>Revender, sublicenciar o compartir acceso a tu cuenta.</li>
              <li>Modificar, descompilar o hacer ingeniería inversa del software.</li>
            </ul>
            <p className="mt-3">
              El contenido que generes tú (respuestas, notas personales) sigue siendo de tu propiedad,
              pero nos otorgas una licencia no exclusiva para almacenarlo y procesarlo con el fin
              de proporcionarte el servicio.
            </p>
          </section>

          {/* 6. Uso aceptable */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">6. Uso aceptable</h2>
            <p>Al utilizar Combo UNSA, te comprometes a no:</p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
              <li>Utilizar la plataforma para fines ilegales o no autorizados.</li>
              <li>Interferir con el funcionamiento normal de la plataforma.</li>
              <li>Intentar acceder a cuentas de otros usuarios.</li>
              <li>Transmitir virus, malware o código malicioso.</li>
              <li>Suplantar la identidad de otra persona o entidad.</li>
              <li>Utilizar la plataforma para enviar spam o comunicaciones no solicitadas.</li>
              <li>Crear múltiples cuentas para evadir límites del plan gratuito.</li>
            </ul>
          </section>

          {/* 7. Contenido generado por IA */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">7. Contenido generado por IA</h2>
            <p>
              El plan Pro incluye funcionalidades de generación de flashcards mediante
              inteligencia artificial. Al utilizar estas funciones, debes tener en cuenta:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
              <li>El contenido generado por IA puede contener errores o imprecisiones.</li>
              <li>No garantizamos la exactitud del contenido generado automáticamente.</li>
              <li>Te recomendamos verificar la información con fuentes oficiales de la UNSA.</li>
              <li>No debes depender exclusivamente del contenido de IA para tu preparación.</li>
            </ul>
          </section>

          {/* 8. Disponibilidad del servicio */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">8. Disponibilidad del servicio</h2>
            <p>
              Nos esforzamos por mantener la plataforma disponible las 24 horas del día,
              los 7 días de la semana. Sin embargo, no garantizamos disponibilidad ininterrumpida.
              El servicio puede verse interrumpido por:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
              <li>Mantenimiento programado (notificaremos con anticipación cuando sea posible).</li>
              <li>Fallas técnicas de servidores, proveedores de servicios o conectividad.</li>
              <li>Fuerza mayor o circunstancias fuera de nuestro control.</li>
            </ul>
            <p className="mt-3">
              No seremos responsables por pérdidas derivadas de la indisponibilidad temporal del servicio.
            </p>
          </section>

          {/* 9. Limitación de responsabilidad */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">9. Limitación de responsabilidad</h2>
            <p>
              Combo UNSA se proporciona &quot;tal cual&quot; y &quot;según disponibilidad&quot;.
              En la máxima medida permitida por la ley peruana:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
              <li>No garantizamos que el uso de la plataforma resulte en la aprobación del examen de admisión UNSA.</li>
              <li>No somos responsables por decisiones académicas tomadas basándose en las estadísticas o recomendaciones de la plataforma.</li>
              <li>El contenido educativo es de carácter complementario y no sustituye la preparación formal.</li>
              <li>Nuestra responsabilidad total no excederá el monto pagado por el servicio en los últimos 12 meses.</li>
            </ul>
          </section>

          {/* 10. Modificaciones al servicio y términos */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">10. Modificaciones al servicio y términos</h2>
            <p>
              Nos reservamos el derecho de:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
              <li>Modificar, agregar o eliminar funcionalidades de la plataforma en cualquier momento.</li>
              <li>Actualizar precios del plan Pro con previo aviso de 30 días.</li>
              <li>Cambiar estos Términos y Condiciones. Las modificaciones serán publicadas en esta página.</li>
            </ul>
            <p className="mt-3">
              El uso continuado de la plataforma después de cualquier modificación constituye
              tu aceptación de los nuevos términos.
            </p>
          </section>

          {/* 11. Terminación */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">11. Terminación</h2>
            <p>
              Puedes dejar de utilizar la plataforma y eliminar tu cuenta en cualquier momento.
              Nos reservamos el derecho de suspender o terminar tu acceso si:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
              <li>Incumples cualquiera de estos Términos y Condiciones.</li>
              <li>Detectamos actividad fraudulenta o uso indebido del servicio.</li>
              <li>Lo requiere una orden judicial o autoridad competente.</li>
            </ul>
            <p className="mt-3">
              Tras la terminación, tus datos serán eliminados conforme a nuestra{' '}
              <Link href="/privacidad" className="text-primary hover:underline">
                Política de Privacidad
              </Link>.
            </p>
          </section>

          {/* 12. Ley aplicable y jurisdicción */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">12. Ley aplicable y jurisdicción</h2>
            <p>
              Estos Términos y Condiciones se rigen por las leyes de la República del Perú.
              Cualquier controversia derivada de la interpretación o ejecución de estos términos
              será sometida a los tribunales competentes de la ciudad de Arequipa, Perú.
            </p>
          </section>

          {/* 13. Contacto */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">13. Contacto</h2>
            <p>
              Si tienes preguntas sobre estos Términos y Condiciones, puedes contactarnos en:
            </p>
            <div className="mt-3 bg-neutral-800 border border-neutral-border rounded-xl p-5 space-y-2">
              <p>
                <strong className="text-white">Correo electrónico:</strong>{' '}
                <a href="mailto:legal@combounsa.com" className="text-primary hover:underline">
                  kerlyn.lipa@estudiante.ucsm.edu.pe
                </a>
              </p>
              <p>
                <strong className="text-white">Sitio web:</strong>{' '}
                <a href={WEBSITE_URL} className="text-primary hover:underline">
                  {WEBSITE_URL}
                </a>
              </p>
              <p>
                <strong className="text-white">Responsable:</strong> Combo UNSA — Arequipa, Perú
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer withTopMargin />
    </div>
  );
}
