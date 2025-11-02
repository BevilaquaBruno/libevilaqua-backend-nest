import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common';
import { LibraryService } from './library.service';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { AuthGuard } from '../auth/auth.guard';
import { PayloadAuthDto } from '../auth/dto/payload-auth.dto';

@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) { }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() updateLibraryDto: UpdateLibraryDto) {
    const reqUser: PayloadAuthDto = req['user'];
    if (reqUser.libraryId.toString() != id) {
      throw new HttpException(
        "Biblioteca inválida, tente novamente",
        HttpStatus.BAD_REQUEST
      );
    }
    updateLibraryDto.id = reqUser.libraryId;
    const libraryUpdated = await this.libraryService.update(reqUser.libraryId, updateLibraryDto);
    if (libraryUpdated.affected == 1) {
      return {
        id: +id,
        description: updateLibraryDto.description,
      };
    } else {
      throw new HttpException(
        'Ocorreu algum erro com a atualização da biblioteca.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    const reqUser: PayloadAuthDto = req['user'];
    if (reqUser.libraryId.toString() != id) {
      throw new HttpException(
        "Biblioteca inválida, tente novamente",
        HttpStatus.BAD_REQUEST
      );
    }
    const deleteLibrary = await this.libraryService.remove(reqUser.libraryId);
    if (deleteLibrary.affected == 1) {
      return {
        statusCode: 200,
        message: 'Toda a biblioteca foi deletada com sucesso.',
      };
    } else {
      throw new HttpException(
        'Ocorreu algum erro ao deletar a biblioteca.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
