
import mongo, { Schema, Document } from "mongoose";
import { createToken } from "../workers/auth";
import { passwordChecker } from "../workers/crypt";
import { AuthorsModel, BlogsModel } from "../workers/model";


// User
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
    sub: {
        type: Boolean,
        required: true
    },
    socialInfo: [{
        type: Object,
        _id: false
    }]
}, {
    collection: "User"
})

export const authors = mongo.model('User', authorsDB);


// register
export const register = async (data: AuthorsModel) => {
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

// login
export const login = async (email: string, password: string) => {
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
        return { success: false, message: "Something went wrong" }
    }
}

// Get all users
export const getAllUsers = async () => {
    try {
        var data = await authors.findOne({ }).select('-_id')
        if (data) {
            return { success: true, 'data': data }
        }
        return { success: false, message: "Unabled to fetch details." }
    } catch (e) {
        console.log(e);
        return { success: false, message: "Something went wrong." }
    }
}

// Delete user
export const deleteUser = async (id: string) => {
    try {
        await authors.deleteOne({ '_id': id })
        return { success: true }
    } catch (e) {
        console.log(e);
        return { success: false, message: "User not found." }
    }
}

// get details
export const getUserByID = async (id: string) => {
    try {
        var data = await authors.findOne({ '_id': id }).select('-_id')
        if (data) {
            return { success: true, 'data': data }
        }
        return { success: false, message: "User does not exist" }
    } catch (e) {
        console.log(e);
        return { success: false, message: "Something went wrong." }
    }
}

export const isSubscriber = async (id: string) => {
    try {
        var data = await authors.findOne({ '_id': id, 'sub': true }).select('-_id')
        if (data) {
            return { success: true }
        }
        return { success: false, message: "User is not a subscriber." }
    } catch (e) {
        console.log(e);
        return { success: false, message: "Something went wrong." }
    }
}

// Blogs
const blogsDB = new mongo.Schema<BlogsModel>({
    title: {
        type: String,
    },
    summary: {
        type: String,
    },
    author_id: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
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
    collection: "Blog"
})

export const blogs = mongo.model('Blog', blogsDB);


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
export const FetchAuthorBlogs = async (id: string) => {
    try {
        // await authors.createIndexes({ authors: 1 });
        var data = await blogs.find({ 'author_id': id }).select('-_id')
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

// Search Blogs
export const searchBlogs = async (query: string) => {
    try {
      if (!query) {
        return { success: true, message: 'Search query is required' }
      }
      const searchResults = await blogs.find({ $text: { $search: query } }).select('-_id');
      if (searchResults) {
          return { success: true, data: searchResults }
      }
      return { success: false, message: "Something went wrong" }
    } catch (error) {
      console.error('Error searching blogs:', error);
      return { success: false, message: "Something went wrong" }
    }
  }
  