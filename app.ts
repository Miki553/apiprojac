import express from "express";
import { router as index } from "./api/index";
import bodyParser from "body-parser";
import{router as user} from "./api/user";
import{router as upload} from "./api/upload";
import{router as image} from "./api/image";
import{router as vote} from "./api/vote";
import{router as statistics} from "./api/statistics";


export const app = express();
const cors = require('cors');

app.use(cors({origin:"*"}));
app.use(bodyParser.text());
app.use(bodyParser.json());

app.use("/",index);
app.use("/user",user);
app.use("/upload",upload);
app.use("/image",image);
app.use("/vote",vote);
app.use("/statistics",statistics);


app.use("/",(req,res) => {
    res.send("heollsd wwww");
});

