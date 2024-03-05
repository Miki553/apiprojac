import express from "express";
import { conn } from "../dbconnect";
import mysql from 'mysql';
import { ImageGetResponse } from '../model/trip-get-res'; 


//router 
export const router = express.Router();

router.get("/",(req,res)=>{
    const sql = "SELECT * FROM image ";
    conn.query(sql,(err,result)=>{
        if(err){
            res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
});

router.get("/:id",(req,res)=>{
    const id = req.params.id;
    const sql = "SELECT * FROM image WHERE Uid = "+id;

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
    let image: ImageGetResponse = req.body;
    let sql ="INSERT INTO `image`(`Uid`, `title`, `image`, `img_name`) VALUES (?,?,?,?)";
    sql = mysql.format(sql, [
        image.Uid,
        image.title,
        image.image, 
        image.img_name,
    ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows, last_idx: result.insertId });
    });
});



//delete
router.delete("/:id",(req,res)=>{
    const id = req.params.id;
    const sql = "DELETE FROM `image` WHERE  image_id = "+id;

    conn.query(sql,(err,result)=>{
        if(err){
            res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
});
















