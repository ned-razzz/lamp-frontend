"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { IoCreate } from "react-icons/io5";

interface PhotoEditPageProps {
  params: {
    id: string;
  };
}

interface Photo {
  id: number;
  title: string;
  description: string;
  photographer: string;
  takenAt: string;
  tagNames: string[];
  fileUrl: string;
  created: string;
  updated: string;
}

const PhotoEditPage = ({ params }: PhotoEditPageProps) => {
  const router = useRouter();
  const photoId = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    photographer: "",
    takenAt: "",
    tagNames: [""],
  });

  const [photo, setPhoto] = useState<Photo | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/photos/${photoId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch photo");
        }

        const data = await response.json();
        setPhoto(data);

        // ISO 문자열 형식으로 변환 (datetime-local 입력에 맞게)
        const takenAtDate = new Date(data.takenAt);
        const takenAtString = takenAtDate.toISOString().slice(0, 16);

        setFormData({
          title: data.title,
          description: data.description || "",
          photographer: data.photographer || "",
          takenAt: takenAtString,
          tagNames: data.tagNames.length > 0 ? data.tagNames : [""],
        });
      } catch (error) {
        console.error("Error fetching photo:", error);
        alert("사진 정보를 불러오는 데 실패했습니다.");
        router.push("/gallery");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhoto();
  }, [photoId, router]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "제목을 입력해주세요.";
    } else if (formData.title.length < 3 || formData.title.length > 30) {
      newErrors.title = "제목은 3~30자 사이여야 합니다.";
    }

    if (formData.description.length > 300) {
      newErrors.description = "설명은 300자 이내여야 합니다.";
    }

    if (formData.photographer.length > 30) {
      newErrors.photographer = "촬영자 이름은 30자 이내여야 합니다.";
    }

    if (formData.tagNames.length === 0 || !formData.tagNames[0]) {
      newErrors.tagNames = "최소 하나의 태그를 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tagNames];
    newTags[index] = value;
    setFormData((prev) => ({ ...prev, tagNames: newTags }));
  };

  const addTag = () => {
    setFormData((prev) => ({
      ...prev,
      tagNames: [...prev.tagNames, ""],
    }));
  };

  const removeTag = (index: number) => {
    const newTags = [...formData.tagNames];
    newTags.splice(index, 1);
    setFormData((prev) => ({ ...prev, tagNames: newTags }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        photographer: formData.photographer,
        takenAt: new Date(formData.takenAt).toISOString(),
        tagNames: formData.tagNames.filter((tag) => tag.trim() !== ""),
      };

      const response = await fetch(`http://localhost:8080/api/v1/photos/${photoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("사진 수정에 실패했습니다.");
      }

      router.push(`/gallery/photos/${photoId}`);
      router.refresh(); // 캐시된 데이터 갱신
    } catch (error) {
      console.error("Error updating photo:", error);
      alert("사진 수정 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`http://localhost:8080/api/v1/photos/${photoId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("사진 삭제에 실패했습니다.");
      }

      router.push("/gallery");
      router.refresh(); // 캐시된 데이터 갱신
    } catch (error) {
      console.error("Error deleting photo:", error);
      alert("사진 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <PageHeader title="사진 수정" Icon={IoCreate} />
        <div className="mt-8">로딩 중...</div>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="container mx-auto p-4 text-center">
        <PageHeader title="사진 수정" Icon={IoCreate} />
        <div className="mt-8">사진을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <PageHeader title="사진 수정" Icon={IoCreate} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="relative h-64 w-full mb-6">
            <Image src={photo.fileUrl} alt={photo.title} fill style={{ objectFit: "contain" }} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                제목 *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="사진 제목 (3~30자)"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                설명
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full p-2 border rounded ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="사진에 대한 설명 (최대 300자)"></textarea>
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="photographer"
                className="block text-sm font-medium text-gray-700 mb-1">
                촬영자
              </label>
              <input
                type="text"
                id="photographer"
                name="photographer"
                value={formData.photographer}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${
                  errors.photographer ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="촬영자 이름 (최대 30자)"
              />
              {errors.photographer && (
                <p className="text-red-500 text-xs mt-1">{errors.photographer}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="takenAt" className="block text-sm font-medium text-gray-700 mb-1">
                촬영일시
              </label>
              <input
                type="datetime-local"
                id="takenAt"
                name="takenAt"
                value={formData.takenAt}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">태그 *</label>
              {formData.tagNames.map((tag, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    className={`flex-grow p-2 border rounded ${
                      errors.tagNames ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="태그"
                  />
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="ml-2 bg-red-500 text-white p-2 rounded"
                    disabled={formData.tagNames.length === 1}>
                    삭제
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTag}
                className="bg-blue-500 text-white py-1 px-3 rounded text-sm">
                태그 추가
              </button>
              {errors.tagNames && <p className="text-red-500 text-xs mt-1">{errors.tagNames}</p>}
            </div>

            <div className="flex justify-between">
              <div>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                  disabled={isSubmitting || isDeleting}>
                  삭제
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => router.push(`/gallery/photos/${photoId}`)}
                  className="bg-gray-500 text-white py-2 px-4 rounded mr-2 hover:bg-gray-600 transition"
                  disabled={isSubmitting}>
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition disabled:bg-blue-300">
                  {isSubmitting ? "저장 중..." : "저장"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">사진 삭제 확인</h2>
            <p className="mb-6">정말로 이 사진을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
                disabled={isDeleting}>
                취소
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                disabled={isDeleting}>
                {isDeleting ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoEditPage;
