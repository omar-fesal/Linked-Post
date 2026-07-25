import AxiosInstance from "../lib/AxiosBase"

export default async function GetUserProfile(userId) {
    try {
        const { data } = await AxiosInstance.get(`/users/${userId}/profile`)
        return data
    } catch (error) {
        console.log("🚀 ~ GetUserProfile ~ error:", error)
        throw (error)
    }
}
export async function GetUserPosts(userId) {
    try {
        const { data } = await AxiosInstance.get(`/users/${userId}/posts`)
        return data
    } catch (error) {
        console.log("🚀 ~ GetUserProfile ~ error:", error)
        throw (error)
    }
}
export async function getFollowersApi(userId) {
    try {
        const { data } = await AxiosInstance.get(`/users/${userId}/followers`)
        return data
    } catch (error) {
        console.log("🚀 ~ getFollowersApi ~ error:", error)
        throw error
    }
}
export async function getFollowingApi(userId) {
    try {
        const { data } = await AxiosInstance.get(`/users/${userId}/following`)
        return data
    } catch (error) {
        console.log("🚀 ~ getFollowingApi ~ error:", error)
        throw error
    }
}