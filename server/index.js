import "dotenv/config"
import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import mongoose from "mongoose"
import path from "path"
import { fileURLToPath } from "url"
import inscriptionRoutes from "./routes/inscriptionRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import { errorHandler } from "./middleware/errorHandler.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 6000
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/inscriptions"

if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET is not set in environment variables")
  process.exit(1)
}

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }))

const allowedOrigin = process.env.ALLOWED_ORIGIN || "*"
app.use(cors({ origin: allowedOrigin, credentials: true }))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Rate limit auth endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
})

app.use("/api/auth", authLimiter, authRoutes)
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
