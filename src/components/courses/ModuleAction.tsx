import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { IModule, IModuleResponse, Mode, Module } from "@/types/course";
import { createModule, updateModule } from "@/api/course";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { ReactNode, useState } from "react";

const formSchema = z.object({
  module: z
    .string()
    .min(2, {
      message: "Module must be at least 2 characters.",
    })
    .max(100, { message: "Module must be at less then 100 characters." }),
});

interface IModuleActionProps {
  trigger: ReactNode;
  mode: Mode;
  editModule?: { id: number; title: string } | null;
}

const ModuleAction = ({ trigger, mode, editModule }: IModuleActionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { courseId } = useParams();
  const queryClient = useQueryClient();

  const isCreateMode = mode === Mode.Create;
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      module: isCreateMode ? "" : editModule?.title,
    },
  });

  // create and update module mutation
  const { mutate, isPending } = useMutation<IModuleResponse, Error, IModule>({
    mutationKey: ["ModuleAction"],
    mutationFn: isCreateMode ? createModule : updateModule,
    onSuccess: (res) => {
      // queryClient.invalidateQueries({ queryKey: ["course", { id: courseId }] });
      queryClient.setQueryData(["modules", { id: courseId }], (old: Module[]) =>
        mode === Mode.Create
          ? [...old, { ...res.module, lessons: [] }]
          : old.map((module) => (module.id === res.module.id ? { ...module, ...res.module } : module))
      );
      toast(res.message);
      setIsDialogOpen(false);
      form.reset({ module: "" });
    },
    onError: (error: any) => {
      console.log("request fail: ", error);
      toast(error?.response?.data?.message, { type: "error" });
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    let payload: IModule = { courseId: Number(courseId), title: values.module };
    if (!isCreateMode) {
      payload.id = editModule?.id;
    }
    mutate(payload);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {trigger}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">{isCreateMode ? "Create" : "Update"} Module</DialogTitle>
          <DialogDescription>
            {isCreateMode ? "Add new module in course." : "Edit module tile in course."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="module"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Module Title" {...field} />
                  </FormControl>
                  <FormDescription>Module title must be less then 100 character.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              {isCreateMode ? (
                <Button type="submit">{isPending ? "Creating.." : "Create"}</Button>
              ) : (
                <Button type="submit">{isPending ? "Updating.." : "Update"}</Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleAction;
