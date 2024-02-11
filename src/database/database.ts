
import mongo from "mongoose";
import { createToken } from "../workers/auth";
import { passwordChecker } from "../workers/crypt";
import { AuthorsModel, BlogsModel } from "../workers/model";

const authorsDB = new mongo.Schema<AuthorsModel>({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    author: {
        type: Boolean,
        required: true
    },
    socialInfo: [{
        type: Object,
        _id: false
    }]
}, {
    collection: "authors"
})

export const authors = mongo.model('authors', authorsDB);


// register
export const registerAuthor = async (data: AuthorsModel) => {
    try {
        var checker = await passwordChecker(data.password)
        if (await authors.findOne({ 'email': data.email })) {
            return { success: false, message: "Email already exists" }
        } else if (await authors.findOne({ 'username': data.username })) {
            return { success: false, message: "Username already exists" }
        } else if (!(await authors.findOne({ 'email': data.email })) || data.email.includes('@')) {
            return { success: false, message: "Email does not exist" }
        } else if (!checker.success) {
            return checker
        } else if (!(data.bio.length <= 250)) {
            return { success: false, message: "Bio should be at most 250 characters long" }
        }
        const author = new authors(data);
        const info = await author.save();
        if (!info) {
            return { success: true, id: info._id }
        }
        return { success: false }
    } catch (e) {
        console.log(e);
        return { success: false }
    }
}

// authentication
export const loginAuthor = async (email: string, password: string) => {
    try {
        if (await authors.findOne({ 'email': email, 'password': password })) {
            return { success: true, token: await createToken(await authors.findOne({ 'email': email, 'password': password })) }
        } else if (await authors.findOne({ 'username': email, 'password': password })) {
            return { success: true, token: await createToken(await authors.findOne({ 'username': email, 'password': password })) }
        } else if (!(await authors.findOne({ 'email': email })) || email.includes('@')) {
            return { success: false, message: "User does not exist" }
        } else if (!(await authors.findOne({ 'username': email }))) {
            return { success: false, message: "User does not exist" }
        }
        return { success: true }
    } catch (e) {
        console.log(e);
        return { success: false }
    }
}

// get details
export const details = async (id: string) => {
    try {
        var data = await authors.findOne({ '_id': id }).select('-_id')
        if (data) {
            return { success: true, 'data': data }
        }
        return { success: false }
    } catch (e) {
        console.log(e);
        return { success: false }
    }
}


const blogsDB = new mongo.Schema<BlogsModel>({
    title: {
        type: String,
    },
    summary: {
        type: String,
    },
    author_id: {
        type: String,
    },
    category_id: [{
        type: String,
    }],
    keywords: [{
        type: String,
    }],
    images: {
        type: String
    },
    date_published: {
        type: Date,
    },
    content: {
        type: String,
    },
}, {
    collection: "blogs"
})

export const blogs = mongo.model('blogs', blogsDB);


// Fetch all blogs
export const fetchAllBlogs = async () => {
    try {
        var data = await blogs.find({ }).select('-_id')
        if (data) {
            return { success: true, 'data': data }
        }
        return { success: false }
    } catch (e) {
        console.log(e);
        return { success: false }
    }
}

// Create new blogs
export const createNewBlogs = async (data: BlogsModel) => {
    try {
        const blog = new blogs(data);
        const info = await blog.save();
        if (info) {
            return { success: true, id: info._id }
        }
        return { success: false }
    } catch (e) {
        console.log(e);
        return { success: false }
    }
}

// Fetch certain author blogs
export const FetchAuthorBlogs = async (author_id: string) => {
    try {
        var data = await blogs.find({ 'author_id': author_id }).select('-_id')
        if (data) {
            return { success: true, 'data': data }
        }
        return { success: false }
    } catch (e) {
        console.log(e);
        return { success: false }
    }
}

// Blogs details
export const infoBlogs = async (id: string) => {
    try {
        var data = await blogs.find({ '_id': id }).select('-_id')
        if (data) {
            return { success: true, 'data': data }
        }
        return { success: false }
    } catch (e) {
        console.log(e);
        return { success: false }
    }
}
