import { Request } from "express"
type customRequest = Request & {
     userId?:number | string
     refreshToken? :string
     accessToken? :string
}
interface PasswordStrengthConditions {
     hasLower: boolean;
     hasUpper: boolean;
     hasDigit: boolean;
     hasSpecial: boolean;
     minimumLength: boolean;
}
class userError extends Error{
     
     constructor(name:string,message:string){
          super(message)
          this.name = name
     }
}
   
   