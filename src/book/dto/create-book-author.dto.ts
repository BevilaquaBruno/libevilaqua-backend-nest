import { IsBoolean, IsNumber } from 'class-validator';

export class CreateBookAuthor {
  @IsNumber({ allowNaN: false }, { message: 'Informe o autor novamente' })
  id: number;

  @IsNumber({ allowNaN: false }, { message: 'Informe o autor novamente' })
  authorId: number;

  @IsBoolean({ message: 'Informe o autor novamente' })
  status: boolean;
}
