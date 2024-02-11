
export interface BlogsModel {
    title: string,
    summary: string,
    author_id: string,
    category_id: Array<string>,
    keywords: Array<string>,
    images: string,
    date_published: Date,
    content: string,
}

export interface AuthorsModel {
    name: string,
    username: string,
    email: string,
    bio: string,
    socialInfo: Array<object>,
    password: string,
    author: boolean
}

export interface CommentModel {
    blog_id: string,
    user_id: string,
    comment: string,
    date_posted: Date
}

export interface Response {
    success: boolean,
    message: string
}