import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();

import foodRoutes from "./routes/foodRoutes.js"
import userRouter from "./routes/userRoutes.js"
import cartRouter from "./routes/cartRoutes.js"
import orderRouter from "./routes/orderRoutes.js"

const app = express()
const port = 4000

app.use(express.json())
app.use(cors({
    origin: ["https://food-delivery-home.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.get("/",(req,res)=>{
    res.send("hello world")
})

app.use("/api/food",foodRoutes)
app.use("/images",express.static('upload'))
app.use("/api/data",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err)); 

app.listen(port,()=>{
    console.log(`successfully running on port ${port}`)
})