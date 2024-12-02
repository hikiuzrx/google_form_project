import express,{ Router } from "express";
import authValidator from '../middlewares/authValidation'
import { recentForms } from "../controllers/formsControllers";
const frouter:Router= express.Router()
frouter.get('/recent-forms',authValidator,recentForms)
 export default frouter 