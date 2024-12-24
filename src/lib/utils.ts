import { ICourse, LessonType, ModuleType } from "@/types/course";
import { StudentType } from "@/types/student";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formateDateTime(isoDate: Date | string, onlyDate: boolean = false): string {
  const date = new Date(isoDate);

  if (onlyDate) {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  return formatter.format(date);
}

export const coursesData: ICourse[] = [
  {
    id: "docker",
    title: "Docker: Containerization for Modern Development",
    description:
      "In this course, you'll learn how to build, ship, and run applications using containers. We cover all key concepts, including containers, images, networking, volumes, Dockerfile, Docker Compose, AWS ECS and ECR, and auto-scaling. Perfect for developers, IT pros, and teams looking to simplify workflows and boost scalability. Start mastering Docker and modern development today with hands-on projects and real-world examples.",
    author: "Priyus Garg",
    price: 899.0,
    image:
      "https://learn.piyushgarg.dev/_next/image?url=https%3A%2F%2Fdcaj3bhl5hivm.cloudfront.net%2F__courses%2Fbcfa1456-e84f-4483-8cb6-f8cd98a728dc%2FCOURSE_IMAGE%2Fdocker-image-FLlCmt.png&w=640&q=75",
  },
  {
    id: "nextjs",
    title: "Master NextJS 14",
    description:
      'Welcome to "Mastering Next.js 14 Course" a comprehensive course designed to elevate your skills in developing modern web applications using Next.js version 14.',
    author: "Sandipt Gupta",
    price: 1899.0,
    image:
      "https://learn.piyushgarg.dev/_next/image?url=https%3A%2F%2Fdcaj3bhl5hivm.cloudfront.net%2F__courses%2Fbcfa1456-e84f-4483-8cb6-f8cd98a728dc%2FCOURSE_IMAGE%2Fdocker-image-FLlCmt.png&w=640&q=75",
  },
  {
    id: "javascript",
    title: "Javascript in Hindi",
    description:
      "In this course, we will take you on a journey from the very basics of JavaScript to more advanced concepts, equipping you with the knowledge and skills needed to build dynamic web applications. Whether you are a beginner with no prior coding experience or an experienced developer looking to expand your skill set, this course is designed to cater to learners of all levels.",
    author: "Rohit Nisad",
    price: 0.0,
    image:
      "https://learn.piyushgarg.dev/_next/image?url=https%3A%2F%2Fdcaj3bhl5hivm.cloudfront.net%2F__courses%2Fbcfa1456-e84f-4483-8cb6-f8cd98a728dc%2FCOURSE_IMAGE%2Fdocker-image-FLlCmt.png&w=640&q=75",
  },
  {
    id: "nodejs",
    title: "Master NodeJS - Hindi",
    description:
      "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows developers to run JavaScript on the server side, creating server-side applications with JavaScript.",
    author: "Priyus Garg",
    price: 999.0,
    image:
      "https://learn.piyushgarg.dev/_next/image?url=https%3A%2F%2Fdcaj3bhl5hivm.cloudfront.net%2F__courses%2Fbcfa1456-e84f-4483-8cb6-f8cd98a728dc%2FCOURSE_IMAGE%2Fdocker-image-FLlCmt.png&w=640&q=75",
  },
  {
    id: "kafka",
    title: "Kafka mastering",
    description:
      "In this course, you'll learn how to build, ship, and run applications using containers. We cover all key concepts, including containers, images, networking, volumes, Dockerfile, Docker Compose, AWS ECS and ECR, and auto-scaling. Perfect for developers, IT pros, and teams looking to simplify workflows and boost scalability. Start mastering Docker and modern development today with hands-on projects and real-world examples.",
    author: "Deep Makhasana",
    price: 899.0,
    image:
      "https://learn.piyushgarg.dev/_next/image?url=https%3A%2F%2Fdcaj3bhl5hivm.cloudfront.net%2F__courses%2Fbcfa1456-e84f-4483-8cb6-f8cd98a728dc%2FCOURSE_IMAGE%2Fdocker-image-FLlCmt.png&w=640&q=75",
  },
  {
    id: "java",
    title: "Master Java with spring boot",
    description:
      "In this course, you'll learn how to build, ship, and run applications using containers. We cover all key concepts, including containers, images, networking, volumes, Dockerfile, Docker Compose, AWS ECS and ECR, and auto-scaling. Perfect for developers, IT pros, and teams looking to simplify workflows and boost scalability. Start mastering Docker and modern development today with hands-on projects and real-world examples.",
    author: "Priyus Garg",
    price: 899.0,
    image:
      "https://learn.piyushgarg.dev/_next/image?url=https%3A%2F%2Fdcaj3bhl5hivm.cloudfront.net%2F__courses%2Fbcfa1456-e84f-4483-8cb6-f8cd98a728dc%2FCOURSE_IMAGE%2Fdocker-image-FLlCmt.png&w=640&q=75",
  },
];

export const courseModules: ModuleType[] = [
  {
    id: 1,
    courseId: 1,
    title: "Introduction to docker",
    lessonsCount: 4,
  },
  {
    id: 2,
    courseId: 1,
    title: "Docker images",
    lessonsCount: 6,
  },
  {
    id: 3,
    courseId: 1,
    title: "Docker container",
    lessonsCount: 2,
  },
  {
    id: 4,
    courseId: 1,
    title: "Docker orchetaion",
    lessonsCount: 7,
  },
  {
    id: 5,
    courseId: 1,
    title: "Docker file",
    lessonsCount: 3,
  },
];

export const courseLessons: LessonType[] = [
  {
    id: 1,
    moduleId: 1,
    title: "Why use docker?",
    duration: 4,
  },
  {
    id: 2,
    moduleId: 1,
    title: "How to install and use docker images",
    duration: 6,
  },
  {
    id: 3,
    moduleId: 1,
    title: "How to build docker container",
    duration: 2,
  },
  {
    id: 4,
    moduleId: 1,
    title: "Why docker orchetaion is use",
    duration: 7,
  },
  {
    id: 5,
    moduleId: 1,
    title: "How to create docker compose file",
    duration: 3,
  },
];

export const students: StudentType[] = Array(8)
  .fill(0)
  .map((_, i) => ({
    id: i + 1,
    name: `test${i + 1}`,
    email: `test${i + 1}@gmail.com`,
    number: `908765432${i + 1}`,
    purchaseCount: parseInt(String(Math.random() * 10)),
  }));
