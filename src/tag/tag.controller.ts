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
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FindTagDto } from './dto/find-tag.dto';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const findTag: FindTagDto = {
      page: null,
      limit: null,
    };

    findTag.limit = limit == undefined ? 5 : parseInt(limit);
    findTag.page = page == undefined ? 0 : findTag.limit * (parseInt(page) - 1);

    return {
      data: await this.tagService.findAll(findTag),
      count: await this.tagService.count(),
    };
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(+id, updateTagDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagService.remove(+id);
  }
}
