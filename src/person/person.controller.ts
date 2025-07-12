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
} from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FindPersonDto } from './dto/find-person.dto';
import { Person } from './entities/person.entity';
import CPF from 'cpf-check';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  // Cria uma pessoa
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createPersonDto: CreatePersonDto) {
    // Valida o CPF
    const isCpfValid = CPF.validate(createPersonDto.cpf);
    if (!isCpfValid) {
      throw new HttpException('CPF inválido.', HttpStatus.BAD_REQUEST);
    }

    // Valida se a pessoa(CPF) já está cadastrada
    const isPersonRegistered = await this.personService.findByCPF(
      createPersonDto.cpf,
    );
    if (isPersonRegistered?.cpf != undefined) {
      throw new HttpException('CPF já cadastrado.', HttpStatus.BAD_REQUEST);
    }

    // Valida campos vazios e os deixa null
    createPersonDto.cep =
      '' == createPersonDto.cep || undefined == createPersonDto.cep
        ? null
        : createPersonDto.cep;
    createPersonDto.state =
      undefined == createPersonDto.state ? null : createPersonDto.state;
    createPersonDto.city =
      '' == createPersonDto.city || undefined == createPersonDto.city
        ? null
        : createPersonDto.city;
    createPersonDto.district =
      '' == createPersonDto.district || undefined == createPersonDto.district
        ? null
        : createPersonDto.district;
    createPersonDto.street =
      '' == createPersonDto.street || undefined == createPersonDto.street
        ? null
        : createPersonDto.street;
    createPersonDto.number =
      '' == createPersonDto.number || undefined == createPersonDto.number
        ? null
        : createPersonDto.number;
    createPersonDto.obs =
      '' == createPersonDto.obs || undefined == createPersonDto.obs
        ? null
        : createPersonDto.obs;

    // Cria a pessoa
    const newPerson: Person = await this.personService.create(createPersonDto);

    // Remove os campos de criação e atualização
    delete newPerson.createdAt;
    delete newPerson.updatedAt;

    return newPerson;
  }

  // Retorna uma lista de pessoa
  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Query('page') page: string, @Query('limit') limit: string) {
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
      data: await this.personService.findAll(findPerson),
      count: await this.personService.count(),
    };
  }

  // Retorna uma pessoa
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    // Verifica se a pessoa existe - Retorna erro ou a pessoa
    const person: Person = await this.personService.findOne(+id);
    if (null == person)
      throw new HttpException(
        'Pessoa não encontrada. Código da pessoa: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );
    return person;
  }

  // Atualiza uma pessoa
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePersonDto: UpdatePersonDto,
  ) {
    // Verifica e valida se a pessoa existe - Retorna erro se não
    const person: Person = await this.personService.findOne(+id);
    if (null == person)
      throw new HttpException(
        'Pessoa não encontrada. Código da pessoa: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );

    // Valida o CPF
    const isCpfValid = CPF.validate(updatePersonDto.cpf);
    if (!isCpfValid) {
      throw new HttpException('CPF inválido.', HttpStatus.BAD_REQUEST);
    }

    // Verifica se a pessoa (CPF) já está cadastrada
    const isPersonRegistered = await this.personService.findByCPF(
      updatePersonDto.cpf,
      +id,
    );
    if (isPersonRegistered?.cpf != undefined) {
      throw new HttpException('CPF já cadastrado.', HttpStatus.BAD_REQUEST);
    }

    // valida campos vazios e os deixa null
    updatePersonDto.cep =
      '' == updatePersonDto.cep || undefined == updatePersonDto.cep
        ? null
        : updatePersonDto.cep;
    updatePersonDto.state =
      undefined == updatePersonDto.state ? null : updatePersonDto.state;
    updatePersonDto.city =
      '' == updatePersonDto.city || undefined == updatePersonDto.city
        ? null
        : updatePersonDto.city;
    updatePersonDto.district =
      '' == updatePersonDto.district || undefined == updatePersonDto.district
        ? null
        : updatePersonDto.district;
    updatePersonDto.street =
      '' == updatePersonDto.street || undefined == updatePersonDto.street
        ? null
        : updatePersonDto.street;
    updatePersonDto.number =
      '' == updatePersonDto.number || undefined == updatePersonDto.number
        ? null
        : updatePersonDto.number;
    updatePersonDto.obs =
      '' == updatePersonDto.obs || undefined == updatePersonDto.obs
        ? null
        : updatePersonDto.obs;

    // Atualiza a pessoa e retorna ela ou erro
    const updatedPerson = await this.personService.update(+id, updatePersonDto);
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
      };

      return returnPerson;
    } else {
      throw new HttpException(
        'Ocorreu algum erro com a atualização da pessoa.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Deleta uma pessoa
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    // Verifica se a pessoa existe e retorna erro
    const person: Person = await this.personService.findOne(+id);
    if (null == person)
      throw new HttpException(
        'Pessoa não encontrada. Código da pessoa: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );

    // Deleta e pessoa, retorna sucess ou erro
    const deletePerson = await this.personService.remove(+id);
    if (deletePerson.affected == 1) {
      throw new HttpException('Pessoa deletada com sucesso.', HttpStatus.OK);
    } else {
      throw new HttpException(
        'Ocorreu algum erro ao deletar a pessoa.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
