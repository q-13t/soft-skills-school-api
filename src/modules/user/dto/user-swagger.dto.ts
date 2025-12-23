import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class GetAllUsersResponse extends UserDto {}

export class GetUserResponse extends UserDto {}

export class UpdateUserRequest extends PickType(UserDto, [
  'firstName',
] as const) {
  @ApiProperty({
    example: 'Tom',
    required: true,
  })
  firstName: string;
}

export class UpdateUserResponse extends UserDto {
  @ApiProperty({
    example: 'Tom',
    required: true,
  })
  firstName: string;
}

export class AddBelbinResultsRequest {
  @ApiProperty({
    example: 'coordinator',
    description: 'The role in the Belbin model.',
  })
  role: string;

  @ApiProperty({
    example: 15,
    description: 'The value assigned to the role.',
  })
  value: number;
}

export class AddBelbinResultsResponse extends UserDto {
  @ApiProperty({
    description: 'List of tests with results for the user.',
    type: [Object],
    example: [
      {
        testId: '677ffc10bc648d0df2743ff7',
        type: 'belbin',
        results: [
          {
            role: 'coordinator',
            value: 15,
          },
        ],
        created_at: '2025-01-14T17:38:51.893Z',
      },
    ],
  })
  tests: Record<string, any>[];
}
