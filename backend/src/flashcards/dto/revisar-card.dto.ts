import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class RevisarCardDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  calificacion: number;
}