import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';
import { States } from '../../helpers/enum/States.enum';

export class CreatePersonDto {
  @IsString({ message: 'person.name.invalid' })
  @IsNotEmpty({ message: 'person.name.required' })
  @Length(1, 250, { message: 'person.name.length_error' })
  name: string;

  @ValidateIf(
    (thisPerson) =>
      thisPerson.cpf !== undefined &&
      thisPerson.cpf !== '' &&
      thisPerson.cpf !== null,
  )
  @IsString({ message: 'person.cpf.invalid' })
  @Matches(/\d{3}.\d{3}.\d{3}-\d{2}/g, { message: 'person.cpf.invalid' })
  cpf: string;

  @ValidateIf(
    (thisPerson) =>
      thisPerson.cep !== undefined &&
      thisPerson.cep !== '' &&
      thisPerson.cep !== null,
  )
  @IsString({ message: 'person.cep.invalid' })
  @Matches(/\d{5}-\d{3}/g, { message: 'person.cep.invalid' })
  cep: string;

  @ValidateIf(
    (thisPerson) =>
      thisPerson.state !== undefined &&
      thisPerson.state !== '' &&
      thisPerson.state !== null,
  )
  @IsEnum(States, { message: 'person.state.invalid' })
  state: States;

  @ValidateIf(
    (thisPerson) =>
      thisPerson.city !== undefined &&
      thisPerson.city !== '' &&
      thisPerson.city !== null,
  )
  @IsString({ message: 'person.city.invalid' })
  city: string;

  @ValidateIf(
    (thisPerson) =>
      thisPerson.district !== undefined &&
      thisPerson.district !== '' &&
      thisPerson.district !== null,
  )
  @IsString({ message: 'person.district.invalid' })
  district: string;

  @ValidateIf(
    (thisPerson) =>
      thisPerson.street !== undefined &&
      thisPerson.street !== '' &&
      thisPerson.street !== null,
  )
  @IsString({ message: 'person.number.invalid' })
  street: string;

  @ValidateIf(
    (thisPerson) =>
      thisPerson.number !== undefined &&
      thisPerson.number !== '' &&
      thisPerson.number !== null,
  )
  @IsString({ message: 'person.number.invalid' })
  @Length(1, 5, { message: 'person.number.length_error' })
  @Matches(/(\d{1,5})|(SN)|(S\/N)/g, {
    message: 'person.number.invalid',
  })
  number: string;

  @ValidateIf(
    (thisPerson) =>
      thisPerson.obs !== undefined &&
      thisPerson.obs !== '' &&
      thisPerson.obs !== null,
  )
  @IsString({ message: 'person.obs.invalid' })
  obs: string;

  @ValidateIf(
    (thisPerson) =>
      thisPerson.email !== undefined &&
      thisPerson.email !== '' &&
      thisPerson.email !== null,
  )
  @IsEmail({}, { message: 'person.email.invalid' })
  @Length(7, 50, { message: 'person.email.invalid' })
  email: string;

  @ValidateIf(
    (thisPerson) =>
      thisPerson.phone !== undefined &&
      thisPerson.phone !== '' &&
      thisPerson.phone !== null,
  )
  @IsNumberString({}, { message: 'person.phone.invalid' })
  @Length(1, 11, { message: 'person.phone.invalid' })
  phone: string;
}
