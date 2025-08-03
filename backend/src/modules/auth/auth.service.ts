// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import * as bcrypt from "bcrypt"

import { JwtService } from "@nestjs/jwt"
import { User } from "@/entities/user.entity"
import { Role } from "@/entities/role.entity"
import { School } from "@/entities/school.entity"
import { LoginDto } from "./dto/login.dto"
import { jwtConfig } from "@/middleware/jwt.config"
// import { getPool } from '../../../../db';



@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(School) private schoolRepository: Repository<School>,
    private jwtService: JwtService,
  ) { }




  //  async loginV1(dto: LoginDto): Promise<any> {
  //     const { email, password } = dto;

  //     if (!email || !password) {
  //       return {
  //         status: 0,
  //         message: 'Email and password are required.',
  //       };
  //     }

  //   const pool = getPool(); // ✅ Fix: get the pool instance
  //   let connection;

  //     try {
  //     connection = await pool.getConnection(); // ✅ Now pool is defined

  //       const [rows]: any = await connection.execute(
  //         `
  //         SELECT 
  //           users.id AS user_id,
  //           users.firstName,
  //           users.lastName,
  //           users.email,
  //           users.password,
  //           roles.id AS role_id,
  //           roles.name AS role_name,
  //           schools.id AS school_id,
  //           schools.name AS school_name
  //         FROM users
  //         LEFT JOIN roles ON users.roleId = roles.id
  //         LEFT JOIN schools ON users.schoolId = schools.id
  //         WHERE users.email = ?
  //         LIMIT 1;
  //         `,
  //         [email],
  //       );

  //       const user = rows[0];

  //       if (!user || !(await bcrypt.compare(password, user.password))) {
  //         throw new UnauthorizedException('Invalid email or password.');
  //       }

  //       const payload = {
  //         sub: user.user_id,
  //         email: user.email,
  //         role: user.role_name,
  //       };

  //       const access_token = this.jwtService.sign(payload);

  //       return {
  //         status: 1,
  //         message: 'Login successful.',
  //         access_token,
  //         user: {
  //           id: user.user_id,
  //           firstName: user.firstName,
  //           lastName: user.lastName,
  //           email: user.email,
  //           role: {
  //             id: user.role_id,
  //             name: user.role_name,
  //           },
  //           school: {
  //             id: user.school_id,
  //             name: user.school_name,
  //           },
  //         },
  //       };
  //     } catch (err) {
  //       console.error('Login Error:', err);
  //       return {
  //         status: 0,
  //         message: 'Login failed due to server error.',
  //       };
  //     } finally {
  //       if (connection) connection.release();
  //     }
  //   }

  async generateStringToPass(password: string) {
    const hashedPassword = await bcrypt.hash(password, 10)
    return {
      status: 1,
      hashedPassword

    };

  }


  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
      relations: ["role", "school"],
    });

    console.log("passwords ", password, user.password);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException("Invalid credentials");

    }

    const payload = { sub: user.id, email: user.email, role: user.role.name , schoolId: user.schoolId, roleId: user.roleId };

    // Sign the payload to generate the access token.
    // const access_token = this.jwtService.sign(payload);
    const access_token = this.jwtService.sign(payload, {
      secret: jwtConfig.secret,
      expiresIn: jwtConfig.signOptions.expiresIn,
    });

    // Return the access token and a subset of the user's information.
    return {
      status: 1,
      access_token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        school: user.school,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["role", "school", "class"],
    })

    if (!user) {
      throw new UnauthorizedException("User not found")
    }

    return user
  }

  async getRoles() {
    return this.roleRepository.find({ where: { isActive: true } })
  }

  async getSchools() {
    return this.schoolRepository.find({ where: { isActive: true } })
  }
}
