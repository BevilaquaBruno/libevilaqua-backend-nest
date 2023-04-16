import { IsBoolean, IsNumber } from 'class-validator';

export class CreateBookTag {
  @IsNumber({ allowNaN: false }, { message: 'Informe a tag novamente' })
  id: number;

  @IsNumber({ allowNaN: false }, { message: 'Informe a tag novamente' })
  tagId: number;

  @IsBoolean({ message: 'Informe a tag novamente' })
  status: boolean;
}
