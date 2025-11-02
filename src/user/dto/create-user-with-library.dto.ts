import { CreateUserDto } from './create-user.dto';
import { CreateLibraryDto } from 'src/library/dto/create-library.dto';
export class CreateUserWithLibraryDto {
  user: CreateUserDto;

  library: CreateLibraryDto;
}
