import express from "express";
import { conn } from "../dbconnect";
import mysql from 'mysql';
import { ImageGetResponse } from '../model/trip-get-res';


//router 
export const router = express.Router();

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

//add
router.post("/", (req, res) => {
    let img_id = req.body.id;
    let sql ="INSERT INTO `vote`(`img_id`) VALUES (?)";
    sql = mysql.format(sql, [
      img_id,
    ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows, last_idx: result.insertId });
    });


  });