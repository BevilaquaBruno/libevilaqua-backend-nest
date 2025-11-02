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
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { AuthGuard } from '../../src/auth/auth.guard';
import { FindTagDto } from './dto/find-tag.dto';
import { Tag } from './entities/tag.entity';
import { PayloadAuthDto } from '../auth/dto/payload-auth.dto';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) { }

  // Cria uma tag
  @UseGuards(AuthGuard)
  @Post()
  async create(@Req() req: Request, @Body() createTagDto: CreateTagDto) {
    const reqUser: PayloadAuthDto = req['user'];
    
    const newTag = await this.tagService.create(createTagDto, reqUser.libraryId);

    return {
      id: newTag.id,
      description: newTag.description,
    };
  }

  // Retorna as tags
  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() req: Request, @Query('page') page: string, @Query('limit') limit: string) {
    const reqUser: PayloadAuthDto = req['user'];
    // Cria a paginação
    const findTag: FindTagDto = {
      page: null,
      limit: null,
    };

    // Define a paginação
    findTag.limit = limit == undefined ? 5 : parseInt(limit);
    findTag.page = page == undefined ? 0 : findTag.limit * (parseInt(page) - 1);

    return {
      data: await this.tagService.findAll(findTag, reqUser.libraryId),
      count: await this.tagService.count(reqUser.libraryId),
    };
  }

  // Retorna uma tag
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const reqUser: PayloadAuthDto = req['user'];
    // Verifica se a tag existe
    const tag: Tag = await this.tagService.findOne(+id, reqUser.libraryId);
    if (null == tag)
      throw new HttpException(
        'Tag não encontrada. Código da tag: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );
    return tag;
  }

  // Cria uma tag
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    const reqUser: PayloadAuthDto = req['user'];
    // Verifica se a tag existe
    const tag: Tag = await this.tagService.findOne(+id, reqUser.libraryId);
    if (null == tag)
      throw new HttpException(
        'Tag não encontrada. Código da tag: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );

    // Atualiza a tag
    const updatedTag = await this.tagService.update(+id, updateTagDto, reqUser.libraryId);
    if (updatedTag.affected == 1) {
      return {
        id: +id,
        description: updateTagDto.description,
      };
    } else {
      throw new HttpException(
        'Ocorreu algum erro com a atualização da tag.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Deleta a tag
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    const reqUser: PayloadAuthDto = req['user'];
    // Verifica se a tag existe
    const tag: Tag = await this.tagService.findOne(+id, reqUser.libraryId);
    if (null == tag)
      throw new HttpException(
        'Tag não encontrada. Código da tag: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );

    // Deleta a tag
    const deletedTag = await this.tagService.remove(+id, reqUser.libraryId);
    if (deletedTag.affected == 1) {
      return {
        statusCode: 200,
        message: 'Tag deletada com sucesso.',
      };
    } else {
      throw new HttpException(
        'Ocorreu algum erro ao deletar a tag.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
