import express from "express";
import { conn } from "../dbconnect";
import mysql from 'mysql';
import { TripGetResponse } from '../model/trip-get-res'; 


//router 
export const router = express.Router();


router.get("/",(req,res)=>{
    const sql = "select * from users"
    conn.query(sql,(err,result)=>{
        if(err){
            res.status(400).json(err);
        }else{
            res.json(result);
        }
    });
});

router.get("/:email",(req,res)=>{
    const email = req.params.email;
    const sql = "select * from users where email = ?";
    conn.query(sql, [email],(err,result)=>{
        if(err){
            res.status(400).json(err);
        }else{
            res.json(result);

        }
    });
});



// add
router.post("/", (req, res) => {
    let user: TripGetResponse = req.body;
    let sql ="INSERT INTO `users`(`username`, `email`, `password`, `avatar`, `avatar_name`) "
    +"VALUES (?,?,?,?,?)";
    sql = mysql.format(sql, [
      
      user.username,
      user.email,
      user.password,
      user.avatar,
      user.avatar_name,

      
      
    ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows, last_idx: result.insertId });
    });
  });




















router.post("/",(req,res)=>{
    const body = req.body;
    // res.send("Method Post in trip.ts : " + body);
    res.status(201);
    res.json({
        text : "Method Post in trip.ts : " + JSON.stringify(body)
    });
});














// router.get("/",(req,res)=>{
//     if(req.query.id){
//         const id = req.query.id;
//         const name = req.query.name;
//         res.send( `Method GET Query in trip.ts With ID : ${id} ${name}`);
        
//     }else{
//         // res.send("Method GET in trip.ts");
//         const sql = "select * from trip"
//         conn.query(sql,(err,result)=>{
//             if(err){
//                 res.status(400).json(err);
//             }else{
//                 res.json(result);
//             }
//         });
//     }
    
// });

router.get("/:id",(req,res)=>{
    const id = req.params.id;
    // res.send("Method GET Params in trip.ts With ID : " + id);

    // const sql = "select * from trip where idx =" + id;


    const sql = "select * from trip where idx = ?";
    conn.query(sql, [id],(err,result)=>{
        if(err){
            res.status(400).json(err);
        }else{
            res.json(result);

        }
    });


});




router.get("/search/fields",(req,res)=>{
    const id = req.query.id;
    const name = req.query.name;

    let sql = "Select * from trip where"+
    "(idx is null or idx = ?) or (name is null or name like ?)"


    // if(id){
    //     sql = "Select * from trip where idx = ?";
    // }else if(name){
    //     sql = "Select * from trip where name = ?";
    // }

    conn.query(sql, [id,"%" + name + "%"],(err,result)=>{
        if(err){
            res.status(400).json(err);
        }else{
            res.json(result);

        }
    });
});

router.get("/price:price",(req,res)=>{
    const price = req.params.price;

    const  sql = "select * from trip where price <= ?";
    conn.query(sql,[price] ,(err,result)=>{
        if(err){
            res.status(400).json(err);
        }else{
            res.json(result);

        }
    })
    
});

