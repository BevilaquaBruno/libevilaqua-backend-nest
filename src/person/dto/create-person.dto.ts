import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';
import { States } from '../enum/States.enum';

export class CreatePersonDto {
  @IsString({ message: 'Informe o nome da pessoa novamente' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @ValidateIf((thisPerson) => thisPerson.cpf !== null)
  @IsString({ message: 'Informe novamente o CPF da pessoa' })
  @Matches(/\d{3}.\d{3}.\d{3}-\d{2}/g, { message: 'CPF inválido' })
  cpf: string;

  @ValidateIf((thisPerson) => thisPerson.cep !== null)
  @IsString({ message: 'Informe novamente o CEP da pessoa' })
  @Matches(/\d{5}-\d{3}/g, { message: 'CEP inválido' })
  cep: string;

  @ValidateIf((thisPerson) => thisPerson.state !== null)
  @IsEnum(States, { message: 'Informe o estado novamente' })
  state: States;

  @ValidateIf((thisPerson) => thisPerson.city !== null)
  @IsString({ message: 'Informe novamente a cidade da pessoa' })
  city: string;

  @ValidateIf((thisPerson) => thisPerson.district !== null)
  @IsString({ message: 'Informe novamente o bairro da pessoa' })
  district: string;

  @ValidateIf((thisPerson) => thisPerson.street !== null)
  @IsString({ message: 'Informe novamente a rua da pessoa' })
  street: string;

  @ValidateIf((thisPerson) => thisPerson.number !== null)
  @IsString({ message: 'Informe novamente o número da pessoa' })
  @Length(1, 5, { message: 'Número pode ter no máximo 5 dígitos' })
  @Matches(/(\d{1,5})|(SN)|(S\/N)/g, {
    message: 'Número inválido, informe o número, SN ou S/N',
  })
  number: string;

  @ValidateIf((thisPerson) => thisPerson.obs !== null)
  @IsString({ message: 'Informe novamente a observação da pessoa' })
  obs: string;
}
