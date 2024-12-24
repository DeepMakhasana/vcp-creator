import { ICourseFullDetailResponse, ICourseFullDetails } from "@/types/course";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Trash, Edit, LinkIcon, SlidersHorizontal, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { clientEndpoints, courseImageBaseUrl } from "@/lib/constants";
import { formateDateTime } from "@/lib/utils";
import { Button } from "../ui/button";
import useCRUD from "@/hooks/useCRUD";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCourse } from "@/api/course";
import { toast } from "react-toastify";

const CreatedCourse = ({ course }: { course: ICourseFullDetails }) => {
  const navigate = useNavigate();
  const { edit } = useCRUD();
  const queryClient = useQueryClient();

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
  return (
    <Card className="flex flex-col md:flex-row">
      <CardHeader className="p-3">
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
        <div>
          <Link
            to={`/courses/${course.id}`}
            className="flex gap-2 justify-center items-center border rounded-lg px-4 py-2"
          >
            <LinkIcon className="h-4 w-4" />
            Preview
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatedCourse;
