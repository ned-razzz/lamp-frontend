import { Document } from "@/app/archive/types";

export async function getDocument(id: number): Promise<Document> {
  const apiUrl = `v1/documents/${id}`;

  const response = await fetch(`http://localhost:8080/api/${apiUrl}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(`POST /${apiUrl}: ` + errorData?.message);
  }

  return response.json();
}

// 문서 생성을 위한 서버 액션
export async function createDocument(documentData: {
  creatorMemberId: number;
  title: string;
  description: string;
  authorName: string;
  tagNames: string[];
  fileIds: number[];
}) {
  const apiUrl = "api/v1/documents";
  try {
    const response = await fetch(`http://localhost:8080/${apiUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(documentData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`POST /${apiUrl}: ` + errorData?.message);
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : `POST /${apiUrl}`,
    };
  }
}

// 파일 업로드를 위한 서버 액션
export async function uploadDocumentFiles(files: File[]) {
  const apiUrl = "api/v1/files/documents/batch";
  try {
    // 여러 파일을 formData에 추가
    const fileData = new FormData();
    files.forEach((file) => {
      fileData.append("files", file);
    });

    const response = await fetch(`http://localhost:8080/${apiUrl}`, {
      method: "POST",
      body: fileData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`POST /${apiUrl}: ` + errorData?.message);
    }

    return { success: true, data: await response.json() };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : `POST /${apiUrl}`,
    };
  }
}

// 문서를 업데이트하는 함수
export async function updateDocument(
  id: number,
  documentData: {
    title: string;
    description: string;
    authorName: string;
    tagNames: string[];
  }
) {
  const apiUrl = `api/v1/documents/${id}`;
  try {
    const response = await fetch(`http://localhost:8080/${apiUrl}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(documentData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`PUT /${apiUrl}: ${errorData?.message || response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : `PUT /${apiUrl}`,
    };
  }
}

export async function deleteDocument(id: number) {
  const apiUrl = `v1/documents/${id}`;

  const response = await fetch(`http://localhost:8080/api/${apiUrl}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(`DELETE /${apiUrl}: ` + errorData?.message);
  }

  return;
}
