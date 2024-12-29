import { ICourseFullDetailResponse, ICourseFullDetails } from "@/types/course";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Trash, Edit, LinkIcon, SlidersHorizontal, Loader2, Grip } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { clientEndpoints, courseImageBaseUrl } from "@/lib/constants";
import { formateDateTime } from "@/lib/utils";
import { Button } from "../ui/button";
import useCRUD from "@/hooks/useCRUD";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCourse } from "@/api/course";
import { toast } from "react-toastify";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const CreatedCourse = ({ course }: { course: ICourseFullDetails }) => {
  const navigate = useNavigate();
  const { edit } = useCRUD();
  const queryClient = useQueryClient();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: course.order });

  // delete lesson mutation
  const { mutate, isPending } = useMutation<ICourseFullDetailResponse, Error, number>({
    mutationKey: ["CourseAction"],
    mutationFn: deleteCourse,
    onSuccess: (res) => {
      queryClient.setQueryData(["courses"], (old: ICourseFullDetails[]) =>
        old.filter((course) => course.id !== res.course.id)
      );
      toast(res.message);
    },
    onError: (error: any) => {
      console.log("request fail: ", error);
      toast(error?.response?.data?.message, { type: "error" });
    },
  });

  function deleteCourseHandle(id: number) {
    mutate(id);
  }

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
    <Card className="flex flex-col md:flex-row" ref={setNodeRef} style={style} {...attributes}>
      <CardHeader className="p-3 min-h-36 bg-slate-100">
        <img
          src={`${courseImageBaseUrl}${course.image}`}
          alt={course.title}
          className="w-full max-h-64 min-h-36 object-cover rounded bg-slate-300"
        />
      </CardHeader>
      <CardContent className="p-3 flex gap-3 justify-between w-full flex-col sm:flex-row">
        <div>
          <h2 className="mb-2 text-lg font-medium">{course?.title}</h2>
          <p className="mt-2 mb-4 line-clamp-4 text-sm text-muted-foreground">
            {Number(course?.price) <= 0 ? "FREE" : `₹ ${course?.price}.00`}
          </p>
          <p className="mt-2 mb-4 line-clamp-4 text-sm text-muted-foreground">
            <b>Last updated:</b> {formateDateTime(course.updatedAt)}
          </p>
          <div className="flex gap-2">
            <Button variant={"default"} onClick={() => navigate(`${clientEndpoints.course.main}/${course.id}/modules`)}>
              <SlidersHorizontal />
              Manage
            </Button>
            <Link to={`/courses/${course.id}`}>
              <Button variant={"outline"}>
                <LinkIcon className="h-4 w-4" />
                Preview
              </Button>
            </Link>
            <Button variant={"outline"} size={"icon"} onClick={() => edit(String(course.id))}>
              <Edit />
            </Button>
            {isPending ? (
              <Button disabled size={"icon"}>
                <Loader2 className="animate-spin" />
              </Button>
            ) : (
              <Button variant={"outline"} size={"icon"} onClick={() => deleteCourseHandle(course.id)}>
                <Trash />
              </Button>
            )}
          </div>
          {/* <div className="border rounded-lg px-3 py-1 inline text-sm text-muted-foreground">Manage</div> */}
        </div>
        <div className="h-full flex justify-center items-center">
          <Button variant={"outline"} size={"icon"} {...listeners}>
            <Grip />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatedCourse;
