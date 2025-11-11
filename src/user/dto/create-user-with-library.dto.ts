import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { CreateLibraryDto } from '../../library/dto/create-library.dto';
export class CreateUserWithLibraryDto {
  @ApiProperty({ example: 'create-user.dto.ts', description: 'User data.' })
  user: CreateUserDto;

  @ApiProperty({ example: 'create-ibrary.dto.ts', description: 'Library data.' })
  library: CreateLibraryDto;
}
