
import axios from "axios";
import AxiosInstance from "../lib/AxiosBase";

export async function getPosts() {
    return AxiosInstance.get('/posts');
}

export async function getSinglePosts(postId) {
    try {
        const { data } = await AxiosInstance.get('/posts/' + postId);
        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function createPostApi(formData) {
    try {
        const { data } = await AxiosInstance.post('/posts', formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function deletPostApi(postId) {
    try {
        const { data } = await AxiosInstance.delete('/posts/' + postId);
        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function likeAndUnlikePostApi(postId) {
    try {
        const { data } = await AxiosInstance.put(`/posts/${postId}/like`)
        return data
    } catch (error) {
        console.log(error);
        throw (error)
    }
}

export async function UpdatePostApi(postId, formData) {
    try {
        const { data } = await AxiosInstance.put(`/posts/${postId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        return data
    } catch (error) {
        console.log(error);
        throw (error)
    }
}

export async function followAndUnFollowApi(postId) {
    try {
        const { data } = await AxiosInstance.put(`/users/${postId}/follow`)
        console.log("🚀 ~ followAndUnFollowApi ~ data:", data)
        return data
    } catch (error) {
        console.log(error);
        throw (error)
    }
}


export async function getUserPostApi(userId) {
    try {
        const { data } = await AxiosInstance.get(`/users/${userId}/posts`)

        return data
    } catch (error) {
        console.log("🚀 ~ getUserPostApi ~ error:", error)
        throw (error)
    }
}

export async function sharePostApi(postId, body) {
    try {
        const { data } = await AxiosInstance.post(`/posts/${postId}/share`, body);
        console.log("🚀 ~ sharePostApi ~ data:", data)

        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function myFeedPageApi(posts) {
    try {
        const { data } = await AxiosInstance.get(`/posts/feed?only=following`)

        return data
    } catch (error) {
        console.log("🚀 ~ getUserPostApi ~ error:", error)
        throw (error)
    }
}


export async function bookmarkApi(postId) {
    try {
        const { data } = await AxiosInstance.put(`/posts/${postId}/bookmark`)
        return data
    } catch (error) {
        console.log(error);
        throw (error)
    }
}


export async function getMyBookmarkedPosts() {
    try {
        const { data } = await AxiosInstance.get(`/users/bookmarks`)

        return data
    } catch (error) {
        console.log("🚀 ~ getUserPostApi ~ error:", error)
        throw (error)
    }
}

export async function getPostLikesApi(postId, page = 1, limit = 20) {
    try {
        const { data } = await AxiosInstance.get(`/posts/${postId}/likes`, {
            params: { page, limit }
        });
        return data;
    } catch (error) {
        console.log("🚀 ~ getPostLikesApi ~ error:", error);
        throw error;
    }
}