import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LibraryService } from './library.service';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { FindLibraryDto } from './dto/find-library.dto';

@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) { }

  @Post()
  async create(@Body() createLibraryDto: CreateLibraryDto) {
    return await this.libraryService.create(createLibraryDto);
  }

  @Get()
  async findAll(@Query('page') page: string, @Query('limit') limit: string) {
    // Cria a paginação
    const findLibrary: FindLibraryDto = {
      limit: null,
      page: null,
    };

    // Define a paginação
    findLibrary.limit = limit == undefined ? 5 : parseInt(limit);
    findLibrary.page =
      page == undefined ? 0 : findLibrary.limit * (parseInt(page) - 1);

    return {
      data: await this.libraryService.findAll(findLibrary),
      count: await this.libraryService.count(),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.libraryService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLibraryDto: UpdateLibraryDto) {
    return await this.libraryService.update(+id, updateLibraryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.libraryService.remove(+id);
  }
}
