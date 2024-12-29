export const endpoints = {
  auth: {
    sendVerifyOtpEmail: "/auth/creator/send-verify-email",
    verifyEmailOtp: "/auth/verify-email-otp",
    register: "/auth/creator/register",
    login: "/auth/creator/login",
    forgotPasswordVerifyEmailSend: "/auth/creator/forgot-password/send-verify-email",
    resetPassword: "/auth/creator/reset-password",
    users: "/auth/user",
  },
  course: {
    main: "/course",
    own: "/course/own",
    order: "/course/order",
  },
  module: {
    main: "/course/module",
    order: "/course/module/order",
  },
  lesson: {
    main: "/course/lesson",
    moduleLessons: "/course/lessons",
    order: "/course/lesson/order",
  },
  s3: {
    putObject: "/s3/putObject",
    getObject: "/s3/getObject",
  },
};
