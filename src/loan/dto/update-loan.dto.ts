import { CreateLoanDto } from './create-loan.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateLoanDto extends PartialType(CreateLoanDto) {
  @ApiProperty({ example: 1, description: 'Loan id.' })
  id: number;
}
