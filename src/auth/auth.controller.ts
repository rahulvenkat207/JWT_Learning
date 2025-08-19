import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';


@Controller('auth')
export class AuthController {

    constructor(private authservice : AuthService){}

    @Post('local/signup')
    singnup(@Body() dto:AuthDto): Promise<Tokens>{
       return this.authservice.singnup(dto);
    }

    @Post('local/signin')
    signinLocal(){
        this.authservice.signinLocal();
    }

    @Post('/logout')
    logout(){
        this.authservice.logout();
    }

    @Post('/refresh')
    refreshToken(){
        this.authservice.refreshToken()
    }
}
