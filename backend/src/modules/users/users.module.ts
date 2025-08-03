import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UsersController } from "./users.controller"
import { UsersService } from "./users.service"
import { User } from "@/entities/user.entity"
import { Role } from "@/entities/role.entity"
import { School } from "@/entities/school.entity"
import { Class } from "@/entities/class.entity"
import { JwtMiddleware } from "@/middleware/jwt.middleware"
import { JwtModule } from '@nestjs/jwt'
import { jwtConfig } from '@/middleware/jwt.config'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, School, Class]),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: jwtConfig.signOptions,
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtMiddleware],
  exports: [UsersService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        {
          path: 'users/create-new-user',
          method: RequestMethod.POST,
        },
      )
      .forRoutes(UsersController)
  }
}
