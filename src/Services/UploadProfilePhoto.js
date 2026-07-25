import AxiosInstance from "../lib/AxiosBase";

export async function UploadProfilePhotoApi(formData) {
    try {
        const { data } = await AxiosInstance.put(`/users/upload-photo`,
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

export async function UploadCoverPhotoApi(formData) {
    try {
        const { data } = await AxiosInstance.put(`/users/upload-cover`,
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