import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).max(70, { message: "maximum 70 character is allow." }),
  description: z.string().min(1, { message: "Description is required" }),
  price: z.preprocess(
    (value) => (typeof value === "string" ? parseInt(value) : value),
    z
      .number()
      .min(0, { message: "Price must be a positive number or zero for free" })
      .positive({ message: "Price must be a positive number or zero for free" })
  ),
  duration: z.preprocess(
    (value) => (typeof value === "string" ? parseInt(value) : value),
    z
      .number()
      .min(1, { message: "Course Duration must be at list 1 Day" })
      .positive({ message: "Duration must be a positive number grater then equal to 1" })
  ),
  highlights: z.string().min(1, { message: "Highlights are required" }),
  outcomes: z.string().min(1, { message: "Outcomes are required" }),
  prerequisites: z.string().min(1, { message: "Prerequisites are required" }),
  image: z.string({ message: "Cover image is required" }).min(1, { message: "Cover image is required" }),
});
