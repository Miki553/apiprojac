import express from "express";


//router 
export const router = express.Router();
router.get("/",(req,res)=>{
    res.send("Method GET in index.ts");
});



