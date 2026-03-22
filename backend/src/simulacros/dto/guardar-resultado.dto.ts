import { IsNotEmpty, IsString, IsNumber, IsArray } from 'class-validator';

export class GuardarResultadoDto {
  @IsNotEmpty()
  @IsString()
  materia: string;

  @IsNotEmpty()
  @IsNumber()
  puntaje: number;

  @IsNotEmpty()
  @IsArray()
  respuestas: any[];
}