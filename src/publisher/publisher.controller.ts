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
import { PublisherService } from './publisher.service';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FindPublisherDto } from './dto/find-publisher.dto';
import { Publisher } from './entities/publisher.entity';

@Controller('publisher')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  // Cria uma editora
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createPublisherDto: CreatePublisherDto) {
    // Cria a editora
    const newPublisher = await this.publisherService.create(createPublisherDto);

    return {
      id: newPublisher.id,
      name: newPublisher.name,
      country: newPublisher.country,
    };
  }

  // Retorna as editoras
  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Query('page') page: string, @Query('limit') limit: string) {
    // Cria a paginação
    const findPublisher: FindPublisherDto = {
      page: null,
      limit: null,
    };

    // Define a paginação
    findPublisher.limit = limit == undefined ? 5 : parseInt(limit);
    findPublisher.page =
      page == undefined ? 0 : findPublisher.limit * (parseInt(page) - 1);

    return {
      data: await this.publisherService.findAll(findPublisher),
      count: await this.publisherService.count(),
    };
  }

  // Retorna uma editora
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    // Verifica se a editora existe
    const publisher: Publisher = await this.publisherService.findOne(+id);
    if (null == publisher)
      throw new HttpException(
        'Editora não encontrada. Código da editora ' + id + '.',
        HttpStatus.NOT_FOUND,
      );
    return publisher;
  }

  // Atualiza a editora
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePublisherDto: UpdatePublisherDto,
  ) {
    // Verifica se a editora existe
    const publisher: Publisher = await this.publisherService.findOne(+id);
    if (null == publisher)
      throw new HttpException(
        'Editora não encontrada. Código da editora ' + id + '.',
        HttpStatus.NOT_FOUND,
      );

    // Atualiza a editora
    const updatedPublisher = await this.publisherService.update(
      +id,
      updatePublisherDto,
    );
    if (updatedPublisher.affected == 1) {
      const returnData: UpdatePublisherDto = {
        id: +id,
        name: updatePublisherDto.name,
        country: updatePublisherDto.country,
      };
      return returnData;
    } else {
      throw new HttpException(
        'Ocorreu algum erro com a atualização da editora.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Deleta e editora
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    // Verifica se a editora existe
    const publisher: Publisher = await this.publisherService.findOne(+id);
    if (null == publisher)
      throw new HttpException(
        'Editora não encontrada. Código da editora ' + id + '.',
        HttpStatus.NOT_FOUND,
      );

    // Deleta e editora e retorna
    const deletedPublisher = await this.publisherService.remove(+id);
    if (deletedPublisher.affected == 1) {
      throw new HttpException('Editora deletada com sucesso.', HttpStatus.OK);
    } else {
      throw new HttpException(
        'Ocorreu algum erro ao deletar a editora.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
