import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, Edit, File, Grip, Loader2, LockKeyhole, LockKeyholeOpen, Plus, Trash, Video } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ILessonResponse, IOrderUpdatePayload, IOrderUpdateResponse, Lesson, Mode } from "@/types/course";
import { deleteLesson, fetchModuleLesson, updateLessonOrder } from "@/api/course";
import LessonAction from "@/components/courses/LessonAction";
import { DialogTrigger } from "@/components/ui/dialog";
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, closestCorners } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  arrayMove,
  sortableKeyboardCoordinates,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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
import { useState } from "react";

const CourseLessons = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [orderUpdatePayload, setOrderUpdatePayload] = useState<IOrderUpdatePayload[]>([]);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Lesson[], Error>({
    queryKey: ["lessons", { id: moduleId }],
    queryFn: () => fetchModuleLesson(Number(moduleId)),
  });

  // delete lesson mutation
  const { mutate: deleteMutation, isPending: deletePending } = useMutation<ILessonResponse, Error, number>({
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
    deleteMutation(id);
  }

  // update order mutation
  const { mutate: orderUpdateMutation, isPending: orderUpdatePending } = useMutation<
    IOrderUpdateResponse,
    Error,
    IOrderUpdatePayload[]
  >({
    mutationKey: ["LessonOrderUpdate"],
    mutationFn: updateLessonOrder,
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
      const activeIndex = data.findIndex((lesson) => lesson.order === active.id);
      const overIndex = data.findIndex((lesson) => lesson.order === over.id);

      const updatedData = arrayMove(data, activeIndex, overIndex);
      const updateOrder = updatedData.map((lesson, index) => ({ id: lesson.id, order: index + 1 }));
      queryClient.setQueryData(["lessons", { id: moduleId }], () => updatedData);

      setOrderUpdatePayload(updateOrder);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (Number.isNaN(moduleId)) {
    return <p className="p-2">Enter valid course id.</p>;
  }

  if (isLoading || data === undefined) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

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
        <div className="flex gap-2 items-center">
          {orderUpdatePayload.length > 0 && (
            <Button disabled={orderUpdatePending} onClick={handleOrderUpdate} className="flex gap-2 items-center">
              {orderUpdatePending && <Loader2 className="animate-spin" />}
              Update Order
            </Button>
          )}
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
            <TableHead className="w-[40px]"></TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-[100px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        {/* DnD */}
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <TableBody>
            <SortableContext items={data.map((lesson) => lesson.order)} strategy={verticalListSortingStrategy}>
              {data?.map((lesson) => (
                <LessonRow
                  key={lesson.id}
                  lesson={lesson}
                  handleLessonDelete={handleLessonDelete}
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

type LessonRowType = { lesson: Lesson; handleLessonDelete: (id: number) => void; deletePending: boolean };

const LessonRow = ({ lesson, handleLessonDelete, deletePending }: LessonRowType) => {
  // const { courseId } = useParams();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: lesson.order });

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
      <TableCell className="py-4">
        {/* <Link
          to={`/dashboard/courses/${courseId}/modules/${lesson.moduleId}/lessons/${lesson.id}`}
          className="cursor-pointer line-clamp-1"
        > */}
        <div className="flex gap-2 items-center">
          <div className="border p-2 rounded">
            {lesson.isVideo ? <Video className="text-gray-900 w-5 h-5" /> : <File className="text-gray-900 w-5 h-5" />}
          </div>
          <div>{lesson.public ? <LockKeyholeOpen className="w-4 h-4" /> : <LockKeyhole className="w-4 h-4" />}</div>
          <span className="font-medium line-clamp-1">{lesson.title}</span>
        </div>
        {/* </Link> */}
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
          editLesson={{
            id: lesson.id,
            title: lesson.title,
            isVideo: lesson.isVideo,
            url: lesson.public ? lesson.public.url : "",
          }}
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
              <AlertDialogAction onClick={() => handleLessonDelete(lesson.id)}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
};

export default CourseLessons;
