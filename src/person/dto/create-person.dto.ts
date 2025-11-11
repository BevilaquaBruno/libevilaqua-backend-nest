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
import { ApiProperty } from '@nestjs/swagger';

export class CreatePersonDto {
  @ApiProperty({ example: 'Bruno Fernando Bevilaqua', description: 'Person name.' })
  @IsString({ message: 'person.name.invalid' })
  @IsNotEmpty({ message: 'person.name.required' })
  @Length(1, 250, { message: 'person.name.length_error' })
  name: string;

  @ApiProperty({ example: '211.782.680-63', examples: ['211.782.680-63', '9875728495', null], description: 'Person document.' })
  @ValidateIf(
    (thisPerson) =>
      thisPerson.cpf !== undefined &&
      thisPerson.cpf !== '' &&
      thisPerson.cpf !== null,
  )
  @IsString({ message: 'person.cpf.invalid' })
  cpf: string;

  @ApiProperty({ example: '89700-055', examples: ['89700-055', null], description: 'Person Zip-Code.' })
  @ValidateIf(
    (thisPerson) =>
      thisPerson.cep !== undefined &&
      thisPerson.cep !== '' &&
      thisPerson.cep !== null,
  )
  @IsString({ message: 'person.cep.invalid' })
  cep: string;

  @ApiProperty({ example: 'SC', examples: ['SC', null], description: 'Person state.' })
  @ValidateIf(
    (thisPerson) =>
      thisPerson.state !== undefined &&
      thisPerson.state !== '' &&
      thisPerson.state !== null,
  )
  @IsEnum(States, { message: 'person.state.invalid' })
  state: States;

  @ApiProperty({ example: 'Concórdia', examples: ['Concórdia', null], description: 'Person city.' })
  @ValidateIf(
    (thisPerson) =>
      thisPerson.city !== undefined &&
      thisPerson.city !== '' &&
      thisPerson.city !== null,
  )
  @IsString({ message: 'person.city.invalid' })
  city: string;

  @ApiProperty({ example: 'Bairro Presidentes', examples: ['Bairro Presidentes', null], description: 'Person district.' })
  @ValidateIf(
    (thisPerson) =>
      thisPerson.district !== undefined &&
      thisPerson.district !== '' &&
      thisPerson.district !== null,
  )
  @IsString({ message: 'person.district.invalid' })
  district: string;

  @ApiProperty({ example: 'Rua Costa e Silva', examples: ['Rua Costa e Silva', null], description: 'Person street.' })
  @ValidateIf(
    (thisPerson) =>
      thisPerson.street !== undefined &&
      thisPerson.street !== '' &&
      thisPerson.street !== null,
  )
  @IsString({ message: 'person.number.invalid' })
  street: string;

  @ApiProperty({ example: '1250', examples: ['1250', 'SN', 'S/N', null], description: 'Person number.' })
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

  @ApiProperty({ example: 'Some text here', examples: ['Some text here', null], description: 'Person bio.' })
  @ValidateIf(
    (thisPerson) =>
      thisPerson.obs !== undefined &&
      thisPerson.obs !== '' &&
      thisPerson.obs !== null,
  )
  @IsString({ message: 'person.obs.invalid' })
  obs: string;

  @ApiProperty({ example: 'temp@mail.com', examples: ['temp@mail.com', null], description: 'Person e-mail.' })
  @ValidateIf(
    (thisPerson) =>
      thisPerson.email !== undefined &&
      thisPerson.email !== '' &&
      thisPerson.email !== null,
  )
  @IsEmail({}, { message: 'person.email.invalid' })
  @Length(7, 50, { message: 'person.email.invalid' })
  email: string;

  @ApiProperty({ example: '+5511923456789', examples: ['+5511923456789', null], description: 'Person phone.' })
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
