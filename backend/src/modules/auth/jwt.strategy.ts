import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { ConfigService } from "@nestjs/config"
import { User } from "@/entities/user.entity"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET"),
    })
  }

  async validate(payload: any) {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      relations: ["role", "school"],
    })

    if (!user) {
      throw new UnauthorizedException()
    }

    return user // This will be available in `@GetUser()` decorator
  }
}
