import api from "@/lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'BARBER';
  avatarUrl?: string;
  phone?: string;
  forcePasswordChange?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const authService = {
  async login(data: any): Promise<AuthResponse> {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  async register(data: any) {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  async verifyEmail(data: { email: string; otp: string }) {
    const response = await api.post("/auth/verify-email", data);
    return response.data;
  },

  async resendOtp(data: { email: string; purpose: 'email-verification' | 'password-reset' }) {
    const response = await api.post("/auth/resend-otp", data);
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  async verifyOtp(data: { email: string; otp: string }) {
    const response = await api.post("/auth/verify-otp", data);
    return response.data;
  },

  async resetPassword(data: any) {
    const response = await api.post("/auth/reset-password", data);
    return response.data;
  },

  async me(): Promise<User> {
    const response = await api.get("/auth/me");
    return response.data;
  },

  async logout() {
    await api.post("/auth/logout");
  },
  
  async changePassword(newPassword: string) {
    const response = await api.post("/auth/change-password", { newPassword });
    return response.data;
  }
};
