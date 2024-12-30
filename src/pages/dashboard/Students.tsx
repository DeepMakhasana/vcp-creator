import { fetchCreatorUser } from "@/api/auth";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useAuthContext from "@/context/auth/useAuthContext";
import { formateDateTime } from "@/lib/utils";
import { CreatorUser } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";

const Students = () => {
  const { user } = useAuthContext();
  const { data, isLoading, isError, error } = useQuery<CreatorUser[], Error>({
    queryKey: ["users"],
    queryFn: () => fetchCreatorUser(Number(user?.id)),
    enabled: !!user,
  });

  if (isLoading || data === undefined) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  return (
    <main className="p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-medium">Students</h1>
        <p className="text-sm hidden text-muted-foreground sm:block">View the student list</p>
      </div>

      <Table className="my-8">
        <TableCaption>A list of students</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20px]">Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Number</TableHead>
            <TableHead className="text-center">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.id}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.mobile}</TableCell>
              <TableCell className="text-center">{formateDateTime(student.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
};

export default Students;
