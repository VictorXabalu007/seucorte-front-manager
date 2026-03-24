export const getToken = () => localStorage.getItem("@SeuCorte:token") || localStorage.getItem("@BarberFlow:token");
export const getRefreshToken = () => localStorage.getItem("@SeuCorte:refreshToken") || localStorage.getItem("@BarberFlow:refreshToken");

export const setToken = (token: string, refreshToken?: string) => {
  localStorage.setItem("@SeuCorte:token", token);
  if (refreshToken) {
    localStorage.setItem("@SeuCorte:refreshToken", refreshToken);
  }
};

export const removeToken = () => {
  localStorage.removeItem("@SeuCorte:token");
  localStorage.removeItem("@SeuCorte:refreshToken");
  localStorage.removeItem("@BarberFlow:token");
  localStorage.removeItem("@BarberFlow:refreshToken");
};

export const getUser = () => {
  const user = localStorage.getItem("@SeuCorte:user") || localStorage.getItem("@BarberFlow:user");
  return user ? JSON.parse(user) : null;
};

export const getActiveUnidadeId = () => {
  // Tentamos pegar do localStorage se houver um seletor de unidade no futuro
  const storedId = localStorage.getItem("@SeuCorte:unidadeId") || localStorage.getItem("@BarberFlow:unidadeId");
  if (storedId) return storedId;

  // Fallback para a primeira unidade do usuário se disponível
  const user = getUser();
  return user?.unidades?.[0]?.id || null; 
};
