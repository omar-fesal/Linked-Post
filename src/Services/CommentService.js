import AxiosInstance from "../lib/AxiosBase";

export async function createCommentApi(content, post) {
    try {
        const { data } = await AxiosInstance.post('/comments', {
            content,
            post
        });
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function updateCommentApi(content, commentId) {
    try {
        const { data } = await AxiosInstance.put('/comments/' + commentId, {
            content,
        });
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function getCommentsApi(postId) {
    try {
        const { data } = await AxiosInstance.get(`/posts/${postId}/comments`);
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}