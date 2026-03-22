import { IsNotEmpty, IsString } from 'class-validator';

export class GenerarCardsDto {
  @IsNotEmpty()
  @IsString()
  tema: string;

  @IsNotEmpty()
  @IsString()
  materia: string;
}