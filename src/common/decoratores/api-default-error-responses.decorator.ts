import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ApiDefaultErrorResponses() {
  return applyDecorators(
    ApiResponse({
      status: 400,
      description: 'Bad Request',
      schema: {
        example: { statusCode: 400, message: 'Bad Request Message.' },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
      schema: {
        example: { statusCode: 401, message: 'Unauthorized' },
      },
    }),
    ApiResponse({
      status: 500,
      description: 'Internal Server Error',
      schema: {
        example: { statusCode: 500, message: 'Internal server error' },
      },
    }),
  );
}
