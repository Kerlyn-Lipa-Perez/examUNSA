import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { cloudinaryProvider } from '../config/cloudinary.config';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [UploadController],
  providers: [UploadService, cloudinaryProvider],
})
export class UploadModule {}
