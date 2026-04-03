import { Injectable, Inject, BadRequestException, Logger } from '@nestjs/common';
import { v2 as Cloudinary } from 'cloudinary';
import { CLOUDINARY } from '../config/cloudinary.config';
import { UsersService } from '../users/users.service';

const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const FOLDER = 'combo-unsa/avatars';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(
    @Inject(CLOUDINARY) private cloudinary: typeof Cloudinary,
    private usersService: UsersService,
  ) {}

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    // Validar tipo de archivo
    if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        'Formato no permitido. Usa JPG, PNG o WebP.',
      );
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        'El archivo es muy grande. Máximo 5MB.',
      );
    }

    // Obtener usuario actual para saber si ya tiene avatar
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    // Si ya tiene avatar, eliminar el anterior de Cloudinary
    if (user.avatarUrl) {
      await this.deleteFromCloudinary(user.avatarUrl);
    }

    // Subir a Cloudinary
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const uploadStream = this.cloudinary.uploader.upload_stream(
          {
            folder: FOLDER,
            public_id: `user-${userId}`,
            overwrite: true,
            transformation: [
              { width: 256, height: 256, crop: 'fill', gravity: 'face' },
            ],
            format: 'webp', // Convertir a WebP para optimizar tamaño
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as { secure_url: string; public_id: string });
          },
        );
        uploadStream.end(file.buffer);
      },
    );

    // Guardar URL en BD
    await this.usersService.updateAvatarUrl(userId, result.secure_url);

    this.logger.log(`Avatar subido para usuario ${userId}`);

    return { avatarUrl: result.secure_url };
  }

  async deleteAvatar(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (!user.avatarUrl) {
      throw new BadRequestException('No tienes foto de perfil');
    }

    // Eliminar de Cloudinary
    await this.deleteFromCloudinary(user.avatarUrl);

    // Limpiar en BD
    await this.usersService.updateAvatarUrl(userId, null);

    this.logger.log(`Avatar eliminado para usuario ${userId}`);

    return { message: 'Foto de perfil eliminada correctamente' };
  }

  private async deleteFromCloudinary(avatarUrl: string) {
    try {
      // Extraer public_id de la URL de Cloudinary
      // URL ejemplo: https://res.cloudinary.com/CLOUD/image/upload/v1234567890/combo-unsa/avatars/user-xxx.webp
      const urlParts = avatarUrl.split('/');
      const uploadIndex = urlParts.indexOf('upload');
      if (uploadIndex === -1) return;

      // Tomar todo después de /upload/vXXXXXXXXX/
      const pathAfterVersion = urlParts.slice(uploadIndex + 2).join('/');
      // Quitar extensión
      const publicId = pathAfterVersion.replace(/\.[^.]+$/, '');

      await this.cloudinary.uploader.destroy(publicId);
    } catch (error) {
      this.logger.warn(`No se pudo eliminar imagen de Cloudinary: ${error.message}`);
      // No lanzamos error — es mejor que el usuario pueda subir una nueva
      // aunque falle la eliminación de la anterior
    }
  }
}
