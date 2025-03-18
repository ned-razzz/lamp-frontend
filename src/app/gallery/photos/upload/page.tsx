"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoAdd, IoTrash, IoCloudUpload, IoArrowBack, IoClose } from "react-icons/io5";
import Image from "next/image";
import { createPhotos, PhotoBatchUpload, uploadPhotoFiles } from "../../actions";

interface PhotoFormData {
  title: string;
  description: string;
  photographer: string;
  takenAt: string;
  tagNames: string[];
  file: File | null;
}

interface PhotoFormProps {
  index: number;
  photoData: PhotoFormData;
  errors?: Record<string, string>;
  onChange: (index: number, fieldName: string, value: any) => void;
  onRemove: (index: number) => void;
}

// 글로벌 태그 컴포넌트
const GlobalTagsComponent = ({
  tags,
  onTagsChange,
  errors,
}: {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  errors?: string;
}) => {
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    if (tagInput.trim() === "" || tags.includes(tagInput.trim())) {
      setTagInput("");
      return;
    }

    const newTags = [...tags, tagInput.trim()];
    onTagsChange(newTags);
    setTagInput("");
  };

  const handleRemoveTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    onTagsChange(newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-center mb-2">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="태그 작성 후 Enter 입력"
          className={`flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-300 ${
            errors ? "border-red-500" : "border-gray-300"
          }`}
        />
      </div>

      {errors && <div className="text-red-500 text-sm mb-2">{errors}</div>}

      <div className="flex flex-wrap gap-2 mt-3">
        {tags.map((tag, index) => (
          <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
            <span className="mr-1">{tag}</span>
            <button
              type="button"
              onClick={() => handleRemoveTag(index)}
              className="text-gray-500 hover:text-red-500 focus:outline-none">
              <IoClose size={16} />
            </button>
          </div>
        ))}
        {tags.length === 0 && (
          <div className="text-gray-500 text-sm">태그가 없습니다. 태그를 추가해주세요.</div>
        )}
      </div>
    </div>
  );
};

// 개별 사진 폼 컴포넌트 (제목만 편집 가능)
const PhotoForm: React.FC<PhotoFormProps> = ({ index, photoData, errors, onChange, onRemove }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // 이미지 URL을 한 번만 생성하고 캐싱
  useEffect(() => {
    const url = URL.createObjectURL(photoData.file!);
    console.log(url);
    setImageUrl(url);

    // 컴포넌트가 언마운트될 때 URL 객체 해제
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [photoData.file]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(index, "title", e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow mb-2 overflow-hidden transform transition-all hover:shadow-md border border-gray-100">
      <div className="h-40 flex flex-row">
        {/* 미리보기 섹션 */}
        <div className="flex-1 basis-1/2 min-w-0 overflow-hidden relative flex-shrink-0 ">
          <span className="absolute z-40 size-6 rounded-tl-lg font-bold text-blue-600 bg-blue-200 flex justify-center items-center">
            {index + 1}
          </span>
          {imageUrl ? (
            <Image src={imageUrl} alt="미리보기" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-xs text-gray-400">이미지 없음</span>
            </div>
          )}
        </div>

        {/* 정보 입력 섹션 - 제목만 편집 가능 */}
        <div className="flex-1 basis-1/2 min-w-0 overflow-hidden p-2 text-base">
          <div className="flex justify-end items-center mb-3">
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-red-400 hover:text-red-600 transition-colors">
              <IoTrash size={20} />
            </button>
          </div>

          <div>
            <div className="flex items-center mb-0.5">
              <label htmlFor={`title-${index}`} className="font-medium text-gray-700 mr-1">
                제목*
              </label>
              {errors?.title && <span className="text-red-500">⚠️</span>}
            </div>
            <input
              type="text"
              id={`title-${index}`}
              name="title"
              value={photoData.title}
              onChange={handleTitleChange}
              className={`w-full p-1 text-base border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all ${
                errors?.title ? "border-red-500 focus:ring-red-500" : "border-gray-300"
              }`}
              placeholder="사진 제목 (3~30자)"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const BatchPhotoUploadPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadEnabled, setUploadEnabled] = useState(false);

  // 공통 태그
  const [globalTags, setGlobalTags] = useState<string[]>([]);
  const [tagErrors, setTagErrors] = useState<string>("");

  // 단일 사진의 기본 폼 데이터
  const defaultPhotoData: PhotoFormData = {
    title: "",
    description: "",
    photographer: "",
    takenAt: new Date().toISOString().slice(0, 16),
    tagNames: [],
    file: null,
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
  const handlePhotoDataChange = (photoIndex: number, fieldName: string, value: any) => {
    const newPhotosData = [...photosData];
    newPhotosData[photoIndex] = {
      ...newPhotosData[photoIndex],
      [fieldName]: value,
    };
    setPhotosData(newPhotosData);
  };

  // 여러 사진 파일을 한번에 선택
  const handleMultipleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);

      // 각 파일마다 새 사진 데이터 생성
      const newPhotosData = files.map((file) => {
        // 파일명에서 제목 생성 시도
        const fileName = file.name.replace(/\.[^/.]+$/, ""); // 확장자 제거
        const title = fileName.length > 30 ? fileName.substring(0, 27) + "..." : fileName;

        return {
          ...defaultPhotoData,
          title,
          file,
          fileId: 1, // 임시 값, 실제 업로드시 백엔드에서 할당
        };
      });

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

    // if (!validate()) {
    //   const errorCount = Object.keys(errors).length;
    //   let errorMessage = "";

    //   if (errorCount > 0) {
    //     errorMessage += `${errorCount}개의 사진에 오류가 있습니다. `;
    //   }

    //   if (globalTags.length === 0) {
    //     errorMessage += "태그를 최소 하나 이상 추가해주세요.";
    //   }

    //   alert(errorMessage || "오류가 있습니다. 수정 후 다시 시도해주세요.");
    //   return;
    // }

    setIsSubmitting(true);

    try {
      const files = photosData.map((photo) => photo.file!);

      const fileIds = await uploadPhotoFiles(files);

      const photos = photosData.map((photo, index) => ({
        title: photo.title,
        description: photo.description,
        photographer: photo.photographer,
        takenAt: new Date(photo.takenAt).toISOString(),
        fileId: fileIds[index],
      }));

      // 배치 업로드를 위한 데이터 준비 - 모든 사진에 globalTags 적용
      const batchPhotoData: PhotoBatchUpload = {
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

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* 앱 바 */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <button
            type="button"
            onClick={() => router.push("/gallery")}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <IoArrowBack size={20} />
          </button>
          <h1 className="text-xl font-medium">사진 일괄 업로드</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit}>
          {/* 글로벌 태그 컴포넌트 - 사진이 있을 때만 표시 */}

          {/* 사진 그리드 (고밀도) */}
          {photosData.length > 0 && (
            <>
              <div className="mb-6 grid grid-cols-1 gap-2">
                <h2 className="text-lg font-medium mb-2">업로드할 사진 ({photosData.length}개)</h2>
                {photosData.map((photoData, index) => (
                  <PhotoForm
                    key={index}
                    index={index}
                    photoData={photoData}
                    errors={errors[index]}
                    onChange={handlePhotoDataChange}
                    onRemove={removePhotoForm}
                  />
                ))}
              </div>
              <GlobalTagsComponent
                tags={globalTags}
                onTagsChange={handleGlobalTagsChange}
                errors={tagErrors}
              />
            </>
          )}

          {/* 파일 선택 카드 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleMultipleFiles}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                <div className="flex flex-col items-center">
                  <IoAdd size={40} className="text-blue-500 mb-2" />
                  <p className="text-blue-600 font-medium mb-1">파일 탐색기에서 사진 선택하기</p>
                </div>
              </div>
            </div>

            {photosData.length > 0 && (
              <div className="mt-4 bg-blue-50 text-blue-800 p-3 rounded-md flex items-center">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  <span className="font-bold">{photosData.length}</span>
                </div>
                <p>개의 사진이 추가되었습니다. 각 사진의 제목을 확인해주세요.</p>
              </div>
            )}
          </div>

          {/* 고정된 하단 업로드 버튼 */}
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 z-10">
            <div className="container mx-auto max-w-6xl flex flex-col items-center justify-between">
              <div className="text-sm">
                {photosData.length > 0 ? (
                  <span className="text-blue-600 font-medium">
                    {photosData.length}개의 사진 선택됨 ({globalTags.length}개의 태그 적용)
                  </span>
                ) : (
                  <span className="text-gray-500">업로드할 사진을 선택해주세요</span>
                )}
              </div>
              <div className="flex">
                <button
                  type="button"
                  onClick={() => router.push("/gallery")}
                  className="bg-transparent border border-gray-300 text-gray-700 py-2 px-6 rounded-md mr-3 hover:bg-gray-50 transition-colors">
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !uploadEnabled}
                  className={`py-2 px-6 rounded-md flex items-center ${
                    uploadEnabled
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  } transition-colors`}>
                  <IoCloudUpload size={20} className="mr-2" />
                  {isSubmitting ? "업로드 중..." : "업로드"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BatchPhotoUploadPage;
