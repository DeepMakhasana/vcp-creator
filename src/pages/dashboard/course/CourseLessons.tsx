import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, Edit, File, Loader2, Plus, Trash, Video } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ILessonResponse, Lesson, Mode } from "@/types/course";
import { deleteLesson, fetchModuleLesson } from "@/api/course";
import LessonAction from "@/components/courses/LessonAction";
import { DialogTrigger } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CourseLessons = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Lesson[], Error>({
    queryKey: ["lessons", { id: moduleId }],
    queryFn: () => fetchModuleLesson(Number(moduleId)),
  });

  // delete lesson mutation
  const { mutate, isPending } = useMutation<ILessonResponse, Error, number>({
    mutationKey: ["LessonAction"],
    mutationFn: deleteLesson,
    onSuccess: (res) => {
      queryClient.setQueryData(["lessons", { id: moduleId }], (old: Lesson[]) =>
        old.filter((lesson) => lesson.id !== res.lesson.id)
      );
      toast(res.message);
    },
    onError: (error: any) => {
      console.log("request fail: ", error);
      toast(error?.response?.data?.message, { type: "error" });
    },
  });

  function handleLessonDelete(id: number) {
    mutate(id);
  }

  if (Number.isNaN(moduleId)) {
    return <p className="p-2">Enter valid course id.</p>;
  }

  if (isLoading || data === undefined) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  console.log("lesson", data);

  return (
    <main className="p-4 md:p-8">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div>
            <h1 className="text-2xl font-medium">Lessons</h1>
            <p className="text-sm hidden text-muted-foreground sm:block">View and manage course lessons</p>
          </div>
        </div>
        <div>
          <LessonAction
            trigger={
              <DialogTrigger asChild>
                <Button>
                  <Plus /> Create
                </Button>
              </DialogTrigger>
            }
            mode={Mode.Create}
          />
        </div>
      </div>
      <Table className="my-8">
        <TableCaption>
          {data.length <= 0 ? "Dose Not have any lessons in course" : "A list of lessons in course"}
        </TableCaption>
        <TableHeader>
          <TableRow className="py-4">
            <TableHead className="w-[40px]">Order</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-[100px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((lesson, index) => (
            <TableRow key={lesson.id}>
              <TableCell className="py-4 text-center">{index + 1}</TableCell>
              <TableCell className="py-4">
                <div className="flex gap-2 items-center">
                  <div className="border p-2 rounded">
                    {lesson.isVideo ? (
                      <Video className="text-gray-900 w-5 h-5" />
                    ) : (
                      <File className="text-gray-900 w-5 h-5" />
                    )}
                  </div>
                  <span className="font-medium line-clamp-1">{lesson.title}</span>
                </div>
              </TableCell>
              <TableCell className="py-4 flex gap-1">
                <LessonAction
                  trigger={
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Edit />
                      </Button>
                    </DialogTrigger>
                  }
                  mode={Mode.Edit}
                  editLesson={{ id: lesson.id, title: lesson.title, isVideo: lesson.isVideo }}
                />
                <AlertDialog>
                  <AlertDialogTrigger>
                    {isPending ? (
                      <Button disabled size={"icon"}>
                        <Loader2 className="animate-spin" />
                      </Button>
                    ) : (
                      <Button variant={"outline"} size={"icon"}>
                        <Trash />
                      </Button>
                    )}
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete module and remove module from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleLessonDelete(lesson.id)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
};

export default CourseLessons;
