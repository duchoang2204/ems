# Template Module Chuẩn DDD

## Cấu trúc thư mục

```
src/modules/[module-name]/
├── controllers/
│   ├── [module].controller.ts
│   └── [module].validator.ts
├── data-access/
│   └── oracle/
│       └── [module].repository.ts
├── di/
│   └── tokens.ts
├── domain/
│   ├── entities/
│   │   └── [entity].entity.ts
│   └── repositories/
│       └── [module].repository.interface.ts
├── services/
│   ├── implementations/
│   │   └── [module].service.ts
│   └── interfaces/
│       └── [module].service.interface.ts
├── usecases/
│   └── [usecase-name].usecase.ts
└── routes/
    └── [module].routes.ts
```

## Template Files

### 1. Entity (domain/entities/[entity].entity.ts)
```typescript
export class UserEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    // ... các thuộc tính khác
  ) {}

  // Domain logic methods
  public validatePassword(password: string): boolean {
    // ... logic validation
  }
}
```

### 2. Repository Interface (domain/repositories/[module].repository.interface.ts)
```typescript
import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
  findById(id: number): Promise<UserEntity>;
  save(user: UserEntity): Promise<void>;
  // ... các methods khác
}
```

### 3. Repository Implementation (data-access/oracle/[module].repository.ts)
```typescript
import { injectable } from 'tsyringe';
import { IUserRepository } from '@modules/user/domain/repositories/user.repository.interface';
import { UserEntity } from '@modules/user/domain/entities/user.entity';

@injectable()
export class OracleUserRepository implements IUserRepository {
  async findById(id: number): Promise<UserEntity> {
    let conn;
    try {
      conn = await getOracleConnection();
      // ... Oracle implementation
    } catch (err: any) {
      throw new Error(`[OracleUserRepository] ${err.message}`);
    } finally {
      if (conn) await conn.close();
    }
  }
}
```

### 4. Service Interface (services/interfaces/[module].service.interface.ts)
```typescript
export interface IUserService {
  getUserProfile(id: number): Promise<UserProfileDto>;
  // ... các methods khác
}
```

### 5. Service Implementation (services/implementations/[module].service.ts)
```typescript
import { injectable, inject } from 'tsyringe';
import { IUserService } from '../interfaces/user.service.interface';
import { IUserRepository } from '@modules/user/domain/repositories/user.repository.interface';
import { USER_TOKENS } from '@modules/user/di/tokens';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(USER_TOKENS.USER_REPOSITORY)
    private readonly userRepository: IUserRepository
  ) {}

  async getUserProfile(id: number): Promise<UserProfileDto> {
    const user = await this.userRepository.findById(id);
    // ... business logic
    return userProfileDto;
  }
}
```

### 6. UseCase (usecases/[usecase-name].usecase.ts)
```typescript
import { injectable, inject } from 'tsyringe';
import { IUserService } from '../services/interfaces/user.service.interface';
import { USER_TOKENS } from '../di/tokens';

@injectable()
export class GetUserProfileUseCase {
  constructor(
    @inject(USER_TOKENS.USER_SERVICE)
    private readonly userService: IUserService
  ) {}

  async execute(userId: number) {
    return await this.userService.getUserProfile(userId);
  }
}
```

### 7. Controller (controllers/[module].controller.ts)
```typescript
import { Request, Response } from 'express';
import { GetUserProfileUseCase } from '../usecases/get-user-profile.usecase';

export class UserController {
  constructor(
    private readonly getUserProfileUseCase: GetUserProfileUseCase
  ) {}

  getUserProfile = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const result = await this.getUserProfileUseCase.execute(Number(userId));
    return res.json(result);
  };
}
```

### 8. Validator (controllers/[module].validator.ts)
```typescript
import { z } from 'zod';

export const getUserProfileSchema = z.object({
  params: z.object({
    userId: z.string().regex(/^\d+$/).transform(Number),
  }),
});
```

### 9. Routes (routes/[module].routes.ts)
```typescript
import { Router } from 'express';
import { container } from 'tsyringe';
import { USER_TOKENS } from '../di/tokens';
import { UserController } from '../controllers/user.controller';
import { GetUserProfileUseCase } from '../usecases/get-user-profile.usecase';
import { validateRequest } from '@core/middleware/validation.middleware';
import { getUserProfileSchema } from '../controllers/user.validator';

const router = Router();
const getUserProfileUseCase = container.resolve<GetUserProfileUseCase>(USER_TOKENS.GET_USER_PROFILE_USECASE);
const userController = new UserController(getUserProfileUseCase);

router.get(
  '/:userId/profile',
  validateRequest(getUserProfileSchema),
  userController.getUserProfile
);

export default router;
```

### 10. DI Tokens (di/tokens.ts)
```typescript
export const USER_TOKENS = {
  USER_REPOSITORY: Symbol.for('USER_REPOSITORY'),
  USER_SERVICE: Symbol.for('USER_SERVICE'),
  GET_USER_PROFILE_USECASE: Symbol.for('GET_USER_PROFILE_USECASE'),
} as const;
```

## Lưu ý quan trọng

1. Luôn sử dụng `@injectable()` cho các class được inject
2. Sử dụng `@inject()` cho các dependencies trong constructor
3. Đặt tên file theo chuẩn: lowercase với dấu gạch ngang
4. Import paths nên sử dụng alias (@modules/...)
5. Xử lý lỗi đầy đủ và log phù hợp
6. Validate input ở tầng controller
7. Business logic nên đặt ở service layer
8. Domain logic nên đặt trong entity
9. Repository chỉ xử lý data access 