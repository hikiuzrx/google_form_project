const bcrypt = require('bcrypt')
const test = async () =>{
     const salt = await bcrypt.genSalt()
     const hashedp = await bcrypt.hash(p,salt)
     const result = await bcrypt.compare(p,hashedp)
     console.log(result)
}
test('SECRET')