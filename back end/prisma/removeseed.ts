import { db } from "../utils/db.server";
db.user.deleteMany({
     where:{
          email:'ramziwassim2004@gmail.com',
     }
}).then(()=>console.log('done 1'))
db.user.delete({
     where:{
          email:'zch92142@gmail.com',
     }
}).then(()=>console.log('done 2'))