import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose'
import 'dotenv/config';


import {userRouter} from "./routes/users.js";
import { recipesRouter } from "./routes/recipes.js";

const app=express();

app.use(express.json());
app.use(cors()); 

app.use("/auth",userRouter);
app.use("/recipes",recipesRouter);

// mongoose.connect("mongodb+srv://recipes:MernStack123@recipes.mr8bpob.mongodb.net/recipes?retryWrites=true&w=majority")
// app.listen(3001,()=>console.log("SERVER STARTED!"));

const PORT = process.env.PORT || 3001; // set server port

// Use environment variables for database connection
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri);

// Use environment variable for port
const port = process.env.PORT || 3000; // default to 3000 if PORT is not set
app.listen(port, () => console.log(`SERVER STARTED ON PORT ${port}!`));
