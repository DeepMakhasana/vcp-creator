import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { loginValidationSchema } from "@/schema/auth";
import { loginPayload, loginResponse } from "@/types/auth";
import { creatorLogin } from "@/api/auth";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import useAuthContext from "@/context/auth/useAuthContext";

function Login() {
  const { login } = useAuthContext();

  const form = useForm<z.infer<typeof loginValidationSchema>>({
    resolver: zodResolver(loginValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { reset } = form;

  const { mutate, isPending } = useMutation<loginResponse, Error, loginPayload>({
    mutationKey: ["login"],
    mutationFn: creatorLogin,
    onSuccess: (res) => {
      // reset the input filed
      reset();
      // show the notification
      toast(res.message);

      // set the token in local
      login(res.token);
    },
    onError: (error: any) => {
      console.log("request fail: ", error);
      toast(error?.response?.data?.message, { type: "error" });
    },
  });

  function onSubmit(values: z.infer<typeof loginValidationSchema>) {
    // ✅ This will be type-safe and validated.
    mutate(values);
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
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel>Password</FormLabel>
                          <Link to="/forgot-password" className="ml-auto inline-block text-sm underline">
                            Forgot your password?
                          </Link>
                        </div>
                        <FormControl>
                          <Input type="password" placeholder="password" {...field} />
                        </FormControl>
                        <FormDescription>Password must be at least 8 characters long</FormDescription>
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
                    Login
                  </Button>
                )}
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default Login;
