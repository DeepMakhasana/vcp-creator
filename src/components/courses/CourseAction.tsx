import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Loader2 } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import TextEditor from "./text-editer";
import imagePlaceholder from "../../assets/placeholder.svg";
import { courseSchema } from "@/schema/course";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  ICourseFullDetail,
  ICourseFullDetailResponse,
  ICourseFullDetails,
  IImageUploadPayload,
  IS3PutObjectPayload,
  IS3PutObjectResponse,
  Mode,
} from "@/types/course";
import { createCourse, updateCourse } from "@/api/course";
import { imageUpload, putOject } from "@/api/s3";
import { useNavigate } from "react-router-dom";
import { courseImageBaseUrl } from "@/lib/constants";

export const InitialCourseValues: ICourseFullDetail = {
  title: "",
  description: "",
  price: "",
  duration: "",
  highlights: "",
  outcomes: "",
  prerequisites: "",
  image: "",
  status: false,
};

const CourseAction = ({
  initialValues = InitialCourseValues,
  mode,
}: {
  initialValues: ICourseFullDetail;
  mode: Mode;
}) => {
  const [isNextStep, setIsNextStep] = useState(false);
  const [title, setTitle] = useState<string>(initialValues.title);
  const [description, setDescription] = useState<string>(initialValues.description);
  const [price, setPrice] = useState<number | string>(initialValues.price);
  const [duration, setDuration] = useState<number | string>(initialValues.duration);
  const [highlights, setHighlights] = useState<string>(initialValues.highlights);
  const [outcomes, setOutcomes] = useState<string>(initialValues.outcomes);
  const [prerequisites, setPrerequisites] = useState<string>(initialValues.prerequisites);

  const [file, setFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>(initialValues.image);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function validateImageSize(size: number) {
    const MAX_SIZE = 2 * 1024 * 1024; // 2 MB in bytes
    if (size <= MAX_SIZE) {
      return true; // Image size is valid
    } else {
      return false; // Image size exceeds 2 MB
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    console.log("file", file);
    if (file) {
      // Only proceed if the file is an image
      if (file.type.startsWith("image/")) {
        setFile(file);
        const reader = new FileReader();

        reader.onloadend = () => {
          setImagePreview(reader.result as string); // FileReader result is a string (Data URL)
          setUploadedFileName("");
        };

        reader.readAsDataURL(file); // Read the file as Data URL
      } else {
        setImagePreview(null); // Reset preview if the file is not an image
      }
    } else {
      setFile(null);
      setImagePreview(null);
      toast("You can only upload image file like png, jpg, jpeg or svg");
    }
  };

  // create course mutation
  const { mutate: createCourseMutate, isPending } = useMutation<ICourseFullDetailResponse, Error, ICourseFullDetail>({
    mutationKey: ["courseAction"],
    mutationFn: mode === Mode.Create ? createCourse : updateCourse,
    onSuccess: (res) => {
      handleDiscard();
      queryClient.setQueryData(["courses"], (old: ICourseFullDetails[]) =>
        mode === Mode.Create
          ? old.length == 0
            ? [res.course]
            : [...old, res.course]
          : old.map((course) => (course.id === res.course.id ? res.course : course))
      );
      toast(res.message);
      navigate("/dashboard/courses");
    },
    onError: (error: any) => {
      console.log("request fail: ", error);
      toast(error?.response?.data?.message, { type: "error" });
    },
  });

  // upload file in s3 mutation
  const { mutate: imageUploadToS3tMutate, isPending: isPendingImageUpload } = useMutation<
    any,
    Error,
    IImageUploadPayload
  >({
    mutationKey: ["courseImageUpload"],
    mutationFn: imageUpload,
    onSuccess: (res) => {
      console.log("file upload status: ", res);
      const payload: ICourseFullDetail = {
        title,
        description,
        price: Number(price),
        duration: Number(duration),
        status: false,
        highlights,
        outcomes,
        prerequisites,
        image: initialValues?.image === uploadedFileName ? initialValues.image : uploadedFileName,
      };

      // Add `id` only if the mode is not `Mode.Create`
      if (mode !== Mode.Create) {
        payload.id = initialValues.id;
      }

      createCourseMutate(payload);
    },
    onError: (error: any) => {
      console.log("request fail: ", error);
      toast("try again file not uploaded.");
    },
  });

  // generate presigned URL for file upload mutation
  const { mutate: imagePresignedURLPutObjetMutate, isPending: isPendingPresignedURL } = useMutation<
    IS3PutObjectResponse,
    Error,
    IS3PutObjectPayload
  >({
    mutationKey: ["generatePresignedURL"],
    mutationFn: putOject,
    onSuccess: (res) => {
      imageUploadToS3tMutate({
        url: res.url,
        payload: {
          file: file as File,
          fileType: file?.type as string,
        },
      });
    },
    onError: (error: any) => {
      console.log("request fail: ", error);
      toast(error?.response?.data?.message, { type: "error" });
    },
  });

  const handleDiscard = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setDuration("");
    setPrerequisites("");
    setHighlights("");
    setOutcomes("");

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input value
      setImagePreview(null);
      setFile(null);
    }
    setIsNextStep(false);
    setUploadedFileName("");
  };

  const handleOnSubmit = () => {
    const result = courseSchema.safeParse({
      title,
      description,
      price: Number(price ? price : 0),
      duration: Number(duration),
      status: false,
      highlights,
      outcomes,
      prerequisites,
      image: file?.name || initialValues.image,
    });

    console.log(result);
    if (!result.success) {
      // Extract validation errors
      const errors = result.error.errors.map((err) => err.message);

      // Display errors using a toast
      toast(
        <div>
          <strong>Validation Errors:</strong>
          <ul className="list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>,
        { type: "error" }
      );
    } else {
      if (uploadedFileName === initialValues.image && initialValues.image) {
        const payload: ICourseFullDetail = {
          id: initialValues.id,
          title,
          description,
          price: Number(price),
          duration: Number(duration),
          status: false,
          highlights,
          outcomes,
          prerequisites,
          image: uploadedFileName,
        };
        createCourseMutate(payload);
      } else {
        // Proceed with valid data
        if (!validateImageSize(file?.size as number)) {
          console.log("Invalid file size.");
          toast("Invalid file size, size must be less then 2 MB.", { type: "error" });
        } else {
          console.log("Validated data:", result.data);

          const type = `${file?.type}`.split("/");
          const updateFileName = mode === Mode.Edit ? initialValues.image : `${Date.now()}-${title}.${type[1]}`;
          setUploadedFileName(updateFileName);

          if (updateFileName && file) {
            console.log("valid");
            imagePresignedURLPutObjetMutate({
              fileName: updateFileName,
              fileType: file?.type as string,
              bucket: "vpc-public",
            });
          }
        }
      }
    }
  };

  return (
    <main className="grid flex-1 my-4 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      {/* <div className="mx-auto grid flex-1 auto-rows-max gap-4"> */}
      <div className="flex items-center gap-4 py-4">
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-medium tracking-tight sm:grow-0">
          {Mode.Create === mode ? "Create" : "Update"} Course
        </h1>
        <Badge variant="outline" className="ml-auto sm:ml-0">
          {Mode.Create === mode ? "New" : "Edit"}
        </Badge>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          {isNextStep ? (
            <Button variant="outline" onClick={() => setIsNextStep(false)}>
              Previous
            </Button>
          ) : (
            <Button variant="outline" onClick={handleDiscard}>
              Discard
            </Button>
          )}
          {isPending || isPendingImageUpload || isPendingPresignedURL ? (
            <Button disabled>
              <Loader2 className="animate-spin" />
              {isPendingImageUpload || isPendingPresignedURL ? "Uploading" : "Creating"}
            </Button>
          ) : isNextStep ? (
            <Button onClick={handleOnSubmit}>{Mode.Create === mode ? "Create" : "Edit"}</Button>
          ) : (
            <Button onClick={() => setIsNextStep(true)}>Next</Button>
          )}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          {!isNextStep ? (
            <Card x-chunk="dashboard-07-chunk-0">
              <CardHeader>
                <CardTitle className="font-medium">Courses Details</CardTitle>
                <CardDescription>Main details of course, All fields are required.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="name">Title</Label>
                    <Input
                      autoComplete="off"
                      id="name"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full"
                      placeholder="Course title"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Course description"
                      className="min-h-32"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="name">Price</Label>
                    <Input
                      autoComplete="off"
                      id="name"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full"
                      placeholder="499"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="name">Duration</Label>
                    <Input
                      autoComplete="off"
                      id="name"
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full"
                      placeholder="In Day"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card x-chunk="dashboard-07-chunk-1">
              <CardHeader>
                <CardTitle className="font-medium">More Details</CardTitle>
                <CardDescription>Explanation of course using some points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="prerequisites">Prerequisites</Label>
                    <TextEditor value={prerequisites} setValue={setPrerequisites} />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="highlights">Highlights</Label>
                    <TextEditor value={highlights} setValue={setHighlights} />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="outcomes">Learning Outcomes</Label>
                    <TextEditor value={outcomes} setValue={setOutcomes} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
            <CardHeader>
              <CardTitle className="font-medium">Courses Image</CardTitle>
              <CardDescription>Upload main thumbnail image</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <img
                  alt="Courses image"
                  className="aspect-square w-full max-h-64 rounded-md object-contain"
                  src={
                    mode === Mode.Edit
                      ? imagePreview
                        ? imagePreview
                        : `${courseImageBaseUrl}${uploadedFileName}`
                      : imagePreview
                      ? imagePreview
                      : imagePlaceholder
                  }
                />
                <div>
                  {mode === Mode.Edit && (
                    <p className="text-red-500  p-2 text-sm">
                      Course cover image must have a .{uploadedFileName.split(".").pop()} file extension if you want to
                      update.
                    </p>
                  )}
                  <div className="flex items-center space-x-2">
                    <Input id="name" type="file" ref={fileInputRef} className="w-full" onChange={handleFileChange} />
                  </div>
                  {mode === Mode.Create && (
                    <p className="text-muted-foreground text-sm p-2">
                      Upload image file must be png, jpg, jpeg or svg and 640px X 360px size.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 md:hidden">
        {isNextStep ? (
          <Button variant="outline" onClick={() => setIsNextStep(false)}>
            Previous
          </Button>
        ) : (
          <Button variant="outline" onClick={handleDiscard}>
            Discard
          </Button>
        )}
        {isPending || isPendingImageUpload || isPendingPresignedURL ? (
          <Button disabled>
            <Loader2 className="animate-spin" />
            {isPendingImageUpload || isPendingPresignedURL ? "Uploading" : "Creating"}
          </Button>
        ) : isNextStep ? (
          <Button onClick={handleOnSubmit}>{Mode.Create === mode ? "Create" : "Edit"}</Button>
        ) : (
          <Button onClick={() => setIsNextStep(true)}>Next</Button>
        )}
      </div>
      {/* </div> */}
    </main>
  );
};

export default CourseAction;
