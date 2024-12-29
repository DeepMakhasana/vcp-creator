export type verifyEmailResponse = {
  email: string;
  message: string;
};

export type verifyEmailPayload = {
  email: string;
  otp: string;
};

export type sendVerifyEmailResponse = {
  message: string;
  email: string;
};

export type sendVerifyEmailPayload = {
  email: string;
};

export type registerResponse = {
  message: string;
  token: string;
};

export type registerPayload = {
  name: string;
  email: string;
  password: string;
  mobile: string;
  domain: string;
  bio: string;
  role: string;
};

export type loginResponse = {
  message: string;
  token: string;
};

export type loginPayload = {
  email: string;
  password: string;
};

export type resetResponse = {
  message: string;
  email: string;
};

export type resetPayload = {
  email: string;
  password: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  mobile: string;
  image: string;
  domain: string;
  bio: string;
  role: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type CreatorUser = {
  id: number;
  name: string;
  email: string;
  mobile: string;
  createdAt: Date;
};
