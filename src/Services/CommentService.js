import AxiosInstance from "../lib/AxiosBase";

export async function createCommentApi(formData, postId) {
    try {
        const { data } = await AxiosInstance.post(`/posts/${postId}/comments`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function updateCommentApi(postId, commentId, formData) {
    try {
        const { data } = await AxiosInstance.put(`/posts/${postId}/comments/${commentId}`,
            formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
        );
        return data;
    } catch (error) {
        console.log(error);
        return error.response?.data || error;
    }
}

export async function getPostComments(postId) {
    try {
        const { data } = await AxiosInstance.get(`/posts/${postId}/comments`);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function deleteCommentApi(postId, commentId) {
    try {
        const { data } = await AxiosInstance.delete(`/posts/${postId}/comments/${commentId}`
        );
        console.log("🚀 ~ deleteComment ~ data:", data)
        return data;
    } catch (error) {
        console.log(error);
        return error.response?.data || error;
    }
}

export async function likeAndUnlikeCommentApi(postId, commentId) {
    try {
        const { data } = await AxiosInstance.put(`/posts/${postId}/comments/${commentId}/like`);
        return data;
    } catch (error) {
        console.log(error);
        throw (error);
    }
}


export async function createReplyApi(postId, commentId, formData) {
    try {
        const { data } = await AxiosInstance.post(
            `/posts/${postId}/comments/${commentId}/replies`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function getPostReplyApi(postId, commentId, replyLimite) {
    try {
        const { data } = await AxiosInstance.get(`/posts/${postId}/comments/${commentId}/replies?page=1&limit=${replyLimite}`);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}