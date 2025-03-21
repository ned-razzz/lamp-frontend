"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPhotos, uploadPhotoFiles } from "../../actions";
import { PhotoFormData, PhotoFormValue } from "../../types";
import { extractDateFromImage } from "@/utils/extractDataFromImage";

export const usePhotoUpload = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadEnabled, setUploadEnabled] = useState(false);

  // 공통 정보
  const [globalTags, setGlobalTags] = useState<string[]>([]);
  const [globalPhotographer, setGlobalPhotographer] = useState<string>("");
  const [tagErrors, setTagErrors] = useState<string>("");

  // 단일 사진의 기본 폼 데이터
  const defaultPhotoData: PhotoFormData = {
    title: "",
    description: "",
    photographer: "",
    tagNames: [],
  };

  // 여러 사진을 위한 데이터 배열
  const [photosData, setPhotosData] = useState<PhotoFormData[]>([]);

  // 각 사진별 오류 정보
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>({});

  // 업로드 가능 여부 확인
  useEffect(() => {
    // 사진이 있을 때만 태그 검사, 사진이 없으면 항상 false
    if (photosData.length > 0) {
      setUploadEnabled(globalTags.length > 0);
    } else {
      setUploadEnabled(false);
    }
  }, [photosData, globalTags]);

  // 공통 태그 변경 처리
  const handleGlobalTagsChange = (newTags: string[]) => {
    setGlobalTags(newTags);
    if (newTags.length > 0) {
      setTagErrors("");
    }
  };

  // 사진 폼 제거
  const removePhotoForm = (index: number) => {
    const newPhotosData = [...photosData];
    newPhotosData.splice(index, 1);
    setPhotosData(newPhotosData);

    const newErrors = { ...errors };
    delete newErrors[index];
    setErrors(newErrors);
  };

  // 폼 필드 변경 처리
  const handlePhotoDataChange = (photoIndex: number, fieldName: string, value: PhotoFormValue) => {
    const newPhotosData = [...photosData];
    newPhotosData[photoIndex] = {
      ...newPhotosData[photoIndex],
      [fieldName]: value,
    };
    setPhotosData(newPhotosData);
  };

  // 여러 사진 파일을 한번에 선택
  const handleMultipleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.debug("handleMultipleFiles executed");
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      e.target.value = ""; //input의 file 데이터 초기화, 이 작업이 있어야 onChange 이벤트가 정상적으로 작동동

      // 각 파일마다 새 사진 데이터 생성
      const newPhotosData = await Promise.all(
        files
          //JPG, PNG 파일만 적용
          .filter((file) => file.type === "image/jpeg" || file.type === "image/png")
          // 파일마다 PhotoFormData로 변환
          .map(async (file) => {
            const fileName = file.name.replace(/\.[^/.]+$/, ""); // 확장자 제거
            const title = fileName.length > 30 ? fileName.substring(0, 27) + "..." : fileName;
            const takenAt = await extractDateFromImage(file);

            return {
              ...defaultPhotoData,
              title,
              file,
              takenAt,
            };
          })
      );
      console.log(newPhotosData);

      setPhotosData([...photosData, ...newPhotosData]);
    }
  };

  // 모든 사진 폼 유효성 검사
  const validate = () => {
    const newErrors: Record<number, Record<string, string>> = {};
    let isValid = true;

    // 각 사진의 제목 검사
    photosData.forEach((photoData, index) => {
      const photoErrors: Record<string, string> = {};

      if (!photoData.title.trim()) {
        photoErrors.title = "제목을 입력해주세요.";
      } else if (photoData.title.length < 3 || photoData.title.length > 30) {
        photoErrors.title = "제목은 3~30자 사이여야 합니다.";
      }

      if (Object.keys(photoErrors).length > 0) {
        newErrors[index] = photoErrors;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (photosData.length === 0) {
      alert("업로드할 사진을 선택해주세요.");
      return;
    }

    if (!validate()) {
      const errorCount = Object.keys(errors).length;
      let errorMessage = "";

      if (errorCount > 0) {
        errorMessage += `${errorCount}개의 사진에 오류가 있습니다. `;
      }

      if (globalTags.length === 0) {
        errorMessage += "태그를 최소 하나 이상 추가해주세요.";
      }

      alert(errorMessage || "오류가 있습니다. 수정 후 다시 시도해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const files = photosData.map((photo) => photo.file!);

      const fileIds = await uploadPhotoFiles(files);

      const photos = photosData.map((photo, index) => ({
        title: photo.title,
        description: photo.description || "", // Use photo-specific description if it exists
        photographer: globalPhotographer, // Use global photographer for all
        takenAt: photo.takenAt ?? undefined,
        fileId: fileIds[index],
      }));

      // 배치 업로드를 위한 데이터 준비 - 모든 사진에 globalTags 적용
      const batchPhotoData = {
        creatorMemberId: 1,
        fileIds: fileIds,
        commonTagNames: globalTags,
        photos: photos,
      };

      await createPhotos(batchPhotoData);

      router.push("/gallery");
    } catch (error) {
      console.error("Error uploading photos:", error);
      alert("사진 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 글로벌 촬영자 정보 변경
  const handleGlobalPhotographerChange = (value: string) => {
    setGlobalPhotographer(value);
  };

  return {
    isSubmitting,
    uploadEnabled,
    globalTags,
    globalPhotographer,
    tagErrors,
    photosData,
    errors,
    handleGlobalTagsChange,
    handleGlobalPhotographerChange,
    removePhotoForm,
    handlePhotoDataChange,
    handleMultipleFiles,
    handleSubmit,
    router,
  };
};
