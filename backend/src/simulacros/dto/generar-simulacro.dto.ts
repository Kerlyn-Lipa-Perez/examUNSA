import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class GenerarSimulacroDto {
  @IsNotEmpty()
  @IsString()
  @IsIn([
    'matematica',
    'fisica',
    'quimica',
    'biologia',
    'historia',
    'lenguaje',
    'razonamiento'
  ], { message: 'Materia no válida' })
  materia: string;
}