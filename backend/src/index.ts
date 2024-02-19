import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(()=> console.log("CONNECTED TO DB!!"));//casting 

const app = express();
app.use(express.json());
app.use(cors());



app.get("/test", async (req, res) => {
    res.json({ message: "hello!" });
});

app.listen(7000, () => {
    console.log("server runing on 7000");
});