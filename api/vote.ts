import express from "express";
import { conn } from "../dbconnect";
import mysql from 'mysql';
import { ImageGetResponse } from '../model/trip-get-res';


//router 
export const router = express.Router();



// router.get("/",(req,res)=>{
//     res.send("Method GET in vote.ts");
// });

router.get("/",(req,res)=>{
    const sql = "select * from vote"
    conn.query(sql,(err,result)=>{
        if(err){
            res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
});

