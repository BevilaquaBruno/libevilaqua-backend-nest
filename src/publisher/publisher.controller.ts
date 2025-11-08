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
import { PublisherService } from './publisher.service';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { AuthGuard } from '../../src/auth/auth.guard';
import { FindPublisherDto } from './dto/find-publisher.dto';
import { Publisher } from './entities/publisher.entity';
import { PayloadAuthDto } from '../auth/dto/payload-auth.dto';

@Controller('publisher')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) { }

  // Cria uma editora
  @UseGuards(AuthGuard)
  @Post()
  async create(@Req() req: Request, @Body() createPublisherDto: CreatePublisherDto) {
    const reqUser: PayloadAuthDto = req['user'];
    // Cria a editora
    const newPublisher = await this.publisherService.create(createPublisherDto, reqUser.libraryId);

    return {
      id: newPublisher.id,
      name: newPublisher.name,
      country: newPublisher.country,
    };
  }

  // Retorna as editoras
  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() req: Request, @Query('page') page: string, @Query('limit') limit: string) {
    const reqUser: PayloadAuthDto = req['user'];
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
      data: await this.publisherService.findAll(findPublisher, reqUser.libraryId),
      count: await this.publisherService.count(reqUser.libraryId),
    };
  }

  // Retorna uma editora
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const reqUser: PayloadAuthDto = req['user'];
    // Verifica se a editora existe
    const publisher: Publisher = await this.publisherService.findOne(+id, reqUser.libraryId);
    if (null == publisher)
      throw new HttpException(
        'publisher.general.not_found',
        HttpStatus.NOT_FOUND,
      );
    return publisher;
  }

  // Atualiza a editora
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() updatePublisherDto: UpdatePublisherDto) {
    const reqUser: PayloadAuthDto = req['user'];
    // Verifica se a editora existe
    const publisher: Publisher = await this.publisherService.findOne(+id, reqUser.libraryId);
    if (null == publisher)
      throw new HttpException(
        'publisher.general.not_found',
        HttpStatus.NOT_FOUND,
      );

    // Atualiza a editora
    const updatedPublisher = await this.publisherService.update(
      +id,
      updatePublisherDto,
      reqUser.libraryId
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
        'publisher.general.delete_error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Deleta e editora
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    const reqUser: PayloadAuthDto = req['user'];
    // Verifica se a editora existe
    const publisher: Publisher = await this.publisherService.findOne(+id, reqUser.libraryId);
    if (null == publisher)
      throw new HttpException(
        'publisher.general.not_found',
        HttpStatus.NOT_FOUND,
      );

    // Deleta e editora e retorna
    const deletedPublisher = await this.publisherService.remove(+id, reqUser.libraryId);
    if (deletedPublisher.affected == 1) {
      return {
        statusCode: 200,
        message: 'publisher.general.deleted_with_success',
      };
    } else {
      throw new HttpException(
        'publisher.general.delete_error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
