import { deleteModule, fetchCourseModule, updateModuleOrder } from "@/api/course";
import ModuleAction from "@/components/courses/ModuleAction";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { Trash, Edit, Plus, ChevronLeft, Grip, Loader2, Folder } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IModuleResponse, IOrderUpdatePayload, IOrderUpdateResponse, Mode, Module } from "@/types/course";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, closestCorners } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  arrayMove,
  sortableKeyboardCoordinates,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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
import { useState } from "react";

const CourseModules = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [orderUpdatePayload, setOrderUpdatePayload] = useState<IOrderUpdatePayload[]>([]);
  const { data, isLoading, isError, error } = useQuery<Module[], Error>({
    queryKey: ["modules", { id: courseId }],
    queryFn: () => fetchCourseModule(Number(courseId)),
  });

  // delete module mutation
  const { mutate: deleteMutation, isPending: deletePending } = useMutation<IModuleResponse, Error, number>({
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
    deleteMutation(id);
  }

  // order update mutation
  const { mutate: orderUpdateMutation, isPending: orderUpdatePending } = useMutation<
    IOrderUpdateResponse,
    Error,
    IOrderUpdatePayload[]
  >({
    mutationKey: ["ModuleOrderUpdate"],
    mutationFn: updateModuleOrder,
    onSuccess: (res) => {
      toast(res.message);
      setOrderUpdatePayload([]);
    },
    onError: (error: any) => {
      console.log("request fail: ", error);
      toast(error?.response?.data?.message, { type: "error" });
    },
  });

  function handleOrderUpdate() {
    orderUpdateMutation(orderUpdatePayload);
  }

  // Dnd
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id === over.id) return;

    if (data) {
      const activeIndex = data.findIndex((module) => module.order === active.id);
      const overIndex = data.findIndex((module) => module.order === over.id);

      const updatedData = arrayMove(data, activeIndex, overIndex);
      const updateOrder = updatedData.map((module, index) => ({ id: module.id, order: index + 1 }));
      queryClient.setQueryData(["modules", { id: courseId }], () => updatedData);

      setOrderUpdatePayload(updateOrder);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (Number.isNaN(courseId)) {
    return <p className="p-2">Enter valid course id.</p>;
  }

  if (isLoading || data === undefined) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  console.log("modules", data, orderUpdatePayload);

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
        <div className="flex gap-2 items-center">
          {orderUpdatePayload.length > 0 && (
            <Button disabled={orderUpdatePending} onClick={handleOrderUpdate} className="flex gap-2 items-center">
              {orderUpdatePending && <Loader2 className="animate-spin" />}
              Update Order
            </Button>
          )}
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
            <TableHead className="w-[40px]"></TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-[30px] sm:w-[120px]">Count</TableHead>
            <TableHead className="w-[80px] sm:w-[120px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        {/* DnD */}
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <TableBody>
            <SortableContext items={data.map((module) => module.order)} strategy={verticalListSortingStrategy}>
              {data?.map((module) => (
                <ModuleRow
                  key={module.id}
                  module={module}
                  handleModuleDelete={handleModuleDelete}
                  deletePending={deletePending}
                />
              ))}
            </SortableContext>
          </TableBody>
        </DndContext>
      </Table>
    </main>
  );
};

type ModuleRowType = { module: Module; handleModuleDelete: (id: number) => void; deletePending: boolean };

const ModuleRow = ({ module, handleModuleDelete, deletePending }: ModuleRowType) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: module.order });

  const style = {
    transition,
    transform: CSS.Transform.toString(
      transform
        ? { ...transform, x: 0, scaleX: 1, scaleY: 1 } // Restrict to vertical dragging and provide default scales
        : null
    ),
    cursor: "default",
  };

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes}>
      <TableCell className="py-4 text-center">
        <Button variant={"outline"} size={"icon"} {...listeners}>
          <Grip />
        </Button>
      </TableCell>
      <TableCell className="font-medium py-4">
        <Link
          to={`/dashboard/courses/${module.courseId}/modules/${module.id}/lessons`}
          className="cursor-pointer line-clamp-1"
        >
          <div className="flex gap-2 items-center">
            <div className="border p-2 rounded">
              <Folder className="text-gray-900 w-5 h-5" />
            </div>
            <span className="font-medium line-clamp-1">{module.title}</span>
          </div>
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
            <Button disabled={deletePending} variant="outline" size="icon">
              {deletePending ? <Loader2 className="animate-spin" /> : <Trash />}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete module and remove module from our servers.
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
  );
};

export default CourseModules;
