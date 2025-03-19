import { Photo } from "./types";

export interface PhotoBatchUpload {
  creatorMemberId: number;
  fileIds: number[];
  commonTagNames: string[];
  photos: {
    title: string;
    description: string;
    photographer: string;
    takenAt: string;
    fileId: number;
  }[];
}

// 문서 생성을 위한 서버 액션
export async function createPhotos(photos: PhotoBatchUpload) {
  const apiUrl = "api/v1/photos/batch";
  const response = await fetch(`http://localhost:8080/${apiUrl}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(photos),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(`POST /${apiUrl}: ` + errorData?.message);
  }
  return;
}

// 파일 업로드를 위한 서버 액션
export async function uploadPhotoFiles(files: File[]): Promise<number[]> {
  const apiUrl = "api/v1/files/photos/batch";
  // 여러 파일을 formData에 추가
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch(`http://localhost:8080/${apiUrl}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(`POST /${apiUrl}: ` + errorData?.message);
  }

  return response.json();
}

export const getPhoto = async (id: string): Promise<Photo> => {
  const apiUrl = `v1/photos/${id}`;
  const response = await fetch(`http://localhost:8080/api/${apiUrl}`, {
    next: { revalidate: 60 }, // 캐시 유효 시간 60초
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(`POST /${apiUrl}: ` + errorData?.message);
  }

  return response.json();
};

export const getPhotos = async (): Promise<Photo[]> => {
  const apiUrl = "v1/photos";
  const response = await fetch(`http://localhost:8080/api/${apiUrl}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(`POST /${apiUrl}: ` + errorData?.message);
  }

  return response.json();
};

export async function deletePhoto(id: number) {
  const response = await fetch(`http://localhost:8080/api/v1/photos/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete photo with id ${id}`);
  }

  return true;
}
