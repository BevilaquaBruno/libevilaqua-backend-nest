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
        "Biblioteca inválida, tente novamente.",
        HttpStatus.BAD_REQUEST
      );
    }

    // Valida se as senhas informadas são iguais
    if (createUserDto.password != createUserDto.verify_password) {
      throw new HttpException(
        'As senhas devem ser iguais.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Valida se o usuário (email) já existe, se existe retorna erro
    const userAlreadyExistsInLibrary = await this.userService.findByEmail(
      createUserDto.email,
      reqUser.libraryId
    );
    if (userAlreadyExistsInLibrary?.email != undefined) {
      throw new HttpException(
        'Já existe um usuário com esse e-mail cadastrado.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Valida se o usuário (email) já existe, se existe retorna erro
    const userEmailAlreadyExists = await this.userService.findByEmail(
      createUserDto.email
    );

    let currentUser: User | null = null;
    if (userEmailAlreadyExists?.id != undefined) {
      currentUser = userEmailAlreadyExists;
    } else {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
      currentUser = await this.userService.create(createUserDto);
      if (!currentUser) {
        throw new HttpException(
          'Ocorreu algum erro no registro do usuário, tente novamente.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (!currentUser) {
      throw new HttpException(
        'Ocorreu algum erro no registro do usuário, tente novamente.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newLibraryUser = await this.userService.createLibraryUser(currentUser.id, reqUser.libraryId);
    if (!newLibraryUser) {
      throw new HttpException(
        'Ocorreu algum erro no vínculo entre o usuário e a biblioteca, tente novamente.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // envia o e-mail
    const token = this.authService.generateResetToken(currentUser, 'E', reqUser.libraryId);
    this.mailService.sendUserConfirmation(currentUser.email, token, library.description);

    return {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
    };
  }

  @Post('/with-library')
  async createUserWithLibrary(@Body() createUserWithLibrary: CreateUserWithLibraryDto) {
    const createUserDto = createUserWithLibrary.user;
    const createLibraryDto = createUserWithLibrary.library;

    // Valida se as senhas informadas são iguais
    if (createUserDto.password != createUserDto.verify_password) {
      throw new HttpException(
        'As senhas devem ser iguais.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newLibrary = await this.libraryService.create(createLibraryDto);
    if (!newLibrary) {
      throw new HttpException(
        'Ocorreu algum erro no registro da biblioteca, tente novamente.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Valida se o usuário (email) já existe, se existe retorna erro
    const userAlreadyExists = await this.userService.findByEmail(
      createUserDto.email
    );

    let currentUser: User | null = null;
    if (userAlreadyExists?.id != undefined) {
      currentUser = userAlreadyExists;
    } else {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
      currentUser = await this.userService.create(createUserDto);
      if (!currentUser) {
        throw new HttpException(
          'Ocorreu algum erro no registro do usuário, tente novamente.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const newLibraryUser = await this.userService.createLibraryUser(currentUser.id, newLibrary.id);
    if (!newLibraryUser) {
      throw new HttpException(
        'Ocorreu algum erro no vínculo entre o usuário e a biblioteca, tente novamente.',
        HttpStatus.BAD_REQUEST,
      );
    }
    // envia o e-mail
    const token = this.authService.generateResetToken(currentUser, 'E', newLibrary.id);
    this.mailService.sendUserConfirmation(currentUser.email, token, createLibraryDto.description);

    return {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      library: {
        id: newLibrary.id,
        description: newLibrary.description,
      }
    };
  }

  // Retorna todos os usuários
  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() req: Request, @Query('page') page: string, @Query('limit') limit: string) {
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
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const reqUser: PayloadAuthDto = req['user'];

    // Consulta se o usuário existe
    const user: User = await this.userService.findOne(+id, reqUser.libraryId);
    if (null == user)
      throw new HttpException(
        'Usuário não encontrado. Código do usuário: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );
    return user;
  }

  // Edita o usuário
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const reqUser: PayloadAuthDto = req['user'];

    const library = await this.libraryService.findOne(reqUser.libraryId);
    if (!library) {
      throw new HttpException(
        "Biblioteca inválida, tente novamente.",
        HttpStatus.BAD_REQUEST
      );
    }

    // Verifica se o usuário existe
    const user: User = await this.userService.findOne(+id, reqUser.libraryId);
    if (null == user) {
      throw new HttpException(
        'Usuário não encontrado. Código do usuário: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );
    }

    // Verifica se o usuário (email) já existe, excluindo o usuário atual
    const userAlreadyExistsInLibrary = await this.userService.findByEmail(
      updateUserDto.email,
      reqUser.libraryId,
      +id
    );
    if (userAlreadyExistsInLibrary?.email != undefined) {
      throw new HttpException(
        'Já existe um usuário com esse e-mail cadastrado na biblioteca.',
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
          'Para atualizar a senha, preencha os campos de a senha atual, nova senha e confirmação da nova senha.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Valida a senha atual informada
      const user = await this.userService.findOneWithPassword(+id, reqUser.libraryId);
      const isValid = await bcrypt.compare(
        updateUserDto.current_password,
        user.password,
      );
      if (!isValid) {
        throw new HttpException(
          'A senha atual está incorreta.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Valida se as novas senhas informadas estão iguais
      if (updateUserDto.password != updateUserDto.verify_password) {
        throw new HttpException(
          'A nova senha e a confirmação da nova senha devem ser iguais.',
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
      +id
    );
    if (userExists) {
      throw new HttpException(
        'Não é possível utilizar este e-mail pois ele já é um usuário em outra biblioteca.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Se o e-mail que veio no corpo da requisição for diferente do e-mail do banco de dados, manda uma confirmação
    const isEmailChanged = (updateUserDto.email != user.email) ? true : false;
    if (isEmailChanged) {
      // envia o e-mail
      let userToToken: User = user;
      userToToken.name = updateUserDto.name;
      userToToken.email = updateUserDto.email;
      const token = this.authService.generateResetToken(userToToken, 'E', reqUser.libraryId);
      this.mailService.sendUserConfirmation(userToToken.email, token, library.description);
    }

    // Atualiza o usuário
    const updatedUser = await this.userService.update(+id, updateUserDto);
    if (updatedUser.affected == 1) {
      if (isEmailChanged) {
        await this.userService.setLibraryUserUnconfirmed(+id, reqUser.libraryId);
      }
      return {
        id: +id,
        name: updateUserDto.name,
        email: updateUserDto.email,
      };
    } else {
      throw new HttpException(
        'Ocorreu algum erro com a atualização do usuário.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Deleta o usuário
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    const reqUser: PayloadAuthDto = req['user'];

    // Verifica se o usuário existe
    const user: User = await this.userService.findOne(+id, reqUser.libraryId);
    if (null == user) {
      throw new HttpException(
        'Usuário não encontrado. Código do usuário: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );
    }

    // Deleta o usuário
    const deletedUser = await this.userService.remove(+id);
    if (deletedUser.affected == 1) {
      return {
        statusCode: 200,
        message: 'Usuário deletado com sucesso.',
      };
    } else {
      throw new HttpException(
        'Ocorreu algum erro ao deletar o usuário.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
