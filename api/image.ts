import express from "express";
import { conn } from "../dbconnect";
import mysql from 'mysql';
import { ImageGetResponse } from '../model/trip-get-res'; 


//router 
export const router = express.Router();

//get all
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

//get top10
router.get("/top10",(req,res)=>{

    // const sql = `
    // SELECT i.*, s.rank, s.score AS scstt
    // FROM image i
    // INNER JOIN (
    //     SELECT s1.*
    //     FROM statistics s1
    //     INNER JOIN (
    //         SELECT image_id, MAX(statistics_ID) AS latest_statistics_ID
    //         FROM statistics
    //         GROUP BY image_id
    //     ) AS latest_stats ON s1.image_id = latest_stats.image_id AND s1.statistics_ID = latest_stats.latest_statistics_ID
    //     ORDER BY s1.score DESC
    //     LIMIT 10
    // ) AS s ON i.image_id = s.image_id
    // ORDER BY s.rank ASC;
    // `;

    const sql = `

    SELECT i.*, s.rank, s.score AS scstt
FROM image i
INNER JOIN (
    SELECT s1.*
    FROM statistics s1
    INNER JOIN (
        SELECT image_id, MAX(statistics_ID) AS latest_statistics_ID
        FROM statistics
        GROUP BY image_id
    ) AS latest_stats ON s1.image_id = latest_stats.image_id AND s1.statistics_ID = latest_stats.latest_statistics_ID
    WHERE s1.rank <> 999 
    ORDER BY s1.score DESC
    LIMIT 10
) AS s ON i.image_id = s.image_id
ORDER BY s.rank ASC;
    
    `;

    conn.query(sql,(err,result)=>{
        if(err){
            res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
});



//get random
router.get("/random",(req,res)=>{

const sql = `
SELECT image.*
FROM image
JOIN (
    SELECT s.image_id
    FROM statistics s
    JOIN (
        SELECT image_id, MAX(statistics_ID) AS latest_statistics_ID
        FROM statistics
        GROUP BY image_id
    ) AS latest_stats ON s.image_id = latest_stats.image_id AND s.statistics_ID = latest_stats.latest_statistics_ID
    WHERE
        (DATE(s.dateTime) != CURDATE() OR
        (DATE(s.dateTime) = CURDATE() AND TIME(s.dateTime) <= NOW() - INTERVAL 10 MINUTE))
    GROUP BY s.image_id
) AS filtered_stats ON image.image_id = filtered_stats.image_id
LIMIT 2;


`;



    
    conn.query(sql,(err,result)=>{
        if(err){
            res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
});


//get by id
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

//delete by id
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

//update
router.put("/:id",(req,res)=>{
    let id = req.params.id;
    let sql = "UPDATE image  SET score = ? WHERE image_id = ?";
    let score = req.body.score;
    sql = mysql.format(sql, [
        score,
        id,
    ]);
    conn.query(sql,(err,result)=>{
        if(err){
            res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
});

//update img
router.put("/img/:id",(req,res)=>{
    let id = req.params.id;
    let sql = "UPDATE `image` SET `title`= ? ,`image`= ? ,`img_name`= ? WHERE image_id = ?";
    let body = req.body;
    sql = mysql.format(sql, [
        body.title,
        body.image,
        body.img_name,
        id,
    ]);
    conn.query(sql,(err,result)=>{
        if(err){
            res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
});

//update title
router.put("/title/:id",(req,res)=>{
    let id = req.params.id;
    let sql = "UPDATE `image` SET `title`= ?  WHERE image_id = ?";
    let body = req.body;
    sql = mysql.format(sql, [
        body.title,
        id,
    ]);
    conn.query(sql,(err,result)=>{
        if(err){
            res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
});






// ตาราง statistics ประกอบด้วย
// statistics_ID
// image_id
// score
// rank
// dateTime


// ตาราง image ประกอบด้วย
// image_id
// Uid
// title
// image
// img_name
// score







