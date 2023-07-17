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
} from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FindPublisherDto } from './dto/find-publisher.dto';

@Controller('publisher')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createPublisherDto: CreatePublisherDto) {
    return this.publisherService.create(createPublisherDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const findPublisher: FindPublisherDto = {
      page: null,
      limit: null,
    };

    findPublisher.limit = limit == undefined ? 5 : parseInt(limit);
    findPublisher.page =
      page == undefined ? 0 : findPublisher.limit * (parseInt(page) - 1);

    return this.publisherService.findAll(findPublisher);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publisherService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePublisherDto: UpdatePublisherDto,
  ) {
    return this.publisherService.update(+id, updatePublisherDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publisherService.remove(+id);
  }
}
