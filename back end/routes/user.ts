import { db } from "../utils/db.server";
import express,{ Router } from "express";
const userR:Router = express.Router()
userR.get('/email')