import CourseAction, { InitialCourseValues } from "@/components/courses/CourseAction";
import CreatedCourse from "@/components/courses/CreatedCourse";
import useCRUD from "@/hooks/useCRUD";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ICourseFullDetail, ICourseFullDetails, Mode } from "@/types/course";
import { fetchCourse, fetchOwnCourses } from "@/api/course";
import { useQuery } from "@tanstack/react-query";

const Courses = () => {
  const { params, create } = useCRUD();

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
        <div>
          <Button onClick={create}>
            <Plus /> Add Course
          </Button>
        </div>
      </div>
      <OwnCourses />
    </main>
  );
};

const OwnCourses = () => {
  const { data, isLoading, isError, error } = useQuery<ICourseFullDetails[], Error>({
    queryKey: ["courses"],
    queryFn: fetchOwnCourses,
  });

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
    <div className="grid gap-4">
      {data?.map((course) => (
        <CreatedCourse key={course.id} course={course} />
      ))}
    </div>
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
