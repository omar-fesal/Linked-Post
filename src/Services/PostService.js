import axios from "axios";
import AxiosInstance from "../lib/AxiosBase";

export async function getPosts() {
    return axios.get('https://route-posts.routemisr.com/posts');
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
        const { data } = await AxiosInstance.post('/posts', formData);
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