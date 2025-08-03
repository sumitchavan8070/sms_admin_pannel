  import { Injectable, NestMiddleware } from '@nestjs/common';
  import { Request, Response, NextFunction } from 'express';
  import { JwtService } from '@nestjs/jwt';
  import { jwtConfig } from './jwt.config';

  @Injectable()
  export class JwtMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) {}

    use(req: Request, res: Response, next: NextFunction) {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ status: 0, message: 'Unauthorized: Token missing' });
      }

      const token = authHeader.split(' ')[1];

      try {
        const decoded = this.jwtService.verify(token, {
          secret: jwtConfig.secret,
        });

        req['user'] = decoded; 
        console.log('👤 Decoded user from middleware:',decoded);


        next();
      } catch (err) {
        return res.status(401).json({ status: 0, message: 'Unauthorized: Token invalid or expired' });
      }
    }
  }

  