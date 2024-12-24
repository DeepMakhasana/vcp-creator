import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "react-toastify";
import { sendVerifyEmailPayload, sendVerifyEmailResponse } from "@/types/auth";
import { sendForgotPasswordVerifyOtpEmail } from "@/api/auth";
import { IIsEmailVerify } from "./Register";
import { useState } from "react";
import EmailOtpVerification from "@/components/auth/EmailOtpVerification";
import { Loader2 } from "lucide-react";
import { forgotPasswordValidationSchema } from "@/schema/auth";
import ResetPassword from "@/components/auth/ResetPassword";

const ForgotPassword = () => {
  const [isEmailVerified, setIsEmailVerified] = useState<IIsEmailVerify>({ email: "", isVerified: false });

  const form = useForm<z.infer<typeof forgotPasswordValidationSchema>>({
    resolver: zodResolver(forgotPasswordValidationSchema),
    defaultValues: {
      email: "",
    },
  });

  // email verification mutation
  const { mutate: sendVerificationMutate, isPending } = useMutation<
    sendVerifyEmailResponse,
    Error,
    sendVerifyEmailPayload
  >({
    mutationKey: ["sendVerificationOtpEmail"],
    mutationFn: sendForgotPasswordVerifyOtpEmail,
    onSuccess: (res) => {
      setIsEmailVerified({ email: res.email, isVerified: false });
      toast(res.message);
    },
    onError: (error: any) => {
      console.log("request fail: ", error);
      toast(error?.response?.data?.message, { type: "error" });
    },
  });

  function onSubmit(values: z.infer<typeof forgotPasswordValidationSchema>) {
    // ✅ This will be type-safe and validated.
    sendVerificationMutate(values);
  }

  if (isEmailVerified?.email && !isEmailVerified?.isVerified) {
    return <EmailOtpVerification isEmailVerified={isEmailVerified} setIsEmailVerified={setIsEmailVerified} />;
  }

  if (isEmailVerified?.email && isEmailVerified?.isVerified) {
    return <ResetPassword email={isEmailVerified.email} />;
  }
  return (
    <main className="h-screen flex justify-center items-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot password</CardTitle>
          <CardDescription>Enter your email below to reset your password</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="jone@email.com" {...field} />
                        </FormControl>
                        {/* <FormDescription>This is your public display name.</FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {isPending ? (
                  <Button disabled>
                    <Loader2 className="animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button type="submit" className="w-full">
                    Verify
                  </Button>
                )}
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t send otp email?{" "}
            <span className="underline" onClick={() => sendVerificationMutate({ email: isEmailVerified.email })}>
              {isPending ? "sending email..." : "resend email"}
            </span>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default ForgotPassword;
