import { login,signUp } from "../controllers/localAuthController";
import {Glogin} from '../controllers/googleAuthController'
import express, { Router } from "express";
import getRefreshToken  from '../controllers/refreshservice'

let authR: Router = express.Router()
authR.post('/local/register',signUp)
authR.post('/local/login',login)
authR.post('/google/login',Glogin)
authR.get('/get-refresh',getRefreshToken)
export default authR