import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute"


mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(()=> console.log("CONNECTED TO DB!!"));//casting 

const app = express();
app.use(express.json());
app.use(cors());


app.use("/api/my/user",myUserRoute);


app.listen(7000, () => {
    console.log("server runing on 7000");
});