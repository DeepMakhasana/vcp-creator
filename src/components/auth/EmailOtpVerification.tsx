import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useMutation } from "@tanstack/react-query";
import { emailOtpValidationSchema } from "@/schema/auth";
import { verifyEmailOtp } from "@/api/auth";
import { verifyEmailPayload, verifyEmailResponse } from "@/types/auth";
import { IIsEmailVerify } from "@/pages/auth/Register";
import { Dispatch, SetStateAction } from "react";

interface IEmailOtpVerificationProps {
  isEmailVerified: IIsEmailVerify;
  setIsEmailVerified: Dispatch<SetStateAction<IIsEmailVerify>>;
}

function EmailOtpVerification({ isEmailVerified, setIsEmailVerified }: IEmailOtpVerificationProps) {
  const form = useForm<z.infer<typeof emailOtpValidationSchema>>({
    resolver: zodResolver(emailOtpValidationSchema),
    defaultValues: {
      otp: "",
    },
  });

  // mutation for verify otp for verification
  const mutation = useMutation<verifyEmailResponse, Error, verifyEmailPayload>({
    mutationKey: ["verifyEmailOtp"],
    mutationFn: verifyEmailOtp,
    onSuccess: (res) => {
      console.log("successfully verification done", res);
      setIsEmailVerified({ ...isEmailVerified, isVerified: true });
      toast(res.message);
    },
    onError: (error: any) => {
      console.log("error", error);
      toast(error?.response?.data?.message, { type: "error" });
    },
  });

  function onSubmit(data: z.infer<typeof emailOtpValidationSchema>) {
    console.log(data);
    mutation.mutate({ email: isEmailVerified.email, otp: data.otp });
  }

  return (
    <main className="h-screen flex justify-center items-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Enter your email below to register your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Please enter the one-time password sent to your {isEmailVerified.email} Email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Verify</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}

export default EmailOtpVerification;
