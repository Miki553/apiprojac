import express from "express";
import { conn } from "../dbconnect";
import mysql from 'mysql';
import { ImageGetResponse } from '../model/trip-get-res';


//router 
export const router = express.Router();


router.get("/",(req,res)=>{
    const sql = "select * from statistics"
    conn.query(sql,(err,result)=>{
        if(err){
            res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
});

router.get("/:id",(req,res)=>{
    let id = req.params.id;
    const sql = `SELECT *,day(dateTime) AS day
    FROM statistics
    WHERE image_id = ?
    ORDER BY dateTime DESC
    LIMIT 1;
    `;
    conn.query(sql,[id],(err,result)=>{
        if(err){
            res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
});

//add
router.post("/", (req, res) => {
    let img = req.body;
    let sql ="INSERT INTO `statistics`(`image_id`, `score`, `rank`, `dateTime`) VALUES (?,?,?, DATE_SUB(NOW(), INTERVAL 10 MINUTE))";
    sql = mysql.format(sql, [
      img.img_id,
      img.score,
      img.rank,
    ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows, last_idx: result.insertId });
    });
});

//add 2
router.post("/add", (req, res) => {
    let img = req.body;
    let sql ="INSERT INTO `statistics`(`image_id`, `score`, `rank`) VALUES (?,?,?)";
    sql = mysql.format(sql, [
      img.img_id,
      img.score,
      img.rank,
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
    const sql = "DELETE FROM `statistics` WHERE  image_id = "+id;
    conn.query(sql,(err,result)=>{
        if(err){
            res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
});


//update
router.put("/", (req, res) => {
    let img = req.body;
    let sql ="UPDATE `statistics` SET `score`= ? ,`dateTime`= NOW() ,`rank`= ?  WHERE statistics_ID = ? ";
    sql = mysql.format(sql, [
      img.score,
      900,
      img.statistics_ID,
    ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows, last_idx: result.insertId });
    });
});

//update score
router.put("/score", (req, res) => {
    let img = req.body;
    let sql ="UPDATE `statistics` SET `score`= ?  ,`rank`= ? WHERE statistics_ID = ? ";
    sql = mysql.format(sql, [
      img.score,
      900,
      img.statistics_ID,
    ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows, last_idx: result.insertId });
    });
});


//update rank
//CURRENT_DATE
//DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY)
router.put("/updaterank", (req, res) => {
    // let sql = `
    // UPDATE statistics AS s
    // JOIN (
    //     SELECT
    //         s1.statistics_ID,
    //         RANK() OVER (ORDER BY s1.score DESC, s1.statistics_ID ASC) AS new_rank
    //     FROM
    //         statistics s1
    //     WHERE DATE(s1.dateTime) = CURRENT_DATE
    // ) AS ranked_stats ON s.statistics_ID = ranked_stats.statistics_ID
    // SET
    //     s.rank = ranked_stats.new_rank;
    // `;

    let sql = `
    UPDATE statistics AS s
JOIN (
    SELECT
        s1.statistics_ID,
        RANK() OVER (ORDER BY s1.score DESC, s1.statistics_ID ASC) AS new_rank
    FROM
        statistics s1
    WHERE DATE(s1.dateTime) = CURRENT_DATE
) AS ranked_stats ON s.statistics_ID = ranked_stats.statistics_ID
SET
    s.rank = CASE
        WHEN s.rank = 999 THEN 999
        ELSE ranked_stats.new_rank
    END;
    `;
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows });
    });
});


router.put("/updaterank2", (req, res) => {
    let sql = `
    UPDATE statistics AS s
JOIN (
    SELECT
        s1.statistics_ID,
        RANK() OVER (ORDER BY s1.score DESC, s1.statistics_ID ASC) AS new_rank
    FROM
        statistics s1
    WHERE DATE(s1.dateTime) = DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY)
) AS ranked_stats ON s.statistics_ID = ranked_stats.statistics_ID
SET
    s.rank = CASE
        WHEN s.rank = 999 THEN 999
        ELSE ranked_stats.new_rank
    END;
    `;
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows });
    });
});

//get chat
router.get("/chat/:id",(req,res)=>{
    let id = req.params.id;
    const sql = `
    SELECT *,day(dateTime) AS day
    FROM statistics
    WHERE image_id = ?
    ORDER BY dateTime DESC 
    `;
    conn.query(sql,[id],(err,result)=>{
        if(err){
            res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
});
























