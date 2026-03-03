export const getToken = () => localStorage.getItem("@BarberFlow:token");
export const getRefreshToken = () => localStorage.getItem("@BarberFlow:refreshToken");

export const setToken = (token: string, refreshToken?: string) => {
  localStorage.setItem("@BarberFlow:token", token);
  if (refreshToken) {
    localStorage.setItem("@BarberFlow:refreshToken", refreshToken);
  }
};

export const removeToken = () => {
  localStorage.removeItem("@BarberFlow:token");
  localStorage.removeItem("@BarberFlow:refreshToken");
};

export const getUser = () => {
  const user = localStorage.getItem("@BarberFlow:user");
  return user ? JSON.parse(user) : null;
};
