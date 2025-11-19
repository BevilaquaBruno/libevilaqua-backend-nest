import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../../src/auth/auth.guard';
import * as bcrypt from 'bcrypt';
import { FindUserDto } from './dto/find-user.dto';
import { User } from './entities/user.entity';
import { MailService } from '../mail/mail.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserWithLibraryDto } from './dto/create-user-with-library.dto';
import { LibraryService } from '../library/library.service';
import { PayloadAuthDto } from '../auth/dto/payload-auth.dto';
import { ApiParam, ApiQuery } from '@nestjs/swagger';
import { ApiDefaultErrorResponses } from '../common/decoratores/api-default-error-responses.decorator';

@ApiDefaultErrorResponses()
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly authService: AuthService,
    private readonly libraryService: LibraryService,
  ) { }

  // Cria o usuário
  @UseGuards(AuthGuard)
  @Post()
  async create(@Req() req: Request, @Body() createUserDto: CreateUserDto) {
    const reqUser: PayloadAuthDto = req['user'];

    const library = await this.libraryService.findOne(reqUser.libraryId);
    if (!library) {
      throw new HttpException(
        'library.general.not_found',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Valida se as senhas informadas são iguais
    if (createUserDto.password != createUserDto.verify_password) {
      throw new HttpException(
        'user.password.different_password',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Valida se o usuário (email) já existe, se existe retorna erro
    const userAlreadyExistsInLibrary = await this.userService.findByEmail(
      createUserDto.email,
      reqUser.libraryId,
    );
    if (userAlreadyExistsInLibrary?.email != undefined) {
      throw new HttpException(
        'user.email.already_registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Valida se o usuário (email) já existe, se existe retorna erro
    const userEmailAlreadyExists = await this.userService.findByEmail(
      createUserDto.email,
    );

    let currentUser: User | null = null;
    if (userEmailAlreadyExists?.id != undefined) {
      currentUser = userEmailAlreadyExists;
    } else {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
      currentUser = await this.userService.create(createUserDto);
    }

    if (!currentUser) {
      throw new HttpException(
        'user.general.register_error',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newLibraryUser = await this.userService.createLibraryUser(
      currentUser.id,
      reqUser.libraryId,
    );
    if (!newLibraryUser) {
      throw new HttpException(
        'user.general.error_link_user_lib',
        HttpStatus.BAD_REQUEST,
      );
    }

    // envia o e-mail
    const token = this.authService.generateResetToken(
      currentUser,
      'E',
      reqUser.libraryId,
    );
    this.mailService.sendUserConfirmation(
      currentUser,
      token,
      library.description,
    );

    return {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      language: currentUser.language,
    };
  }

  @Post('/with-library')
  async createUserWithLibrary(
    @Body() createUserWithLibrary: CreateUserWithLibraryDto,
  ) {
    const createUserDto = createUserWithLibrary.user;
    const createLibraryDto = createUserWithLibrary.library;

    // Valida se as senhas informadas são iguais
    if (createUserDto.password != createUserDto.verify_password) {
      throw new HttpException(
        'user.password.different_password',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Valida se o usuário (email) já existe, se existe retorna erro
    const userAlreadyExists = await this.userService.findByEmail(
      createUserDto.email,
    );

    let currentUser: User | null = null;
    if (userAlreadyExists?.id != undefined) {
      currentUser = userAlreadyExists;
      const isPasswordCorrect = await this.authService.signIn(
        createUserDto.email,
        createUserDto.password,
        false
      );

      if(!isPasswordCorrect){
        throw new UnauthorizedException();
      }
    } else {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
      currentUser = await this.userService.create(createUserDto);
    }

    const newLibrary = await this.libraryService.create(createLibraryDto);
    if (!newLibrary) {
      throw new HttpException(
        'library.general.register_error',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!currentUser) {
      throw new HttpException(
        'user.general.register_error',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newLibraryUser = await this.userService.createLibraryUser(
      currentUser.id,
      newLibrary.id,
    );
    if (!newLibraryUser) {
      throw new HttpException(
        'user.general.error_link_user_lib',
        HttpStatus.BAD_REQUEST,
      );
    }
    // envia o e-mail
    const token = this.authService.generateResetToken(
      currentUser,
      'E',
      newLibrary.id,
    );
    this.mailService.sendUserConfirmation(
      currentUser,
      token,
      createLibraryDto.description,
    );

    return {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      language: currentUser.language,
      library: {
        id: newLibrary.id,
        description: newLibrary.description,
      },
    };
  }

  // Retorna todos os usuários
  @UseGuards(AuthGuard)
  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    example: '1',
    description: 'Page number.',
    schema: { default: 1 },
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: '10',
    description: 'Limit of registers in the page.',
    schema: { default: 5 },
  })
  async findAll(
    @Req() req: Request,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const reqUser: PayloadAuthDto = req['user'];
    // Cria a paginação
    const findUser: FindUserDto = {
      page: null,
      limit: null,
    };

    // Define a paginação
    findUser.limit = limit == undefined ? 5 : parseInt(limit);
    findUser.page =
      page == undefined ? 0 : findUser.limit * (parseInt(page) - 1);

    return {
      data: await this.userService.findAll(findUser, reqUser.libraryId),
      count: await this.userService.count(reqUser.libraryId),
    };
  }

  // Retorna um usuário
  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    example: '1',
    description: 'User id.',
  })
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const reqUser: PayloadAuthDto = req['user'];

    // Consulta se o usuário existe
    const user: User = await this.userService.findOne(+id, reqUser.libraryId);
    if (null == user)
      throw new HttpException('user.general.not_found', HttpStatus.NOT_FOUND);
    return user;
  }

  // Edita o usuário
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiParam({
    name: 'id',
    required: true,
    example: '1',
    description: 'User id.',
  })
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const reqUser: PayloadAuthDto = req['user'];

    const library = await this.libraryService.findOne(reqUser.libraryId);
    if (!library) {
      throw new HttpException(
        'library.general.not_found',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Verifica se o usuário existe
    const user: User = await this.userService.findOne(+id, reqUser.libraryId);
    if (null == user) {
      throw new HttpException('user.general.not_found', HttpStatus.NOT_FOUND);
    }

    // Verifica se o usuário (email) já existe, excluindo o usuário atual
    const userAlreadyExistsInLibrary = await this.userService.findByEmail(
      updateUserDto.email,
      reqUser.libraryId,
      +id,
    );
    if (userAlreadyExistsInLibrary?.email != undefined) {
      throw new HttpException(
        'user.email.already_registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Verifica se tem alteração de senha
    if (updateUserDto.update_password) {
      // Verifica se tem todos os campos preenchidos
      if (
        updateUserDto.current_password == '' ||
        updateUserDto.password == '' ||
        updateUserDto.verify_password == ''
      ) {
        throw new HttpException(
          'user.password.different_password',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Valida a senha atual informada
      const user = await this.userService.findOneWithPassword(
        +id,
        reqUser.libraryId,
      );
      const isValid = await bcrypt.compare(
        updateUserDto.current_password,
        user.password,
      );
      if (!isValid) {
        throw new HttpException(
          'user.password.incorrect',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Valida se as novas senhas informadas estão iguais
      if (updateUserDto.password != updateUserDto.verify_password) {
        throw new HttpException(
          'user.password.different_password',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Cria a nova senha
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    } else {
      // Remove para retornar o response
      delete updateUserDto.password;
    }
    // Remove para retornar o response
    delete updateUserDto.verify_password;
    delete updateUserDto.update_password;
    delete updateUserDto.current_password;

    const userExists = await this.userService.findByEmail(
      updateUserDto.email,
      null,
      +id,
    );
    if (userExists) {
      throw new HttpException(
        'user.email.already_registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Se o e-mail que veio no corpo da requisição for diferente do e-mail do banco de dados, manda uma confirmação
    const isEmailChanged = updateUserDto.email != user.email ? true : false;
    if (isEmailChanged) {
      // envia o e-mail
      const userToToken: User = user;
      userToToken.name = updateUserDto.name;
      userToToken.email = updateUserDto.email;
      const token = this.authService.generateResetToken(
        userToToken,
        'E',
        reqUser.libraryId,
      );
      this.mailService.sendUserConfirmation(
        userToToken,
        token,
        library.description,
      );
    }

    // Atualiza o usuário
    const updatedUser = await this.userService.update(+id, updateUserDto);
    if (updatedUser.affected == 1) {
      if (isEmailChanged) {
        await this.userService.setLibraryUserUnconfirmed(
          +id,
          reqUser.libraryId,
        );
      }
      return {
        id: +id,
        name: updateUserDto.name,
        email: updateUserDto.email,
        language: updateUserDto.language,
      };
    } else {
      throw new HttpException(
        'user.general.update_error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Deleta o usuário
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiParam({
    name: 'id',
    required: true,
    example: '1',
    description: 'User id.',
  })
  async remove(@Req() req: Request, @Param('id') id: string) {
    const reqUser: PayloadAuthDto = req['user'];

    // Verifica se o usuário existe
    const user: User = await this.userService.findOne(+id, reqUser.libraryId);
    if (null == user) {
      throw new HttpException('user.general.not_found', HttpStatus.NOT_FOUND);
    }

    // Deleta o usuário
    const deletedUser = await this.userService.remove(+id);
    if (deletedUser.affected == 1) {
      return {
        statusCode: 200,
        message: 'user.general.deleted_with_success',
      };
    } else {
      throw new HttpException(
        'user.general.delete_error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
