
import mongo, { Schema, Document } from "mongoose";

export interface BlogsModel extends Document {
    title: string;
    summary: string;
    author_id: [mongo.Types.ObjectId];
    category_id: Array<string>;
    keywords: Array<string>;
    images: string;
    date_published: Date;
    content: string;
}

export interface AuthorsModel extends Document {
    name: string;
    username: string;
    email: string;
    bio: string;
    sub: boolean;
    socialInfo: Array<object>;
    password: string;
    author: boolean;
}

export interface CommentModel extends Document {
    blog_id: string;
    user_id: string;
    comment: string;
    date_posted: Date;
}

export interface Response extends Document {
    success: boolean;
    message: string;
}