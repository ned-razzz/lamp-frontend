"use client";

import { useState } from "react";
import { createDocument, uploadDocumentFiles } from "./actions";

// 타입 정의
export interface DocumentFormData {
  title: string;
  description: string;
  authorName: string;
  tags: string[];
  files: File[];
}

export interface FormStatus {
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
}

// 폼 유효성 검증
const validateForm = (formData: DocumentFormData) => {
  if (!formData.title.trim()) {
    return "제목을 입력해주세요.";
  }
  if (!formData.authorName.trim()) {
    return "작성자 이름을 입력해주세요.";
  }
  if (formData.files.length === 0) {
    return "파일을 업로드해주세요.";
  }
  return null;
};

// 문서 폼 커스텀 훅
export function useDocumentForm() {
  const [formData, setFormData] = useState<DocumentFormData>({
    title: "",
    description: "",
    authorName: "",
    tags: [],
    files: [],
  });

  const [status, setStatus] = useState<FormStatus>({
    isSubmitting: false,
    error: null,
    success: false,
  });

  // 폼 필드 업데이트 함수
  const updateField = (name: keyof DocumentFormData, value: string | string[] | File[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 입력 필드 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateField(name as "title" | "description" | "authorName", value);
  };

  // 파일 변경 핸들러
  const handleFileChange = (files: File[]) => {
    updateField("files", files);
  };

  // 태그 추가 핸들러
  const addTag = (tag: string) => {
    const newTag = tag.trim();
    if (!newTag || formData.tags.includes(newTag)) {
      return;
    }
    updateField("tags", [...formData.tags, newTag]);
  };

  // 태그 제거 핸들러
  const removeTag = (tag: string) => {
    updateField(
      "tags",
      formData.tags.filter((t) => t !== tag)
    );
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ isSubmitting: true, error: null, success: false });

    // 폼 유효성 검증
    const validationError = validateForm(formData);
    if (validationError) {
      setStatus({ isSubmitting: false, error: validationError, success: false });
      return;
    }

    try {
      // 1. 먼저 파일 업로드
      console.debug(formData.files);
      const fileUploadResult = await uploadDocumentFiles(formData.files);

      if (!fileUploadResult.success) {
        console.error(fileUploadResult.error);
        throw new Error("파일 업로드를 실패하였습니다.");
      }

      // 파일 업로드 응답에서 fileIds를 추출
      const fileIds = fileUploadResult.data;

      // 2. 파일 업로드 성공 후 문서 생성
      const documentResult = await createDocument({
        creatorMemberId: 1,
        title: formData.title,
        description: formData.description,
        authorName: formData.authorName,
        tagNames: formData.tags,
        fileIds: fileIds,
      });

      if (!documentResult.success) {
        console.error(documentResult.error);
        throw new Error("문서 생성에 실패했습니다.");
      }

      // 성공 처리
      setStatus({ isSubmitting: false, error: null, success: true });
      // 폼 초기화
      setFormData({
        title: "",
        description: "",
        authorName: "",
        tags: [],
        files: [],
      });
    } catch (error) {
      setStatus({
        isSubmitting: false,
        error: error instanceof Error ? error.message : "처리 중 오류가 발생했습니다.",
        success: false,
      });
    }
  };

  return {
    formData,
    status,
    handleInputChange,
    handleFileChange,
    addTag,
    removeTag,
    handleSubmit,
  };
}
