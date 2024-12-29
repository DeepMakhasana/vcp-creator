import CourseAction, { InitialCourseValues } from "@/components/courses/CourseAction";
import CreatedCourse from "@/components/courses/CreatedCourse";
import useCRUD from "@/hooks/useCRUD";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { ICourseFullDetail, ICourseFullDetails, IOrderUpdatePayload, IOrderUpdateResponse, Mode } from "@/types/course";
import { fetchCourse, fetchOwnCourses, updateCourseOrder } from "@/api/course";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, closestCorners } from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";

const Courses = () => {
  const { params, create } = useCRUD();
  const [orderUpdatePayload, setOrderUpdatePayload] = useState<IOrderUpdatePayload[]>([]);

  // order update mutation
  const { mutate: orderUpdateMutation, isPending: orderUpdatePending } = useMutation<
    IOrderUpdateResponse,
    Error,
    IOrderUpdatePayload[]
  >({
    mutationKey: ["ModuleOrderUpdate"],
    mutationFn: updateCourseOrder,
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

  if (params.get("action") === "create") {
    return <CourseAction initialValues={InitialCourseValues} mode={Mode.Create} />;
  }

  if (params.get("action") === "edit") {
    return <EditCourse courseId={Number(params.get("id"))} />;
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex justify-between items-center my-4">
        <div>
          <h1 className="text-2xl font-medium">Courses</h1>
          <p className="text-sm hidden text-muted-foreground sm:block">View and manage courses</p>
        </div>
        <div className="flex gap-2 items-center">
          {orderUpdatePayload.length > 0 && (
            <Button disabled={orderUpdatePending} onClick={handleOrderUpdate} className="flex gap-2 items-center">
              {orderUpdatePending && <Loader2 className="animate-spin" />}
              Update Order
            </Button>
          )}
          <Button onClick={create}>
            <Plus /> Add Course
          </Button>
        </div>
      </div>
      <OwnCourses setOrderUpdatePayload={setOrderUpdatePayload} />
    </main>
  );
};

const OwnCourses = ({
  setOrderUpdatePayload,
}: {
  setOrderUpdatePayload: Dispatch<SetStateAction<IOrderUpdatePayload[]>>;
}) => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery<ICourseFullDetails[], Error>({
    queryKey: ["courses"],
    queryFn: fetchOwnCourses,
  });

  // Dnd
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id === over.id) return;

    if (data) {
      const activeIndex = data.findIndex((course) => course.order === active.id);
      const overIndex = data.findIndex((course) => course.order === over.id);

      const updatedData = arrayMove(data, activeIndex, overIndex);
      const updateOrder = updatedData.map((course, index) => ({ id: course.id, order: index + 1 }));
      queryClient.setQueryData(["courses"], () => updatedData);

      setOrderUpdatePayload(updateOrder);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>{error.message}</p>;
  }

  if (data?.length === 0) {
    return <NoCourses />;
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="grid gap-4">
        <SortableContext items={data ? data.map((course) => course.order) : []} strategy={verticalListSortingStrategy}>
          {data?.map((course) => (
            <CreatedCourse key={course.id} course={course} />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

const EditCourse = ({ courseId }: { courseId: number }) => {
  if (Number.isNaN(courseId)) {
    return <p className="p-2">Enter valid course id.</p>;
  }
  const { data, isLoading, isError, error } = useQuery<ICourseFullDetail, Error>({
    queryKey: ["course", `${courseId}`],
    queryFn: () => fetchCourse(courseId),
  });

  if (isLoading || data === undefined) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>{error.message}</p>;
  }

  return <CourseAction initialValues={data} mode={Mode.Edit} />;
};

const NoCourses = () => {
  return (
    <div
      className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
      x-chunk="dashboard-02-chunk-1"
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">You have no courses</h3>
        <p className="text-sm text-muted-foreground">You can start selling as soon as you add a course.</p>
        <Button className="mt-4">Add Course</Button>
      </div>
    </div>
  );
};

export default Courses;
