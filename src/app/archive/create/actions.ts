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

// 태그 목록을 가져오는 서버 액션 (예시)
export async function getTags() {
  // 실제 구현에서는 외부 API 호출
  const tags = [
    { id: 1, name: "태그1" },
    { id: 2, name: "태그2" },
    { id: 3, name: "태그3" },
    // ... 기타 태그들
  ];

  return tags;
}
