import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt' ;
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private prismaService : PrismaService,
        private jwtService : JwtService,
    ){}

    async singnup(dto : AuthDto): Promise<Tokens>{
        const hash = await this.hashData(dto.password);

        const newUser = await this.prismaService.user.create({
            data :{
                email : dto.email,
                hash
            },
        });

        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRtHash(newUser.id, tokens.refresh_token);
        return tokens;
    }

    async signinLocal(dto : AuthDto): Promise<Tokens>{
        const user = await this.prismaService.user.findUnique({
            where: {
                email : dto.email,
            }
        });

        if(!user) throw new ForbiddenException("Acces Denied");

        const passwordMatces = await bcrypt.compare(dto.password,user.hash)
        if(!passwordMatces) throw new ForbiddenException("Acces Denied");

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refresh_token);
        return tokens;
    }

    logout(){

    }

    refreshToken(){
    }

    async updateRtHash(userID : number,rt:string){
        const hash = await this.hashData(rt)
        await this.prismaService.user.update({
                where :{
                    id: userID,
                },
                data :{
                    hashedRt : hash,
                },
        });
    }

    hashData(data : string){
        return bcrypt.hash(data,10);
    }

    async getTokens(userId: number, email : string): Promise<Tokens>{
        const [at,rt]= await Promise.all([
            this.jwtService.signAsync(
                {
                    sub : userId,
                    email
                },
                {
                    secret :'at-secret',
                    expiresIn : 3600
                }
            ),
            this.jwtService.signAsync(
                {
                    sub : userId,
                    email
                },
                {
                    secret :'rt-secret',
                    expiresIn : 3600
                }
            )
        ])
        return {
            access_token :at,
            refresh_token :rt
        }
    }
}
