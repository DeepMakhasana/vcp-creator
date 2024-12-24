import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { students } from "@/lib/utils";

const Students = () => {
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
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Number</TableHead>
            <TableHead className="text-center">Purchase count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.id}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.number}</TableCell>
              <TableCell className="text-center">{student.purchaseCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
};

export default Students;
