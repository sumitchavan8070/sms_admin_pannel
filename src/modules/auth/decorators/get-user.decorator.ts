import { createParamDecorator, type ExecutionContext } from "@nestjs/common"
import type { User } from "../../../entities/user.entity"

export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext): User => {
  const request = ctx.switchToHttp().getRequest()
  return request.user
})
