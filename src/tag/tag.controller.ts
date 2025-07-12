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
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FindTagDto } from './dto/find-tag.dto';
import { Tag } from './entities/tag.entity';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  // Cria uma tag
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createTagDto: CreateTagDto) {
    const newTag = await this.tagService.create(createTagDto);

    return {
      id: newTag.id,
      description: newTag.description,
    };
  }

  // Retorna as tags
  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Query('page') page: string, @Query('limit') limit: string) {
    // Cria a paginação
    const findTag: FindTagDto = {
      page: null,
      limit: null,
    };

    // Define a paginação
    findTag.limit = limit == undefined ? 5 : parseInt(limit);
    findTag.page = page == undefined ? 0 : findTag.limit * (parseInt(page) - 1);

    return {
      data: await this.tagService.findAll(findTag),
      count: await this.tagService.count(),
    };
  }

  // Retorna uma tag
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    // Verifica se a tag existe
    const tag: Tag = await this.tagService.findOne(+id);
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
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    // Verifica se a tag existe
    const tag: Tag = await this.tagService.findOne(+id);
    if (null == tag)
      throw new HttpException(
        'Tag não encontrada. Código da tag: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );

    // Atualiza a tag
    const updatedTag = await this.tagService.update(+id, updateTagDto);
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
  async remove(@Param('id') id: string) {
    // Verifica se a tag existe
    const tag: Tag = await this.tagService.findOne(+id);
    if (null == tag)
      throw new HttpException(
        'Tag não encontrada. Código da tag: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );

    // Deleta a tag
    const deletedTag = await this.tagService.remove(+id);
    if (deletedTag.affected == 1) {
      throw new HttpException('Tag deletada com sucesso.', HttpStatus.OK);
    } else {
      throw new HttpException(
        'Ocorreu algum erro ao deletar a tag.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
