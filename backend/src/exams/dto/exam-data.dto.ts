// backend/src/exams/dto/exam-data.dto.ts
import { ExamMetaDto } from './exam-meta.dto';
import { QuestionDto } from './question.dto';

// Mirrors `ExamData` en frontend/src/types/simulacro.ts
export class ExamDataDto {
  meta: ExamMetaDto;
  preguntas: QuestionDto[];
}
