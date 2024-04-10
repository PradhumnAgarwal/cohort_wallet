const express = require("express");
const zod = require("zod");
const { User } = require("../db");
const JWT_SECRET = require("../config,js");
const jwt= require("jsonwebtoken");
const  { authMiddleware } = require("../middleware");

const router = express.Router();

const signupSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
    firstname: zod.string(),
    lastname: zod.string(),
})

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.post("/signup", async(req, res)=>{
    const body = req.body;
    const {success} =  signupSchema.safeParse(body);
    
    if (!success) return res.status(400).json({message:"Email Already Taken/Invalid Inputs"});

    const user = User.findOne({
        username: body.username
    })
    if(user._id){
        return res.status(400).json({message:"Email Already Taken/Invalid Inputs"});
    }
    const dbUser = await User.create(body);
    const userId = dbUser._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

		/// -----  --

    const token = jwt.sign({
        userId,
        token: token
    }, JWT_SECRET)
    res.json({
        message: "User created successfully",
        token: token
    })

})


router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Invalid Input Parameters"
        })
    }

		await User.updateOne({ _id: req.userId }, req.body);
	
    res.json({
        message: "Updated successfully"
    })
})


router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})


module.exports = router;