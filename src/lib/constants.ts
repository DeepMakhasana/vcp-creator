export const constants = {
  TOKEN: "auth_token",
};

export const allowPath = ["/", "/login", "/register", "/forgot-password"];

export const courseImageBaseUrl = "https://vpc-public.s3.ap-south-1.amazonaws.com/course/cover-image/";

export const clientEndpoints = {
  auth: {
    register: "/register",
    login: "/login",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
  },
  course: {
    main: "/dashboard/courses",
  },
};
