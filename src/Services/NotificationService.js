import AxiosInstance from '../lib/AxiosBase';

/**
 * GET /notifications?unread=false&page=1&limit=10
 */
export async function getAllNotificationsApi({ page = 1, limit = 10, unread = false } = {}) {
    try {
        const { data } = await AxiosInstance.get('/notifications', {
            params: { unread, page, limit }
        });
        return data;
    } catch (error) {
        console.log('🚀 ~ getAllNotificationsApi ~ error:', error);
        throw error;
    }
}

/**
 * GET /notifications/unread-count
 */
export async function getUnreadCountApi() {
    try {
        const { data } = await AxiosInstance.get('/notifications/unread-count');
        return data;
    } catch (error) {
        console.log('🚀 ~ getUnreadCountApi ~ error:', error);
        throw error;
    }
}

/**
 * PATCH /notifications/:notificationId/read
 */
export async function markNotificationReadApi(notificationId) {
    try {
        const { data } = await AxiosInstance.patch(`/notifications/${notificationId}/read`);
        return data;
    } catch (error) {
        console.log('🚀 ~ markNotificationReadApi ~ error:', error);
        throw error;
    }
}

/**
 * PATCH /notifications/read-all
 */
export async function markAllReadApi() {
    try {
        const { data } = await AxiosInstance.patch('/notifications/read-all');
        return data;
    } catch (error) {
        console.log('🚀 ~ markAllReadApi ~ error:', error);
        throw error;
    }
}
