import { IsNotEmpty, IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class GuardarResultadoDto {
  @IsNotEmpty()
  @IsString()
  materia: string;

  @IsOptional()
  @IsString()
  examId?: string;

  @IsNotEmpty()
  @IsNumber()
  puntaje: number;

  @IsOptional()
  @IsNumber()
  tiempoSegundos?: number;

  @IsNotEmpty()
  @IsArray()
  respuestas: any[];

  @IsOptional()
  @IsNumber()
  simulacrosHoy?: number;
}