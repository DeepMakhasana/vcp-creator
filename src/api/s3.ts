import { BASEURL } from "@/lib/axiosInstance";
import { endpoints } from ".";
import { IImageUploadPayload, IS3PutObjectPayload, IS3PutObjectResponse } from "@/types/course";
import axios from "axios";

export async function putOject(payload: IS3PutObjectPayload): Promise<IS3PutObjectResponse> {
  const { data } = await axios.post(`${BASEURL}${endpoints.s3.putObject}`, payload);
  return data;
}

export async function imageUpload({ url, payload }: IImageUploadPayload): Promise<any> {
  const { status } = await axios.put(url, payload.file, {
    headers: {
      "Content-Type": payload.fileType, // Required by S3 for correct file type
    },
  });
  return status;
}
