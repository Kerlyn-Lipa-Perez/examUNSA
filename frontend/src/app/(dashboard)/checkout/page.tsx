'use client';

import { useState, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCheckout, useConfirmarPago } from '@/hooks/usePagos';
import { Crown, Check, Loader2, ArrowLeft, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

const PLAN_PRO_PRICE = 29.90;
const CULQI_SCRIPT_URL = 'https://checkout.culqi.com/js/v4';

const BENEFICIOS_PRO = [
  'Simulacros IA ilimitados',
  'Flashcards ilimitadas con IA',
  'Tutor IA integrado',
  'Análisis detallado de progreso',
  'Prioridad en nuevas funciones',
  'Soporte prioritario',
];

type CheckoutStep = 'resumen' | 'procesando' | 'exito';

export default function CheckoutPage() {
  const { plan } = useAuthStore();
  const checkout = useCheckout();
  const confirmarPago = useConfirmarPago();

  const [step, setStep] = useState<CheckoutStep>('resumen');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isPro = plan === 'pro';

  // ─── Cargar script de Culqi una sola vez ──────────────────────────
  const loadCulqiScript = (): Promise<void> => {
    if (window.Culqi) return Promise.resolve();
    if (document.querySelector(`script[src="${CULQI_SCRIPT_URL}"]`)) {
      return new Promise((resolve) => {
        const check = setInterval(() => {
          if (window.Culqi) { clearInterval(check); resolve(); }
        }, 100);
      });
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = CULQI_SCRIPT_URL;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('No se pudo cargar Culqi.'));
      document.body.appendChild(script);
    });
  };

  // ─── Flujo completo al hacer clic en "Pagar" ──────────────────────
  const handlePagar = async () => {
    setErrorMsg(null);
    setLoading(true);

    try {
      // 1. Cargar script de Culqi
      await loadCulqiScript();

      // 2. Obtener config del backend
      const config = await checkout.mutateAsync('pro');

      if (!config.publicKey) {
        throw new Error('Sistema de pagos no configurado. El backend no devolvió la publicKey. Reinicia el servidor backend.');
      }

      // 3. Configurar CulqiCheckout
      const Culqi = window.Culqi;
      Culqi.publicKey = config.publicKey;

      Culqi.settings({
        title: 'Combo UNSA',
        currency: config.currency,
        amount: config.amount,
      });

      Culqi.options({
        lang: 'es',
        installments: false,
        paymentMethods: {
          tarjeta: true,
          yape: true,
          bancaMovil: false,
          agente: false,
          billetera: false,
          cuotealo: false,
        },
        style: {
          logo: 'https://placehold.co/200x50/D4A017/0D1117?text=Combo+UNSA',
          bannerColor: '#161B22',
          buttonBackground: '#D4A017',
          buttonText: 'Pagar S/ 29.90',
          buttonTextColor: '#0D1117',
          priceColor: '#D4A017',
          menuColor: '#8B949E',
          linksColor: '#3B82F6',
        },
      });

      // 4. Registrar callback y abrir modal
      window.culqi = async () => {
        if (Culqi.token) {
          setStep('procesando');
          setErrorMsg(null);

          try {
            await confirmarPago.mutateAsync(Culqi.token.id);
            setStep('exito');
          } catch (err: unknown) {
            const message =
              err instanceof Error ? err.message : 'No se pudo procesar el pago.';
            setErrorMsg(message);
            setStep('resumen');
          }
        } else if (Culqi.error) {
          setErrorMsg(Culqi.error.user_message || 'Error al procesar el pago.');
          setStep('resumen');
        } else {
          // Usuario cerró el modal
          setStep('resumen');
        }
      };

      Culqi.open();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al inicializar el pago.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Si ya es Pro ────────────────────────────────────────────────────
  if (isPro) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Crown className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Ya eres Pro</h1>
        <p className="text-gray-400 mb-8">
          Tienes acceso completo a todas las funciones de Combo UNSA.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-primary text-neutral-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors"
        >
          Ir al Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/configuracion"
          className="p-2 rounded-lg hover:bg-neutral-800 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Mejorar a Pro</h1>
          <p className="text-gray-400 text-sm">
            Desbloquea todo el potencial de tu preparación
          </p>
        </div>
      </div>

      {step === 'resumen' && (
        <div className="space-y-6">
          {/* Plan Card */}
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Plan Pro</h2>
                  <p className="text-gray-400 text-sm">Suscripción mensual</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-white font-mono">
                  S/{PLAN_PRO_PRICE}
                </span>
                <span className="text-gray-400 text-sm block">/mes</span>
              </div>
            </div>

            <div className="space-y-3">
              {BENEFICIOS_PRO.map((beneficio) => (
                <div key={beneficio} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-success flex-shrink-0" />
                  <span className="text-sm text-gray-300">{beneficio}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Seguridad */}
          <div className="flex items-center gap-3 p-4 bg-neutral-800 rounded-xl border border-neutral-border">
            <Shield className="w-5 h-5 text-success flex-shrink-0" />
            <div>
              <p className="text-sm text-white font-medium">
                Pago seguro con Culqi
              </p>
              <p className="text-xs text-gray-400">
                Tus datos de pago están protegidos con encriptación de nivel bancario
              </p>
            </div>
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="text-error text-sm bg-error/10 border border-error/20 rounded-lg p-3 text-center">
              {errorMsg}
            </div>
          )}

          {/* Botón de pago */}
          <button
            onClick={handlePagar}
            disabled={loading}
            className="w-full bg-primary hover:bg-yellow-600 active:scale-[0.98] text-neutral-900 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Cargando...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Proceder al Pago — S/{PLAN_PRO_PRICE}/mes
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Puedes cancelar tu suscripción en cualquier momento desde Configuración.
          </p>
        </div>
      )}

      {step === 'procesando' && (
        <div className="text-center py-16 space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <h2 className="text-xl font-bold text-white">Procesando tu pago...</h2>
          <p className="text-gray-400 text-sm">No cierres esta ventana</p>
        </div>
      )}

      {step === 'exito' && (
        <div className="text-center py-16 space-y-6">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-success" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              ¡Bienvenido a Pro!
            </h2>
            <p className="text-gray-400">
              Tu suscripción ha sido activada correctamente.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-primary text-neutral-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors"
          >
            Ir al Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}
