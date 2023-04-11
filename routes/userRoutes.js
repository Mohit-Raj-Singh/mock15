const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { userModel } = require("../model/userModel");
require("dotenv").config();

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
    try {
        const payload = req.body;
        const user = await userModel.findOne({ email: payload.email });
        if (user) {
            return res.send({ "msg": "Please login, user already exist" })
        }
        else {
            const secure_pass = await bcrypt.hashSync(payload.password, 8);
            payload.password = secure_pass;
            const newUser = new userModel(payload);
            await newUser.save();
            return res.json({ "msg": "User Registered", user: newUser });
        }
    }
    catch (err) {
        res.send(err);
    }
});


userRouter.post("/login",async(req,res)=>{
    try {
        const payload = req.body;
        const user = await userModel.findOne({ email: payload.email });
        if (!user) return res.send({ "msg": "Please Signup first" });
        const correctPassword = await bcrypt.compareSync(
            payload.password,
            user.password
        );
        if (correctPassword) {
            const token = await jwt.sign(
                { email: user.email, userId: user._id },
                "mohit"
            );
            res.send({ "msg": "Login Successfully", "token": token })
        }
        else {
            res.send({ "msg": "Invaild Data" })
        }
    }
    catch (err) {
        res.send(err.message);
    }
})

module.exports = { userRouter };