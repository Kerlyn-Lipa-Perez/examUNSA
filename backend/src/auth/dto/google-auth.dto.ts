import { IsNotEmpty } from 'class-validator';

export class GoogleAuthDto {
  @IsNotEmpty({ message: 'El token de Google es requerido' })
  credential: string;
}
