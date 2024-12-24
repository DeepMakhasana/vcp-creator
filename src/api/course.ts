import axiosInstance from "@/lib/axiosInstance";
import { endpoints } from ".";
import {
  ICourseFullDetail,
  ICourseFullDetailResponse,
  ICourseFullDetails,
  ILessonPayload,
  ILessonResponse,
  IModule,
  IModuleResponse,
  Lesson,
  Module,
} from "@/types/course";

export async function createCourse(payload: ICourseFullDetail): Promise<ICourseFullDetailResponse> {
  const { data } = await axiosInstance.post(endpoints.course.main, payload);
  return data;
}

export async function updateCourse(payload: ICourseFullDetail): Promise<ICourseFullDetailResponse> {
  const courseId = payload.id;
  delete payload.id;
  const { data } = await axiosInstance.put(`${endpoints.course.main}/${courseId}`, payload);
  return data;
}

export async function deleteCourse(id: number): Promise<ICourseFullDetailResponse> {
  const { data } = await axiosInstance.delete(`${endpoints.course.main}/${id}`);
  return data;
}

export async function fetchCourse(id: number): Promise<ICourseFullDetail> {
  const { data } = await axiosInstance.get(`${endpoints.course.main}/${id}`);
  return data.course;
}

export async function fetchOwnCourses(): Promise<ICourseFullDetails[]> {
  const { data } = await axiosInstance.get(endpoints.course.own);
  return data.courses;
}

export async function createModule(payload: IModule): Promise<IModuleResponse> {
  const { data } = await axiosInstance.post(endpoints.module.main, payload);
  return data;
}

export async function fetchCourseModule(id: number): Promise<Module[]> {
  const { data } = await axiosInstance.get(`${endpoints.module.main}/${id}`);
  return data.modules;
}

export async function updateModule(payload: IModule): Promise<IModuleResponse> {
  const moduleId = payload.id;
  delete payload.id;
  const { data } = await axiosInstance.put(`${endpoints.module.main}/${moduleId}`, payload);
  return data;
}

export async function deleteModule(id: number): Promise<IModuleResponse> {
  const { data } = await axiosInstance.delete(`${endpoints.module.main}/${id}`);
  return data;
}

export async function fetchModuleLesson(id: number): Promise<Lesson[]> {
  const { data } = await axiosInstance.get(`${endpoints.lesson.moduleLessons}/${id}`);
  return data.lessons;
}

export async function createLesson(payload: ILessonPayload): Promise<ILessonResponse> {
  const { data } = await axiosInstance.post(endpoints.lesson.main, payload);
  return data;
}

export async function updateLesson(payload: ILessonPayload): Promise<ILessonResponse> {
  const lessonId = payload.id;
  delete payload.id;
  const { data } = await axiosInstance.put(`${endpoints.lesson.main}/${lessonId}`, payload);
  return data;
}

export async function deleteLesson(id: number): Promise<ILessonResponse> {
  const { data } = await axiosInstance.delete(`${endpoints.lesson.main}/${id}`);
  return data;
}
