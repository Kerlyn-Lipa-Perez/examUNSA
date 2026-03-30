import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;
  private fromEmail: string;

  constructor(private config: ConfigService) {
    this.resend = new Resend(this.config.get('RESEND_API_KEY'));
    this.fromEmail = this.config.get('RESEND_FROM_EMAIL') || 'Combo UNSA <onboarding@resend.dev>';
  }

  async sendPasswordResetEmail(email: string, nombre: string, resetToken: string) {
    const resetUrl = `${this.config.get('FRONTEND_URL')}/reset-password?token=${resetToken}`;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Recuperar Contraseña - Combo UNSA</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0D1117; font-family: 'Space Grotesk', sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Logo Header -->
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="margin: 0; font-size: 28px;">
            <span style="color: #D4A017;">Combo</span>
            <span style="color: #ffffff;">UNSA</span>
          </h1>
        </div>

        <!-- Main Card -->
        <div style="background-color: #161B22; border: 1px solid #30363D; border-radius: 16px; padding: 32px;">
          <!-- Icon -->
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="width: 64px; height: 64px; background-color: #D4A017; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0D1117" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17h9v-2l-3.149-3.149A6 6 0 0118 9zM12 2L10.149 3.85a6 6 0 01-3.149 3.149L2.343 12.05A1 1 0 013.05 14.05L12 23" />
              </svg>
            </div>
          </div>

          <!-- Title -->
          <h2 style="color: #ffffff; text-align: center; margin: 0 0 16px 0; font-size: 24px;">
            ¿Olvidaste tu contraseña?
          </h2>

          <!-- Body -->
          <p style="color: #8B949E; text-align: center; margin: 0 0 24px 0; line-height: 1.6;">
            Hola <strong>${nombre}</strong>,<br>
            Recibimos una solicitud para restablecer tu contraseña.<br>
            Si no fuiste tú, puedes ignorar este correo.
          </p>

          <!-- Button -->
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${resetUrl}" style="display: inline-block; background-color: #D4A017; color: #0D1117; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
              Restablecer mi Contraseña
            </a>
          </div>

          <!-- Warning -->
          <p style="color: #6E7681; text-align: center; margin: 0; font-size: 13px;">
            Este enlace expira en <strong>1 hora</strong>.<br>
            Por seguridad, no compartas este correo con nadie.
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 32px;">
          <p style="color: #6E7681; margin: 0; font-size: 12px;">
            © 2026 Combo UNSA - Todos los derechos reservados.
          </p>
          <div style="margin-top: 8px;">
            <a href="${this.config.get('FRONTEND_URL')}/privacidad" style="color: #3B82F6; text-decoration: none; font-size: 12px; margin: 0 8px;">Política de Privacidad</a>
            <a href="${this.config.get('FRONTEND_URL')}/terminos" style="color: #3B82F6; text-decoration: none; font-size: 12px; margin: 0 8px;">Términos y Condiciones</a>
          </div>
        </div>
      </div>
    </body>
    </html>
        `;

    try {
      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: '🔐 Restablece tu contraseña - Combo UNSA',
        html: htmlContent,
      });

      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendAccountDeletionEmail(email: string) {
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cuenta Eliminada - Combo UNSA</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0D1117; font-family: 'Space Grotesk', sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="margin: 0; font-size: 28px;">
            <span style="color: #D4A017;">Combo</span>
            <span style="color: #ffffff;">UNSA</span>
          </h1>
        </div>

        <div style="background-color: #161B22; border: 1px solid #30363D; border-radius: 16px; padding: 32px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0 0 16px 0;">Tu cuenta ha sido eliminada</h2>
          <p style="color: #8B949E;">
            Tu cuenta de Combo UNSA ha sido eliminada exitosamente.<br>
            Lamentamos verte partir. ¡ esperamos verte de vuelta pronto!
          </p>
        </div>
      </div>
    </body>
    </html>
        `;

    try {
      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Confirmación de eliminación de cuenta - Combo UNSA',
        html: htmlContent,
      });

      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}