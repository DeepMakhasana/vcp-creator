import { deleteModule, fetchCourseModule } from "@/api/course";
import ModuleAction from "@/components/courses/ModuleAction";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { Trash, Edit, Plus, ChevronLeft } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IModuleResponse, Mode, Module } from "@/types/course";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { toast } from "react-toastify";

const CourseModules = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery<Module[], Error>({
    queryKey: ["modules", { id: courseId }],
    queryFn: () => fetchCourseModule(Number(courseId)),
  });

  // create course mutation
  const { mutate } = useMutation<IModuleResponse, Error, number>({
    mutationKey: ["ModuleAction"],
    mutationFn: deleteModule,
    onMutate: () => {
      toast("Deleting module...");
    },
    onSuccess: (res) => {
      queryClient.setQueryData(["modules", { id: courseId }], (old: Module[]) =>
        old.filter((module) => module.id !== res.module.id)
      );
      toast(res.message);
    },
    onError: (error: any) => {
      console.log("request fail: ", error);
      toast(error?.response?.data?.message, { type: "error" });
    },
  });

  function handleModuleDelete(id: number) {
    mutate(id);
  }

  if (Number.isNaN(courseId)) {
    return <p className="p-2">Enter valid course id.</p>;
  }

  if (isLoading || data === undefined) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  console.log("modules", data);

  return (
    <main className="p-4 md:p-8">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div>
            <h1 className="text-2xl font-medium">Modules</h1>
            <p className="text-sm hidden text-muted-foreground sm:block">View and manage course modules</p>
          </div>
        </div>
        <div>
          <ModuleAction
            trigger={
              <DialogTrigger asChild>
                <Button>
                  <Plus />
                  Create
                </Button>
              </DialogTrigger>
            }
            mode={Mode.Create}
          />
        </div>
      </div>
      <Table className="my-8">
        <TableCaption>
          {data?.length <= 0 ? "Dose Not have any module in course" : "A list of modules in course"}
        </TableCaption>
        <TableHeader>
          <TableRow className="py-4">
            <TableHead className="w-[40px]">Order</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-[50px] sm:w-[120px]">Count</TableHead>
            <TableHead className="w-[100px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((module, index) => (
            <TableRow key={module.id}>
              <TableCell className="py-4 text-center">
                <Link
                  to={`/dashboard/courses/${module.courseId}/modules/${module.id}/lessons`}
                  className="cursor-pointer line-clamp-1"
                >
                  {index + 1}
                </Link>
              </TableCell>
              <TableCell className="font-medium py-4">
                <Link
                  to={`/dashboard/courses/${module.courseId}/modules/${module.id}/lessons`}
                  className="cursor-pointer line-clamp-1"
                >
                  {module.title}
                </Link>
              </TableCell>
              <TableCell className="py-4">
                <Link
                  to={`/dashboard/courses/${module.courseId}/modules/${module.id}/lessons`}
                  className="cursor-pointer flex gap-2 justify-center sm:justify-start"
                >
                  {module.lessons.length} <span className="hidden sm:block">lessons</span>
                </Link>
              </TableCell>
              <TableCell className="py-4 flex gap-1">
                <ModuleAction
                  trigger={
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Edit />
                      </Button>
                    </DialogTrigger>
                  }
                  mode={Mode.Edit}
                  editModule={{ id: module.id, title: module.title }}
                />
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button variant="outline" size="icon">
                      <Trash />
                    </Button>
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
                      <AlertDialogAction onClick={() => handleModuleDelete(module.id)}>Continue</AlertDialogAction>
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

export default CourseModules;
