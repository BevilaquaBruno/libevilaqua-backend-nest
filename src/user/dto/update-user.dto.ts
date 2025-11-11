import { CreateUserDto } from './create-user.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: true, examples: [true, false], description: 'Should update password or not.' })
  update_password: boolean;

  @ApiProperty({ example: '123456', description: 'User current password.' })
  current_password: string;

  @ApiProperty({ example: 1, description: 'User id.' })
  id: number;
}
