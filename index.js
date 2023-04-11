const express = require("express");
const cors = require("cors");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/userRoutes");

const app = express();

app.use(express.json());

app.use(cors());

app.use("/users",userRouter);


app.listen(process.env.port, async () => {
    try {
        await connection;
    }
    catch (err) {
        console.log(err);
    }
    console.log(`Server in running on ${process.env.port}`);
})