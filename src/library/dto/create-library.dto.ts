import { IsNotEmpty, Length } from "class-validator";

export class CreateLibraryDto {
  @IsNotEmpty({ message: 'Informe uma descrição válida.' })
  @Length(1, 50, { message: 'Descrição deve ter até 50 caracteres.' })
  description: string;
}
