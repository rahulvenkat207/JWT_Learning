import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class AtStrategy  extends PassportStrategy(Strategy){
   constructor(){
    super({
        jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey:'at-secret',
    });
   }

   validate(payload : any){
    return payload

    //req.user =payload
   }
}