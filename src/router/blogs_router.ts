

import { FetchAuthorBlogs, createNewBlogs, fetchAllBlogs, infoBlogs, searchBlogs } from "../database/database";
import express from "express";
import { BlogsModel } from "../workers/model";
import { verifyToken } from "../workers/auth";


const router = express.Router();

// Fetch all blogs
router.get("/blogs", async(req, res) => {
    try {
        var blogs = await fetchAllBlogs();
        return res.status(blogs? 200 :500).json(blogs)
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message })
    }
});

// Create new blog
router.post("/create", verifyToken, async(req, res) => {
    try {
        const id = req.body.id;
        const data: BlogsModel = req.body;
        data.author_id = id;
        var blogs = await createNewBlogs(data);
        return res.status(blogs? 200 :500).json(blogs)
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message })
    }
});

// Fetch certain author blogs
router.get("/author-blogs", verifyToken, async(req, res) => {
    try {
        const id = req.body.id;
        var blogs = await FetchAuthorBlogs(id);
        return res.status(blogs? 200 :500).json(blogs)
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message })
    }
});

// // Blogs details
// router.get("/blog/:id", async(req, res) => {
//     try {
//         const id = req.body.id;
//         var blogs = await infoBlogs(id);
//         return res.status(blogs? 200 :500).json(blogs)
//     } catch (e) {
//         return res.status(500).json({ success: false, message: e.message })
//     }
// });

// Info blogs
router.get("/info-blogs/:id", async(req, res) => {
    try {
        if (req.header('Authorization')) {
            return res.status(500).json({ success: false, message: "User has an active session." })
        }
        const blogId = req.params.id;
        return res.status(500).json(await infoBlogs(blogId))
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message })
    }
});


// search blogs
router.get("/search", async(req, res) => {
    try {
        if (req.header('Authorization')) {
            return res.status(500).json({ success: false, message: "User has an active session." })
        }
        return res.status(500).json(await searchBlogs(req.body.query))
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message })
    }
});

export const Blogs = router