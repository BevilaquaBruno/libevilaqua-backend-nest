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
import { TypeService } from './type.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FindTypeDto } from './dto/find-type.dto';

@Controller('type')
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createTypeDto: CreateTypeDto) {
    return this.typeService.create(createTypeDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const findType: FindTypeDto = {
      page: null,
      limit: null,
    };

    findType.limit = limit == undefined ? 5 : parseInt(limit);
    findType.page =
      page == undefined ? 0 : findType.limit * (parseInt(page) - 1);

    return {
      data: await this.typeService.findAll(findType),
      count: await this.typeService.count(),
    };
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typeService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTypeDto: UpdateTypeDto) {
    return this.typeService.update(+id, updateTypeDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeService.remove(+id);
  }
}
