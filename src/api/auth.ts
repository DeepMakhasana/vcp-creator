import axiosInstance from "@/lib/axiosInstance";
import { endpoints } from ".";
import {
  loginPayload,
  loginResponse,
  registerPayload,
  registerResponse,
  resetPayload,
  resetResponse,
  sendVerifyEmailResponse,
  verifyEmailResponse,
} from "@/types/auth";

export async function sendVerifyOtpEmail(payload: { email: string }): Promise<sendVerifyEmailResponse> {
  const { data } = await axiosInstance.post(endpoints.auth.sendVerifyOtpEmail, payload);
  return data;
}

export async function sendForgotPasswordVerifyOtpEmail(payload: { email: string }): Promise<sendVerifyEmailResponse> {
  const { data } = await axiosInstance.post(endpoints.auth.forgotPasswordVerifyEmailSend, payload);
  return data;
}

export async function verifyEmailOtp(payload: { email: string; otp: string }): Promise<verifyEmailResponse> {
  const { data } = await axiosInstance.post(endpoints.auth.verifyEmailOtp, payload);
  return data;
}

export async function creatorRegister(payload: registerPayload): Promise<registerResponse> {
  const { data } = await axiosInstance.post(endpoints.auth.register, payload);
  return data;
}

export async function creatorLogin(payload: loginPayload): Promise<loginResponse> {
  const { data } = await axiosInstance.post(endpoints.auth.login, payload);
  return data;
}

export async function creatorPasswordReset(payload: resetPayload): Promise<resetResponse> {
  const { data } = await axiosInstance.post(endpoints.auth.resetPassword, payload);
  return data;
}
