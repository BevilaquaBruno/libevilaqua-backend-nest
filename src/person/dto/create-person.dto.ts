import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';
import { States } from '../../helpers/enum/States.enum';

export class CreatePersonDto {
  @IsString({ message: 'Informe o nome da pessoa novamente' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @Length(1, 250, { message: 'Informe um nome com até 250 caracteres' })
  name: string;

  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @IsString({ message: 'Informe corretamente o CPF da pessoa' })
  @Matches(/\d{3}.\d{3}.\d{3}-\d{2}/g, { message: 'CPF inválido' })
  cpf: string;

  @ValidateIf((thisPerson) => thisPerson.cep !== undefined && thisPerson.cep !== '' && thisPerson.cep !== null)
  @IsString({ message: 'Informe novamente o CEP da pessoa' })
  @Matches(/\d{5}-\d{3}/g, { message: 'CEP inválido' })
  cep: string;

  @ValidateIf((thisPerson) => thisPerson.state !== undefined && thisPerson.state !== '' && thisPerson.state !== null)
  @IsEnum(States, { message: 'Estado inválido' })
  state: States;

  @ValidateIf((thisPerson) => thisPerson.city !== undefined && thisPerson.city !== '' && thisPerson.city !== null)
  @IsString({ message: 'Informe novamente a cidade da pessoa' })
  city: string;

  @ValidateIf((thisPerson) => thisPerson.district !== undefined && thisPerson.district !== '' && thisPerson.district !== null)
  @IsString({ message: 'Informe novamente o bairro da pessoa' })
  district: string;

  @ValidateIf((thisPerson) => thisPerson.street !== undefined && thisPerson.street !== '' && thisPerson.street !== null)
  @IsString({ message: 'Informe novamente a rua da pessoa' })
  street: string;

  @ValidateIf((thisPerson) => thisPerson.number !== undefined && thisPerson.number !== '' && thisPerson.number !== null)
  @IsString({ message: 'Informe novamente o número da pessoa' })
  @Length(1, 5, { message: 'Número pode ter no máximo 5 dígitos' })
  @Matches(/(\d{1,5})|(SN)|(S\/N)/g, {
    message: 'Número inválido, informe o número, SN ou S/N',
  })
  number: string;

  @ValidateIf((thisPerson) => thisPerson.obs !== undefined && thisPerson.obs !== '' && thisPerson.obs !== null)
  @IsString({ message: 'Informe novamente a observação da pessoa' })
  obs: string;
}
