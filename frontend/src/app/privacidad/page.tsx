'use client';

import { GraduationCap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';

const LAST_UPDATED = '27 de marzo de 2026';
const WEBSITE_URL = 'https://combounsa.com';

export default function PrivacidadPage() {
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
        <h1 className="text-3xl font-bold mb-2">Política de Privacidad</h1>
        <p className="text-[#8B949E] text-sm mb-10">
          Última actualización: {LAST_UPDATED}
        </p>

        <div className="space-y-10 text-[#9CA3AF] leading-relaxed">
          {/* 1. Introducción */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Introducción</h2>
            <p>
              Bienvenido a <strong className="text-white">Combo UNSA</strong> ({WEBSITE_URL}),
              una plataforma de preparación académica para el examen de admisión de la
              Universidad Nacional de San Agustín de Arequipa. Esta Política de Privacidad
              describe cómo recopilamos, utilizamos, almacenamos y protegemos tu información
              personal cuando utilizas nuestros servicios.
            </p>
            <p className="mt-3">
              Al utilizar Combo UNSA, aceptas las prácticas descritas en este documento.
              Si no estás de acuerdo con esta política, te pedimos que no utilices la plataforma.
            </p>
          </section>

          {/* 2. Información que recopilamos */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Información que recopilamos</h2>

            <h3 className="text-lg font-semibold text-white mt-6 mb-2">2.1. Información que proporcionas directamente</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong className="text-white">Datos de registro:</strong> nombre completo, dirección de correo electrónico y contraseña (almacenada de forma cifrada con bcrypt).</li>
              <li><strong className="text-white">Datos de pago:</strong> cuando realizas una compra, procesamos la información de pago a través de nuestro proveedor de pagos <strong className="text-white">Culqi</strong>. No almacenamos números de tarjeta de crédito ni datos sensibles de pago en nuestros servidores.</li>
              <li><strong className="text-white">Contenido generado:</strong> respuestas a simulacros, flashcards creadas y progreso académico.</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6 mb-2">2.2. Información recopilada automáticamente</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong className="text-white">Datos de uso:</strong> simulacros completados, tiempo de estudio, materias estudiadas, puntajes obtenidos y patrones de interacción con la plataforma.</li>
              <li><strong className="text-white">Datos del dispositivo:</strong> tipo de navegador, sistema operativo, resolución de pantalla y versión de la aplicación.</li>
              <li><strong className="text-white">Datos de conexión:</strong> dirección IP, proveedor de servicios de internet y ubicación aproximada (ciudad/país).</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6 mb-2">2.3. Cookies y tecnologías de rastreo</h3>
            <p>
              Utilizamos las siguientes tecnologías de seguimiento:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
              <li><strong className="text-white">Cookies esenciales:</strong> utilizamos <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-sm">js-cookie</code> para mantener tu sesión activa y gestionar tu estado de autenticación (JWT token).</li>
              <li><strong className="text-white">Google Analytics:</strong> utilizamos Google Analytics para analizar el tráfico y comportamiento de los usuarios en la plataforma. Google Analytics recopila información como páginas visitadas, tiempo de permanencia, fuente de tráfico y datos demográficos aproximados. Puedes optar por no participar instalando el{' '}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  complemento de inhabilitación de Google Analytics
                </a>.
              </li>
              <li><strong className="text-white">Almacenamiento local (localStorage):</strong> utilizamos el almacenamiento local de tu navegador a través de Zustand para guardar preferencias de la interfaz y estado de la aplicación.</li>
            </ul>
          </section>

          {/* 3. Cómo utilizamos tu información */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Cómo utilizamos tu información</h2>
            <p>Utilizamos la información recopilada para:</p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
              <li>Crear y gestionar tu cuenta de usuario.</li>
              <li>Proporcionar simulacros de examen y flashcards personalizados.</li>
              <li>Generar estadísticas de rendimiento y análisis de fortalezas/debilidades.</li>
              <li>Procesar pagos y gestionar suscripciones a través de Culqi.</li>
              <li>Mejorar y optimizar la plataforma mediante análisis de uso con Google Analytics.</li>
              <li>Enviar comunicaciones relacionadas con tu cuenta, como confirmaciones, actualizaciones de servicio y notificaciones de seguridad.</li>
              <li>Detectar, prevenir y abordar actividades fraudulentas o técnicas.</li>
              <li>Cumplir con obligaciones legales aplicables.</li>
            </ul>
          </section>

          {/* 4. Proveedores de servicios terceros */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Proveedores de servicios terceros</h2>
            <p>
              Compartimos información limitada con los siguientes proveedores de servicios
              que nos ayudan a operar la plataforma:
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border border-neutral-border rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-neutral-800">
                    <th className="text-left py-3 px-4 text-white font-semibold">Proveedor</th>
                    <th className="text-left py-3 px-4 text-white font-semibold">Propósito</th>
                    <th className="text-left py-3 px-4 text-white font-semibold">Datos compartidos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-border">
                  <tr>
                    <td className="py-3 px-4 text-white">Google Analytics</td>
                    <td className="py-3 px-4">Análisis de uso y comportamiento</td>
                    <td className="py-3 px-4">Datos de navegación, páginas visitadas, tiempo de sesión</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-white">Culqi</td>
                    <td className="py-3 px-4">Procesamiento de pagos</td>
                    <td className="py-3 px-4">Datos de transacción, correo electrónico</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm">
              Cada proveedor tiene su propia política de privacidad. Te recomendamos revisarlas:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-1 text-sm">
              <li>
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Política de Privacidad de Google
                </a>
              </li>
              <li>
                <a
                  href="https://culqi.com/politicas-de-privacidad/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Política de Privacidad de Culqi
                </a>
              </li>
            </ul>
          </section>

          {/* 5. Almacenamiento y seguridad */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">5. Almacenamiento y seguridad</h2>
            <p>
              Tus datos se almacenan en servidores con bases de datos PostgreSQL protegidas
              por cifrado en tránsito (TLS/SSL). Implementamos las siguientes medidas de seguridad:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
              <li>Contraseñas cifradas con <strong className="text-white">bcrypt</strong> (10 rondas de sal).</li>
              <li>Autenticación mediante tokens <strong className="text-white">JWT</strong> con expiración.</li>
              <li>Acceso restringido a la base de datos solo desde servidores autorizados.</li>
              <li>Las variables de entorno y credenciales sensibles nunca se almacenan en el código fuente.</li>
            </ul>
            <p className="mt-3">
              Sin embargo, ningún método de transmisión por Internet o de almacenamiento
              electrónico es 100% seguro. No podemos garantizar la seguridad absoluta de tus datos.
            </p>
          </section>

          {/* 6. Retención de datos */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">6. Retención de datos</h2>
            <p>
              Conservamos tu información personal mientras tu cuenta esté activa o según
              sea necesario para proporcionarte nuestros servicios. Cuando elimines tu cuenta,
              borraremos tus datos personales en un plazo de <strong className="text-white">30 días</strong>,
              salvo que debamos conservarlos por obligación legal o para resolver disputas.
            </p>
          </section>

          {/* 7. Tus derechos */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">7. Tus derechos</h2>
            <p>
              De acuerdo con la Ley N° 29733 — Ley de Protección de Datos Personales del Perú,
              tienes derecho a:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
              <li><strong className="text-white">Acceso:</strong> solicitar una copia de los datos personales que tenemos sobre ti.</li>
              <li><strong className="text-white">Rectificación:</strong> corregir datos inexactos o incompletos.</li>
              <li><strong className="text-white">Eliminación:</strong> solicitar la eliminación de tus datos personales.</li>
              <li><strong className="text-white">Portabilidad:</strong> recibir tus datos en un formato estructurado y de uso común.</li>
              <li><strong className="text-white">Oposición:</strong> oponerte al tratamiento de tus datos para ciertos fines.</li>
              <li><strong className="text-white">Revocación del consentimiento:</strong> retirar tu consentimiento en cualquier momento.</li>
            </ul>
            <p className="mt-3">
              Para ejercer cualquiera de estos derechos, contáctanos en:{' '}
              <a href="mailto:privacidad@combounsa.com" className="text-primary hover:underline">
                privacidad@combounsa.com
              </a>
            </p>
          </section>

          {/* 8. Menores de edad */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">8. Menores de edad</h2>
            <p>
              Combo UNSA está dirigido a postulantes universitarios, muchos de los cuales
              pueden ser menores de 18 años. Si eres menor de edad, necesitas el consentimiento
              de tu padre, madre o tutor legal para utilizar la plataforma. Si descubrimos que
              hemos recopilado datos de un menor sin el consentimiento parental correspondiente,
              tomaremos medidas para eliminar dicha información.
            </p>
          </section>

          {/* 9. Cambios a esta política */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">9. Cambios a esta política</h2>
            <p>
              Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier
              momento. Te notificaremos de cambios significativos publicando la nueva política
              en esta página y actualizando la fecha de &quot;Última actualización&quot;. El uso
              continuado de la plataforma después de dichos cambios constituye tu aceptación
              de la nueva política.
            </p>
          </section>

          {/* 10. Contacto */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">10. Contacto</h2>
            <p>
              Si tienes preguntas, inquietudes o solicitudes relacionadas con esta Política
              de Privacidad o el tratamiento de tus datos personales, puedes contactarnos en:
            </p>
            <div className="mt-3 bg-neutral-800 border border-neutral-border rounded-xl p-5 space-y-2">
              <p>
                <strong className="text-white">Correo electrónico:</strong>{' '}
                <a href="mailto:privacidad@combounsa.com" className="text-primary hover:underline">
                  privacidad@combounsa.com
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
