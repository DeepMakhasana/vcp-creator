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
import { ILessonPayload, ILessonResponse, Lesson, Mode } from "@/types/course";
import { createLesson, updateLesson } from "@/api/course";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { File, LockKeyhole, LockKeyholeOpen, Video } from "lucide-react";
import { RadioGroup } from "@radix-ui/react-radio-group";

const formSchema = z
  .object({
    title: z
      .string()
      .min(2, {
        message: "Module must be at least 2 characters.",
      })
      .max(100, { message: "Module must be at less then 100 characters." }),
    type: z.string().min(2, {
      message: "Type of lesson is required",
    }),
    visibility: z.string().min(2, {
      message: "Type of visibility is required",
    }),
    url: z.union([z.string().url(), z.literal("")]),
  })
  .refine((data) => (data.visibility == "unlock" && data.url != "") || (data.visibility == "lock" && data.url == ""), {
    message: "URL is required when visibility is set to 'unlock'.",
    path: ["url"], // Targets the `url` field for error messages
  })
  .refine(
    (data) =>
      (data.visibility == "unlock" && data.type == "task" && data.url.includes("drive")) ||
      (data.visibility == "unlock" && data.type == "video" && data.url.includes("youtu")) ||
      data.visibility === "lock",
    {
      message: "Type of lesson and URL not match, enter valid URL.",
      path: ["url"], // Targets the `url` field for error messages
    }
  );

interface ILessonActionProps {
  trigger: ReactNode;
  mode: Mode;
  editLesson?: ILessonPayload | null;
}

const LessonAction = ({ trigger, mode, editLesson }: ILessonActionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { moduleId } = useParams();
  const queryClient = useQueryClient();

  const isCreateMode = mode === Mode.Create;
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: isCreateMode ? "" : editLesson?.title,
      type: isCreateMode ? "" : editLesson?.isVideo ? "video" : "task",
      visibility: isCreateMode ? "" : editLesson?.url ? "unlock" : "lock",
      url: isCreateMode ? "" : editLesson?.url,
    },
  });

  // create and update lesson mutation
  const { mutate, isPending } = useMutation<ILessonResponse, Error, ILessonPayload>({
    mutationKey: ["LessonAction"],
    mutationFn: isCreateMode ? createLesson : updateLesson,
    onSuccess: (res) => {
      // queryClient.invalidateQueries({ queryKey: ["course", { id: moduleId }] });
      queryClient.setQueryData(["lessons", { id: moduleId }], (old: Lesson[]) =>
        mode === Mode.Create
          ? [...old, res.lesson]
          : old.map((lesson) => (lesson.id === res.lesson.id ? res.lesson : lesson))
      );
      toast(res.message);
      setIsDialogOpen(false);
      if (isCreateMode) form.reset({ title: "", type: "", visibility: "", url: "" });
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
    let payload: ILessonPayload = {
      moduleId: Number(moduleId),
      title: values.title,
      isVideo: values.type === "video" ? true : false,
      url: "",
    };
    if (values.visibility == "unlock") {
      payload.url = values.url;
    }
    if (!isCreateMode) {
      payload.id = editLesson?.id;
    }
    mutate(payload);
  }

  useEffect(() => {
    console.log("change");
    if (form.watch("visibility") == "lock") {
      form.setValue("url", "");
    }
  }, [form.watch("visibility"), form.watch("visibility")]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {trigger}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">{isCreateMode ? "Create" : "Update"} Lesson</DialogTitle>
          <DialogDescription>
            {isCreateMode ? "Add new lesson in module." : "Edit module tile in module."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Lesson Title" {...field} />
                  </FormControl>
                  <FormDescription>Lesson title must be less then 100 character.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of lesson</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value} // Controlled by React Hook Form
                      onValueChange={(value) => field.onChange(value)} // Updates form state
                      className="grid grid-cols-2 gap-4"
                    >
                      <Button
                        type="button"
                        variant={"outline"}
                        size={"lg"}
                        className={field.value === "video" ? "border-2 border-black" : ""}
                        onClick={() => field.onChange("video")}
                      >
                        <Video /> Video
                      </Button>
                      <Button
                        type="button"
                        variant={"outline"}
                        size={"lg"}
                        className={field.value === "task" ? "border-2 border-black" : ""}
                        onClick={() => field.onChange("task")}
                      >
                        <File /> Task
                      </Button>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>Select the type of lesson.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of visibility</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value} // Controlled by React Hook Form
                      onValueChange={(value) => field.onChange(value)} // Updates form state
                      className="grid grid-cols-2 gap-4"
                    >
                      <Button
                        type="button"
                        variant={"outline"}
                        size={"lg"}
                        className={field.value === "unlock" ? "border-2 border-black" : ""}
                        onClick={() => field.onChange("unlock")}
                      >
                        <LockKeyholeOpen /> Unlock
                      </Button>
                      <Button
                        type="button"
                        variant={"outline"}
                        size={"lg"}
                        className={field.value === "lock" ? "border-2 border-black" : ""}
                        onClick={() => field.onChange("lock")}
                      >
                        <LockKeyhole /> Lock
                      </Button>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>Select the type of visibility.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("visibility") === "unlock" && form.watch("visibility") && (
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {form.watch("type") === "video" ? "Public YouTube Video URL" : "Public File Drive URL"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder={
                          form.watch("type") === "video"
                            ? "https://youtu.be/SQCbq86j6QU?si=oDgF22CB9UtijbL9"
                            : "https://drive.google.com/someting"
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {form.watch("type") === "video"
                        ? "Copy from Go to youtube video > share > copy"
                        : "Copy from Go to drive file > more option > Get link > set general access - Anyone with the link > click on Get link"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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

export default LessonAction;
