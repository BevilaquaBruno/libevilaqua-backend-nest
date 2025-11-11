import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { AuthGuard } from '../../src/auth/auth.guard';
import { FindPersonDto } from './dto/find-person.dto';
import { Person } from './entities/person.entity';
import CPF from 'cpf-check';
import { PayloadAuthDto } from '../auth/dto/payload-auth.dto';
import { ApiParam, ApiQuery } from '@nestjs/swagger';
import { ApiDefaultErrorResponses } from '../common/decoratores/api-default-error-responses.decorator';

@ApiDefaultErrorResponses()
@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) { }

  // Cria uma pessoa
  @UseGuards(AuthGuard)
  @Post()
  async create(@Req() req: Request, @Body() createPersonDto: CreatePersonDto) {
    const reqUser: PayloadAuthDto = req['user'];

    // Valida o CPF
    if (createPersonDto.cpf) {
      const isCpfValid = CPF.validate(createPersonDto.cpf);
      if (!isCpfValid) {
        throw new HttpException('person.cpf.invalid', HttpStatus.BAD_REQUEST);
      }

      // Valida se a pessoa(CPF) já está cadastrada
      const isPersonRegistered = await this.personService.findByCPF(
        createPersonDto.cpf,
        null,
        reqUser.libraryId
      );
      if (isPersonRegistered?.cpf != undefined) {
        throw new HttpException('person.cpf.already_registered', HttpStatus.BAD_REQUEST);
      }
    }

    // Cria a pessoa
    const newPerson: Person = await this.personService.create(createPersonDto, reqUser.libraryId);
    const returnPerson: UpdatePersonDto = {
      id: newPerson.id,
      cpf: newPerson.cpf,
      name: newPerson.name,
      cep: newPerson.cep,
      state: newPerson.state,
      city: newPerson.city,
      district: newPerson.district,
      number: newPerson.number,
      street: newPerson.street,
      obs: newPerson.obs,
      email: newPerson.email,
      phone: newPerson.phone,
    };

    return returnPerson;
  }

  // Retorna uma lista de pessoa
  @UseGuards(AuthGuard)
  @Get()
  @ApiQuery({ name: 'page', required: false, example: '1', description: 'Page number.', schema: { default: 1 } })
  @ApiQuery({ name: 'limit', required: false, example: '10', description: 'Limit of registers in the page.', schema: { default: 5 } })
  async findAll(@Req() req: Request, @Query('page') page: string, @Query('limit') limit: string) {
    const reqUser: PayloadAuthDto = req['user'];
    // Cria a paginação
    const findPerson: FindPersonDto = {
      page: null,
      limit: null,
    };

    // Define a paginação
    findPerson.limit = limit == undefined ? 5 : parseInt(limit);
    findPerson.page =
      page == undefined ? 0 : findPerson.limit * (parseInt(page) - 1);

    return {
      data: await this.personService.findAll(findPerson, reqUser.libraryId),
      count: await this.personService.count(reqUser.libraryId),
    };
  }

  // Retorna uma pessoa
  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiParam({ name: 'id', required: true, example: '1', description: 'Person id.' })
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const reqUser: PayloadAuthDto = req['user'];
    // Verifica se a pessoa existe - Retorna erro ou a pessoa
    const person: Person = await this.personService.findOne(+id, reqUser.libraryId);
    if (null == person)
      throw new HttpException(
        'person.general.not_found',
        HttpStatus.NOT_FOUND,
      );
    return person;
  }

  // Atualiza uma pessoa
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    const reqUser: PayloadAuthDto = req['user'];
    // Verifica e valida se a pessoa existe - Retorna erro se não
    const person: Person = await this.personService.findOne(+id, reqUser.libraryId);
    if (null == person)
      throw new HttpException(
        'person.general.not_found',
        HttpStatus.NOT_FOUND,
      );

    // Valida o CPF
    if (updatePersonDto.cpf) {
      const isCpfValid = CPF.validate(updatePersonDto.cpf);
      if (!isCpfValid) {
        throw new HttpException('person.cpf.invalid', HttpStatus.BAD_REQUEST);
      }

      // Verifica se a pessoa (CPF) já está cadastrada
      const isPersonRegistered = await this.personService.findByCPF(
        updatePersonDto.cpf,
        +id,
        reqUser.libraryId
      );
      if (isPersonRegistered?.cpf != undefined) {
        throw new HttpException('person.cpf.already_registered', HttpStatus.BAD_REQUEST);
      }
    }

    // Atualiza a pessoa e retorna ela ou erro
    const updatedPerson = await this.personService.update(+id, updatePersonDto, reqUser.libraryId);
    if (updatedPerson.affected == 1) {
      const returnPerson: UpdatePersonDto = {
        id: +id,
        cpf: updatePersonDto.cpf,
        name: updatePersonDto.name,
        cep: updatePersonDto.cep,
        state: updatePersonDto.state,
        city: updatePersonDto.city,
        district: updatePersonDto.district,
        number: updatePersonDto.number,
        street: updatePersonDto.street,
        obs: updatePersonDto.obs,
        email: updatePersonDto.email,
        phone: updatePersonDto.phone,
      };

      return returnPerson;
    } else {
      throw new HttpException(
        'person.general.update_error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Deleta uma pessoa
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiParam({ name: 'id', required: true, example: '1', description: 'Person id.' })
  async remove(@Req() req: Request, @Param('id') id: string) {
    const reqUser: PayloadAuthDto = req['user'];
    // Verifica se a pessoa existe e retorna erro
    const person: Person = await this.personService.findOne(+id, reqUser.libraryId);
    if (null == person)
      throw new HttpException(
        'person.general.not_found',
        HttpStatus.NOT_FOUND,
      );

    // Deleta e pessoa, retorna sucess ou erro
    const deletePerson = await this.personService.remove(+id, reqUser.libraryId);

    if (deletePerson.affected == 1) {
      return {
        statusCode: 200,
        message: 'person.general.deleted_with_success',
      };
    } else {
      throw new HttpException(
        'person.general.delete_error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
