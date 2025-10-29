import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FindUserDto } from './dto/find-user.dto';
import { LibraryUser } from './entities/library-user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(LibraryUser) private libraryUserRepository: Repository<LibraryUser>,
  ) { }

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findAll(findUser: FindUserDto) {
    // Retorna a lista de usuários paginada
    return this.userRepository.find({
      take: findUser.limit,
      skip: findUser.page,
    });
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  findOneWithPassword(id: number) {
    // Retorna o usuário com a senha dele
    return this.userRepository.findOne({
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
      where: {
        id: id,
      },
    });
  }

  findByEmail(email: string, excludeId: number = null) {
    // Pesquisa o usuário pelo e-mail, excluir um id
    let dynamicWhere: FindOptionsWhere<User> = {
      email: email,
    };

    if (null != excludeId) {
      dynamicWhere = {
        ...dynamicWhere,
        id: Not(excludeId),
      };
    }

    return this.userRepository.findOne({
      select: {
        id: true,
        name: true,
        email: true,
        password: true
      },
      where: dynamicWhere,
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.userRepository.delete({ id });
  }

  async count() {
    return await this.userRepository.count();
  }

  async updatePassword(id: number, password: string) {
    return await this.userRepository.update(id, { password: password });
  }

  async confirmEmail(userId: number, libraryId: number) {
    const libraryUser = await this.libraryUserRepository.findOne({
      where: {
        user: { id: userId },
        library: { id: libraryId },
      },
    });

    if (!libraryUser) {
      throw new NotFoundException('Relação entre usuário e biblioteca não encontrada');
    }

    libraryUser.email_verified_at = new Date();

    return this.libraryUserRepository.update(libraryUser.id, libraryUser);
  }

  async userHasLibrary(userId: number, libraryId: number) {
    return await this.userRepository.findAndCountBy({ id: userId, libraries: { library: { id: libraryId } } });
  }

  createLibraryUser(userId: number, libraryid: number) {
    return this.libraryUserRepository.save({ library: { id: libraryid }, user: { id: userId } });
  }

  getLibraryUser(userId: number, libraryid: number) {
    return this.libraryUserRepository.findOneBy({ library: { id: libraryid }, user: { id: userId } });
  }

}
