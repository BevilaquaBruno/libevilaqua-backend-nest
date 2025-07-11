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
  constructor(private readonly publisherService: PublisherService) { }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createPublisherDto: CreatePublisherDto) {
    const newPublisher = await this.publisherService.create(createPublisherDto);

    return {
      id: newPublisher.id,
      name: newPublisher.name,
      country: newPublisher.country
    };
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const findPublisher: FindPublisherDto = {
      page: null,
      limit: null,
    };

    findPublisher.limit = limit == undefined ? 5 : parseInt(limit);
    findPublisher.page =
      page == undefined ? 0 : findPublisher.limit * (parseInt(page) - 1);

    return {
      data: await this.publisherService.findAll(findPublisher),
      count: await this.publisherService.count(),
    };
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    let publisher: Publisher = await this.publisherService.findOne(+id);

    if (null == publisher)
      throw new HttpException(
        'Editora não encontrada. Código da editora ' + id + '.',
        HttpStatus.NOT_FOUND
      );
    return publisher;
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePublisherDto: UpdatePublisherDto,
  ) {
    let publisher: Publisher = await this.publisherService.findOne(+id);
    if (null == publisher)
      throw new HttpException(
        'Editora não encontrada. Código da editora ' + id + '.',
        HttpStatus.NOT_FOUND
      );

    const updatedPublisher = await this.publisherService.update(+id, updatePublisherDto);
    if (updatedPublisher.affected == 1) {
      let returnData: UpdatePublisherDto = {
        id: +id,
        name: updatePublisherDto.name,
        country: updatePublisherDto.country
      };
      return returnData;
    } else {
      throw new HttpException(
        'Ocorreu algum erro com a atualização da editora.',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    let publisher: Publisher = await this.publisherService.findOne(+id);
    if (null == publisher)
      throw new HttpException(
        'Editora não encontrada. Código da editora ' + id + '.',
        HttpStatus.NOT_FOUND
      );
     let deletedPublisher = await this.publisherService.remove(+id);
    if (deletedPublisher.affected == 1) {
      throw new HttpException(
        'Editora deletada com sucesso.',
        HttpStatus.OK
      );
    } else {
      throw new HttpException(
        'Ocorreu algum erro ao deletar a editora.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
