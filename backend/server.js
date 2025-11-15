import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import 'dotenv/config'
import { connectDB } from "./config/db.js"
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

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err)); 

//port listening
app.listen(port,()=>{
    console.log(`successfully running in the port http://localhost:${4000}`)
})