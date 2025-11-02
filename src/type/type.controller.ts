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
import { TypeService } from './type.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { AuthGuard } from '../../src/auth/auth.guard';
import { FindTypeDto } from './dto/find-type.dto';
import { Type } from './entities/type.entity';
import { PayloadAuthDto } from 'src/auth/dto/payload-auth.dto';

@Controller('type')
export class TypeController {
  constructor(private readonly typeService: TypeService) { }

  // Cria o tipo
  @UseGuards(AuthGuard)
  @Post()
  async create(@Req() req: Request, @Body() createTypeDto: CreateTypeDto) {
    const reqUser: PayloadAuthDto = req['user'];
    
    // Cria o tipo
    const newType = await this.typeService.create(createTypeDto, reqUser.libraryId);

    return {
      id: newType.id,
      description: newType.description,
    };
  }

  // Retorna uma lista de tipos
  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() req: Request, @Query('page') page: string, @Query('limit') limit: string) {
    const reqUser: PayloadAuthDto = req['user'];
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
      data: await this.typeService.findAll(findType, reqUser.libraryId),
      count: await this.typeService.count(reqUser.libraryId),
    };
  }

  // Retorna um tipo
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const reqUser: PayloadAuthDto = req['user'];

    // Verifica se o tipo existe e retorna
    const type: Type = await this.typeService.findOne(+id, reqUser.libraryId);
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
  async update(@Req() req: Request, @Param('id') id: string, @Body() updateTypeDto: UpdateTypeDto) {
    const reqUser: PayloadAuthDto = req['user'];
    // Verifica se o tipo existe
    const type: Type = await this.typeService.findOne(+id, reqUser.libraryId);
    if (null == type) {
      throw new HttpException(
        'Tipo não encontrado. Código do tipo: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );
    }

    // Atualiza o tipo
    const updatedType = await this.typeService.update(+id, updateTypeDto, reqUser.libraryId);
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
  async remove(@Req() req: Request, @Param('id') id: string) {
    const reqUser: PayloadAuthDto = req['user'];
    // Verifica se o tipo existe
    const type: Type = await this.typeService.findOne(+id, reqUser.libraryId);
    if (null == type) {
      throw new HttpException(
        'Tipo não encontrado. Código do tipo: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );
    }

    // Deleta o tipo e retorna ele
    const deletedType = await this.typeService.remove(+id, reqUser.libraryId);
    if (deletedType.affected == 1) {
      return {
        statusCode: 200,
        message: 'Tipo deletado com sucesso.',
      };
    } else {
      throw new HttpException(
        'Ocorreu algum erro ao deletar o tipo.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
