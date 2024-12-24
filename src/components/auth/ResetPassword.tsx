import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "react-toastify";
import { resetPayload, resetResponse } from "@/types/auth";
import { creatorPasswordReset } from "@/api/auth";
import { Loader2 } from "lucide-react";
import { resetPasswordValidationSchema } from "@/schema/auth";

const ResetPassword = ({ email }: { email: string }) => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof resetPasswordValidationSchema>>({
    resolver: zodResolver(resetPasswordValidationSchema),
    defaultValues: {
      password: "",
      repeatPassword: "",
    },
  });

  // email verification mutation
  const { mutate: resetPasswordMutate, isPending } = useMutation<resetResponse, Error, resetPayload>({
    mutationKey: ["resetPassword"],
    mutationFn: creatorPasswordReset,
    onSuccess: (res) => {
      toast(res.message);
      // navigate the route to dashboard
      setTimeout(() => {
        navigate("/login");
      }, 500);
    },
    onError: (error: any) => {
      console.log("request fail: ", error);
      toast(error?.response?.data?.message, { type: "error" });
    },
  });

  function onSubmit(values: z.infer<typeof resetPasswordValidationSchema>) {
    // ✅ This will be type-safe and validated.
    if (values.password === values.repeatPassword) {
      resetPasswordMutate({ email, password: values.password });
    } else {
      toast("Password and repeat password doesn't mach.");
    }
  }

  return (
    <main className="h-screen flex justify-center items-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="password" {...field} />
                      </FormControl>
                      <FormDescription>Password must be at least 8 characters long</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="repeatPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Repeat password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="repeat password" {...field} />
                        </FormControl>
                        <FormDescription>Enter same password which is enter in password field.</FormDescription>
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
                    Reset
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
};

export default ResetPassword;
