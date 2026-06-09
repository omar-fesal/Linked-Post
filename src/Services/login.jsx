import axios from "axios";
import AxiosInstance from "../lib/AxiosBase";


export async function signInData(val) {
    try {
        const { data } = await axios.post('https://route-posts.routemisr.com/users/signin', val)
        // console.log(data);
        return data

    } catch (error) {
        // console.log(error.response.data);
        return error.response.data
    }

}
export async function isLoggedInData() {
    try {
        const { data } = await AxiosInstance.get('https://route-posts.routemisr.com/users/profile-data')

        return data

    } catch (error) {

        return error.response.data
    }

}