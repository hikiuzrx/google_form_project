import { db } from "../utils/db.server";
import { Type,RM } from "@prisma/client";
type User ={
     firstName :string,
     LastName :string,
     UserName :string,
     email :string,
     method:RM,
     password: string,
}
type Forms ={
     formId? :number
     title:string,
     ownerId:number,
     typRid :number,

}
type Question ={
     fomrId:number,
     number:number,
     text :string,
     correctAnswer :string[],
     options:string[],
     type:Type

}
type Essai ={
     rfor:number,
     ownerId:number
     content :Answer[]
}
type Answer ={
     responseId: number,
     number:number,
     content:string[]
}

function getUsers() :Array<User>{
     return[
          {
               firstName :'Ramzi',
               LastName :'Gueracha',
               email:'ramziwassim2004@gmail.com',
               password:'ramziwassim2',
               method:RM.Local,
               UserName:'Hiki'
          },
          {
               firstName:'hikaro',
               LastName:'subahiko',
               UserName:'Mjustice',
               email:'zch92142@gmail.com',
               method:RM.Local,
               password:'hikaro_subahiko*'
          }
     ]
}
async function seed(){
     getUsers().map(async user =>{
          const u=  await db.user.create({
               data:{
                    firstName:user.firstName,
                    lastName:user.LastName,
                    email:user.email,
                    userName:user.UserName,
                    password:user.password
               }
          })
          return u
     })
}
seed().then(()=>console.log('done'))