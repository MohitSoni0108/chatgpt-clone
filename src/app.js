import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import errorHandler from "./middleware/error.middleware.js";
import chatRouter from "./routes/chat.routes.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5500",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/v1/chats", chatRouter);

app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Backend Running Successfully 🚀"
    });

});

export default app;

app.use(errorHandler);