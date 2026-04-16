import "dotenv/config"
import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import inscriptionRoutes from "./routes/inscriptionRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import { errorHandler } from "./middleware/errorHandler.js"

const app = express()
const PORT = process.env.PORT || 6000
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/inscriptions"

if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET is not set in environment variables")
  process.exit(1)
}

app.use(cors({ origin: "*", credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", authRoutes)
app.use("/api/inscriptions", inscriptionRoutes)

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

app.use(errorHandler)

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`MongoDB connected: ${MONGO_URI}`)
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message)
    process.exit(1)
  })
