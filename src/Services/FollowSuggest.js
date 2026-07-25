import AxiosInstance from "../lib/AxiosBase";

export async function GetFollowSuggest(followLimite) {
    try {
        const { data } = await AxiosInstance.get(`/users/suggestions?limit=${followLimite}`);
        return data;
    } catch (error) {
        console.log("🚀 ~ GetFollowSuggest ~ error:", error);
        throw error;
    }
}

export async function FollowUser(userId) {
    try {
        const { data } = await AxiosInstance.post(`/users/${userId}/follow`);
        return data;
    } catch (error) {
        console.log("🚀 ~ FollowUser ~ error:", error);
        throw error;
    }
}
