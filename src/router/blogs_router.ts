

import { FetchAuthorBlogs, createNewBlogs, fetchAllBlogs, infoBlogs } from "../database/database";
import express from "express";
import { BlogsModel } from "../workers/model";


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
router.post("/create", async(req, res) => {
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
router.get("/author-blogs", async(req, res) => {
    try {
        const id = req.body.id;
        var blogs = await FetchAuthorBlogs(id);
        return res.status(blogs? 200 :500).json(blogs)
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message })
    }
});

// Blogs details
router.get("/blog/:id", async(req, res) => {
    try {
        const id = req.body.id;
        var blogs = await infoBlogs(id);
        return res.status(blogs? 200 :500).json(blogs)
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message })
    }
});

// // Comments
// router.get("/comments/:blog/:id", async(req, res) => {
//     try {
//         if (req.header('Authorization')) {
//             return res.status(500).json({ success: false, message: "User has an active session." })
//         }
//         const blogId = Number(req.params.id);
//         return res.status(500).json({ success: false, message: `Something went wrong. Please try again!` })
//     } catch (e) {
//         return res.status(500).json({ success: false, message: e.message })
//     }
// });

export const Blogs = router