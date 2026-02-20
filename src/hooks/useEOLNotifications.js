export const useEOLNotifications = () => {
  return {
    notifications: [],
    loading: false,
    error: null,
    markAsRead: () => {},
    deleteNotification: () => {},
    refreshNotifications: () => {}
  };
};

export default useEOLNotifications;