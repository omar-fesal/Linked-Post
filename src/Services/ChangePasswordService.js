import AxiosInstance from "../lib/AxiosBase";

export async function changePasswordApi(body) {
    try {
        const { data } = await AxiosInstance.patch('/users/change-password', body);
        return data;
    } catch (error) {
        console.log('🚀 ~ markNotificationReadApi ~ error:', error);
        throw error;
    }
}