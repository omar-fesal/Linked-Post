import AxiosInstance from "../lib/AxiosBase";

export async function sendRegisterData(value) {
    try {
        const { data } = await AxiosInstance.post('/users/signup', value);
        return data;
    } catch (error) {
        return error.response.data;
    }
}
