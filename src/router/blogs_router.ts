

import express from "express";


const router = express.Router();

// 
router.post("/", async(req, res) => {
    try {
        if (req.header('Authorization')) {
            return res.status(500).json({ success: false, message: "User has an active session." })
        }
        return res.status(500).json({ success: false, message: `Something went wrong. Please try again!` })
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message })
    }
});

export const Blogs = router