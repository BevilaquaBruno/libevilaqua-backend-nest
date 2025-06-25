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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import * as bcrypt from 'bcrypt';
import { FindUserDto } from './dto/find-user.dto';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.password != createUserDto.verify_password) {
      throw new HttpException(
        'As senhas devem ser iguais.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const userAlreadyExists = await this.userService.findByEmail(
      createUserDto.email,
    );

    if (userAlreadyExists?.email != undefined) {
      throw new HttpException(
        'Já existe um usuário com esse e-mail cadastrado.',
        HttpStatus.BAD_REQUEST,
      );
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.userService.create(createUserDto);

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    };
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const findUser: FindUserDto = {
      page: null,
      limit: null,
    };

    findUser.limit = limit == undefined ? 5 : parseInt(limit);
    findUser.page =
      page == undefined ? 0 : findUser.limit * (parseInt(page) - 1);

    return {
      data: await this.userService.findAll(findUser),
      count: await this.userService.count(),
    };
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    let user: User = await this.userService.findOne(+id);
    if (null == user)
      throw new HttpException(
        'Usuário não encontrado. Código do usuário: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );
    return user;
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    let user: User = await this.userService.findOne(+id);
    if (null == user) {
      throw new HttpException(
        'Usuário não encontrado. Código do usuário: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );
    }

    // verifica o e-mail
    const userAlreadyExists = await this.userService.findByEmail(
      updateUserDto.email,
      +id
    );

    if (userAlreadyExists?.email != undefined) {
      throw new HttpException(
        'Já existe um usuário com esse e-mail cadastrado.',
        HttpStatus.BAD_REQUEST,
      );
    }

    //verifica se tem alteração de senha
    if (updateUserDto.update_password) {
      // verifica se tem todos os campos preenchidos
      if (updateUserDto.current_password == '' || updateUserDto.password == '' || updateUserDto.verify_password == '') {
        throw new HttpException(
          'Para atualizar a senha, preencha os campos de a senha atual, nova senha e confirmação da nova senha.',
          HttpStatus.BAD_REQUEST
        );
      }

      // valida a senha atual informada
      const user = await this.userService.findOneWithPassword(+id);
      const isValid = await bcrypt.compare(updateUserDto.current_password, user.password);
      if (!isValid) {
        throw new HttpException(
          'A senha atual está incorreta.',
          HttpStatus.BAD_REQUEST
        );
      }

      // valida se as novas senhas informadas estão iguais
      if (updateUserDto.password != updateUserDto.verify_password) {
        throw new HttpException(
          'A nova senha e a confirmação da nova senha devem ser iguais.',
          HttpStatus.BAD_REQUEST
        );
      }

      // cria a nova senha
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    } else {
      delete updateUserDto.password;
    }
    delete updateUserDto.verify_password;
    delete updateUserDto.update_password;
    delete updateUserDto.current_password;

    // atualiza o usuário
    const updatedUser = await this.userService.update(+id, updateUserDto);
    if (updatedUser.affected == 1) {
      return {
        id: +id,
        name: updateUserDto.name,
        email: updateUserDto.email
      };
    } else {
      throw new HttpException(
        'Ocorreu algum erro com a atualização do usuário.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    let user: User = await this.userService.findOne(+id);
    if (null == user) {
      throw new HttpException(
        'Usuário não encontrado. Código do usuário: ' + id + '.',
        HttpStatus.NOT_FOUND,
      );
    }

    let deletedUser = await this.userService.remove(+id);
    if (deletedUser.affected == 1) {
      throw new HttpException(
        'Usuário deletado com sucesso.',
        HttpStatus.OK
      );
    } else {
      throw new HttpException(
        'Ocorreu algum erro ao deletar o usuário.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
