import express,{Express} from 'express'
import { configDotenv } from 'dotenv'
import cookieParser from 'cookie-parser'
import authR from './routes/auth'
import cors from 'cors'
import frouter from './routes/forms'

configDotenv()
const api : Express = express()

api.use(cors())
api.listen(process.env.PORT,()=> {
     console.log("it's working")    
})
api.use('/forms',frouter)
api.use(express.json())
api.use(cookieParser())
api.use('/auth',authR)

