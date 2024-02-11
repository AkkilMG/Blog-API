

import { loginAuthor, registerAuthor } from "../database/database";
import express from "express";


const router = express.Router();

// register
router.post("/signup", async(req, res) => {
    try {
        if (req.header('Authorization')) {
            return res.status(500).json({ success: false, message: "User has an active session." })
        }
        var register = await registerAuthor(req.body);
        return res.status(register.success ? 200 : 500).json(register)
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message })
    }
});

// authentication
router.post("/signin", async(req, res) => {
    try {
        if (req.header('Authorization')) {
            return res.status(500).json({ success: false, message: "User has an active session." })
        }
        var login = await loginAuthor(req.body.email, req.body.password);
        return res.status(login.success ? 200 : 500).json(login)
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message })
    }
});

// 
// router.post("/", async(req, res) => {
//     try {
//         if (req.header('Authorization')) {
//             return res.status(500).json({ success: false, message: "User has an active session." })
//         }
//         return res.status(500).json({ success: false, message: `Something went wrong. Please try again!` })
//     } catch (e) {
//         return res.status(500).json({ success: false, message: e.message })
//     }
// });


export const Author = router