import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { LibraryService } from './library.service';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { AuthGuard } from '../auth/auth.guard';
import { PayloadAuthDto } from '../auth/dto/payload-auth.dto';
import { ApiParam } from '@nestjs/swagger';
import { ApiDefaultErrorResponses } from '../common/decoratores/api-default-error-responses.decorator';

@ApiDefaultErrorResponses()
@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) { }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiParam({ name: 'id', required: true, example: '1', description: 'Library id.' })
  async update(@Req() req: Request, @Param('id') id: string, @Body() updateLibraryDto: UpdateLibraryDto) {
    const reqUser: PayloadAuthDto = req['user'];
    if (reqUser.libraryId.toString() != id) {
      throw new UnauthorizedException();
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
        'library.general.update_error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiParam({ name: 'id', required: true, example: '1', description: 'Library id.' })
  async remove(@Req() req: Request, @Param('id') id: string) {
    const reqUser: PayloadAuthDto = req['user'];
    if (reqUser.libraryId.toString() != id) {
      throw new UnauthorizedException();
    }
    const deleteLibrary = await this.libraryService.remove(reqUser.libraryId);
    if (deleteLibrary.affected == 1) {
      return {
        statusCode: 200,
        message: 'library.general.deleted_with_success',
      };
    } else {
      throw new HttpException(
        'library.general.delete_error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
