import { IsNotEmpty, IsString, IsIn } from 'class-validator';
import { MATERIAS_VALIDAS } from '../../shared/constants/materias';

export class GenerarCardsDto {
  @IsNotEmpty()
  @IsString()
  tema: string;

  @IsNotEmpty()
  @IsString()
  @IsIn([...MATERIAS_VALIDAS], { message: 'Materia no válida' })
  materia: string;
}
