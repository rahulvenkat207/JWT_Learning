import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';


@Controller('auth')
export class AuthController {

    constructor(private authservice : AuthService){}

    @Post('local/signup')
    @HttpCode(HttpStatus.CREATED)
    singnup(@Body() dto:AuthDto): Promise<Tokens>{
       return this.authservice.singnup(dto);
    }

    @Post('local/signin')
    @HttpCode(HttpStatus.OK)
    signinLocal(@Body() dto : AuthDto){
        return this.authservice.signinLocal(dto);
    }

    @Post('/logout')
    logout(){
        // this.authservice.logout();
    }

    @Post('/refresh')
    refreshToken(){
        this.authservice.refreshToken()
    }
}
