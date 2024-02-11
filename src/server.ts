// 

import express from 'express';
import fs from 'fs';
import https from 'https';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongo from 'mongoose';
import { Author } from "./router/authors_router";
import { Blogs } from "./router/blogs_router";
require('dotenv').config();


const app = express();

mongo.Promise = Promise;
mongo.connect(process.env.MONGODB)
const db = mongo.connection
db.on('error', (error: Error) => console.log("Check your mongodb please. There is an issue with mongodb."))
db.on('open', () => console.log("Mongodb is connected."))
app.use(express.json())

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${new Date().toString()}: ${req.method}=> ${req.originalUrl}`);
    next();
});

app.set('trust proxy', true);
app.use(bodyParser.json());

var server = http.createServer(app);

app.get("/", async(req, res) => {
    res.status(200).json({success: true})
    return
})

// User Interface API routes
app.use("/api/author", Author)

// Admin Interface API routes
app.use("/api/blogs", Blogs)

server.listen(7000, () => console.log(`Server running at http://localhost:7000`));