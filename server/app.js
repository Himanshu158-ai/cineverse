const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const app = express();
const connectDB = require("./config/dataconnection");
const AuthRoutes = require("./routes/AuthRoutes");
const moviesRoutes = require("./routes/movies.routes"); 
const watchlistRoutes = require("./routes/watchlist.routes");
const cors = require("cors");

//CORS
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

//CONNECT TO DATABASE
connectDB();
app.use(express.json());
app.use(cookieParser());

//ROUTES
app.use("/api/user", AuthRoutes)
app.use("/api/movies", moviesRoutes)
app.use("/api/watchlist", watchlistRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});