const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        
        if (!(email && password && first_name && last_name)) {
            res.status(400).send("All input is required");
        }
 
        const oldUser = await User.findOne({ email });
    
        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }
    
        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);
    
        // Create user in our database
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword,
        });
        
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
            expiresIn: "2h",
            }
        );
        user.token = token;
    
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password, keepAlive } = req.body;

        if (!(email && password)) {
            res.status(400).send("All input is required");
        } else {
            const user = await User.findOne({ email });

            if (user && (await bcrypt.compare(password, user.password))) {
                // Create token
                let token;
                if (keepAlive == true) {
                    token = jwt.sign(
                        { user_id: user._id, email },
                        process.env.TOKEN_KEY
                    );
                    
                } else {
                    token = jwt.sign(
                        { user_id: user._id, email },
                        process.env.TOKEN_KEY,
                        {
                            expiresIn: "2h",
                        }
                    );
                }
                // save user token
                user.token = token;

                res.status(200).json(user);
            } else {
                res.status(400).send("Invalid Credentials");
            }
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;