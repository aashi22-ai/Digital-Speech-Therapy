import api from "./api";

export const getProgress = (userId) => api.get(`/progress/${userId}`).then((res) => res.data);
