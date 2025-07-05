import apiClient from '../lib/api';
import { v4 as uuidv4 } from 'uuid';

const getSessionId = () => {
    let sessionId = sessionStorage.getItem('prymshare_session_id');
    if (!sessionId) {
        sessionId = uuidv4();
        sessionStorage.setItem('prymshare_session_id', sessionId);
    }
    return sessionId;
};

export const recordEvent = (slug, eventType, details = {}) => {
    const sessionId = getSessionId();
    const payload = {
        event_type: eventType,
        session_id: sessionId,
        details,
    };
    // This is a "fire-and-forget" request, so we don't need to handle the response.
    // We wrap it in a try/catch to prevent tracking errors from breaking the UI.
    try {
        apiClient.post(`/analytics/record/${slug}/`, payload);
    } catch (error) {
        console.error("Failed to record analytics event:", error);
    }
};

export const getAnalyticsData = async (pageId) => {
    const response = await apiClient.get(`/analytics/dashboard/${pageId}/`);
    return response.data;
};