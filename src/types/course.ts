export interface ICourse {
  id: string;
  image: string;
  title: string;
  description: string;
  author: string;
  price: number;
}

export interface IModule {
  id?: number;
  courseId: number;
  title: string;
}

export interface ILessonPayload {
  id?: number;
  isVideo: boolean;
  title: string;
  moduleId?: number;
}

export type LessonType = {
  id?: number;
  title: string;
  duration: number;
  video_url?: string;
  moduleId?: number;
};

export interface ICourseFullDetail {
  id?: number;
  title: string;
  description: string;
  price: number | string;
  image: string;
  highlights: string;
  outcomes: string;
  prerequisites: string;
  status: boolean;
}

export enum Mode {
  Create = "create",
  Edit = "edit",
}

export interface ICourseFullDetails extends ICourseFullDetail {
  id: number;
  creatorId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICourseFullDetailResponse {
  message: string;
  course: ICourseFullDetails;
}

export interface IModuleResponse {
  message: string;
  module: IModule;
}

export interface ILessonResponse {
  message: string;
  lesson: Lesson;
}

export interface IS3PutObjectResponse {
  url: string;
}

export interface IS3PutObjectPayload {
  fileName: string;
  fileType: string;
  bucket: string;
}

export interface IImageUploadPayload {
  url: string;
  payload: {
    file: File;
    fileType: string;
  };
}

// module
export interface Video {
  id: number;
  lessonId: number;
  createdAt: string;
  updatedAt: string;
  resourceId: string;
}

export interface Task {
  id: number;
  lessonId: number;
  createdAt: string;
  updatedAt: string;
  resourceId: string;
}

export interface Lesson {
  id: number;
  title: string;
  moduleId: number;
  isVideo: boolean;
  video: Video | null;
  tasks: Task[];
}

export interface Module {
  id: number;
  title: string;
  courseId: number;
  createdAt: string;
  lessons: Lesson[];
}
