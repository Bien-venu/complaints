import http from "../api/http";

export const syncUserGroups = (userId) => {
  return http.patch(`/users/${userId}/sync-groups`);
};
