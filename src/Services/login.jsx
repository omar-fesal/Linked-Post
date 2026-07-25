import axios from "axios";
import AxiosInstance from "../lib/AxiosBase";


export async function signInData(val) {
    try {
        const { data } = await AxiosInstance.post('/users/signin', val)
        // console.log(data);
        return data.data

    } catch (error) {
        // console.log(error.response.data);
        return error.response.data
    }

}
export async function isLoggedInData() {
    try {
        const { data } = await AxiosInstance.get('/users/profile-data')

        return data

    } catch (error) {

        return error.response.data
    }

}

