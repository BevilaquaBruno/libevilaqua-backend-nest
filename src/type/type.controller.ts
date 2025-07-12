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
import { TypeService } from './type.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { AuthGuard } from '../../src/auth/auth.guard';
import { FindTypeDto } from './dto/find-type.dto';
import { Type } from './entities/type.entity';

@Controller('type')
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  // Cria o tipo
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createTypeDto: CreateTypeDto) {
    // Cria o tipo
    const newType = await this.typeService.create(createTypeDto);

    return {
      id: newType.id,
      description: newType.description,
    };
  }

  // Retorna uma lista de tipos
  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Query('page') page: string, @Query('limit') limit: string) {
    // Cria a paginação
    const findType: FindTypeDto = {
      page: null,
      limit: null,
    };

    // Define a paginação
    findType.limit = limit == undefined ? 5 : parseInt(limit);
    findType.page =
      page == undefined ? 0 : findType.limit * (parseInt(page) - 1);

    return {
      data: await this.typeService.findAll(findType),
      count: await this.typeService.count(),
    };
  }

  // Retorna um tipo
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    // Verifica se o tipo existe e retorna
    const type: Type = await this.typeService.findOne(+id);
    if (null == type)
      throw new HttpException(
        'Tipo não encontrado. Código do tipo: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );
    return type;
  }

  // Edita o tipo
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTypeDto: UpdateTypeDto) {
    // Verifica se o tipo existe
    const type: Type = await this.typeService.findOne(+id);
    if (null == type) {
      throw new HttpException(
        'Tipo não encontrado. Código do tipo: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );
    }

    // Atualiza o tipo
    const updatedType = await this.typeService.update(+id, updateTypeDto);
    if (updatedType.affected == 1) {
      return {
        id: +id,
        description: updateTypeDto.description,
      };
    } else {
      throw new HttpException(
        'Ocorreu algum erro com a atualização do tipo.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Exclui o tipo
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    // Verifica se o tipo existe
    const type: Type = await this.typeService.findOne(+id);
    if (null == type) {
      throw new HttpException(
        'Tipo não encontrado. Código do tipo: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );
    }

    // Deleta o tipo e retorna ele
    const deletedType = await this.typeService.remove(+id);
    if (deletedType.affected == 1) {
      throw new HttpException('Tipo deletado com sucesso.', HttpStatus.OK);
    } else {
      throw new HttpException(
        'Ocorreu algum erro ao deletar o tipo.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
