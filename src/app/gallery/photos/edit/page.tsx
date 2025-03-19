"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { TbLoader2 } from "react-icons/tb";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { Photo } from "../../types";

const GalleryEditPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // 사진 데이터 가져오기
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/photos");
        if (!response.ok) {
          throw new Error("Failed fetching photos");
        }

        const data: Photo[] = await response.json();

        setPhotos(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching photos:", error);
        setLoading(false);
      }
    })();
  }, []);

  // 사진 선택 처리
  const togglePhotoSelection = (photoId: number) => {
    setSelectedPhotos((prev) => {
      if (prev.includes(photoId)) {
        return prev.filter((id) => id !== photoId);
      } else {
        return [...prev, photoId];
      }
    });
  };

  // 선택한 사진 일괄 삭제
  const handleDeleteSelected = async () => {
    if (selectedPhotos.length === 0) return;

    if (!confirm(`선택한 ${selectedPhotos.length}개의 사진을 삭제하시겠습니까?`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch("http://localhost:8080/api/v1/photos/batch", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedPhotos),
      });

      if (!response.ok) {
        throw new Error("Failed to delete photos");
      }

      // 삭제 성공 후 목록에서 제거
      setPhotos((prev) => prev.filter((photo) => !selectedPhotos.includes(photo.id)));
      setSelectedPhotos([]);
      alert("선택한 사진이 삭제되었습니다.");
      router.push("/gallery");
    } catch (error) {
      console.error("Error deleting photos:", error);
      alert("사진 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative pb-16">
      {/* 앱바 */}
      <div className="border-b text-gray-500 flex items-center justify-between p-4">
        <div className="font-medium">삭제할 사진을 선택하세요</div>
        <div className="font-medium">편집 모드</div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <TbLoader2 className="animate-spin" size={80} color="blue" />
        </div>
      ) : (
        <>
          {/* 사진 그리드 */}
          <div className="grid grid-cols-3 gap-2 p-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative rounded-md aspect-square overflow-hidden "
                onClick={() => togglePhotoSelection(photo.id)}>
                <Image
                  src={photo.fileUrl}
                  alt={photo.title}
                  fill
                  sizes="20vw"
                  priority
                  quality={50}
                  className={`object-cover ${
                    selectedPhotos.includes(photo.id) ? "opacity-70" : ""
                  }`}
                />

                {/* 선택 표시 */}
                {selectedPhotos.includes(photo.id) && (
                  <div className="absolute top-2 right-2">
                    <IoIosCheckmarkCircle
                      size={28}
                      className="text-blue-600 bg-white rounded-full"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 사진이 없을 경우 */}
          {photos.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <p>등록된 사진이 없습니다.</p>
            </div>
          )}

          {/* 하단 삭제 버튼 */}
          <div className="fixed bottom-0 left-0 right-0 z-10 p-4 bg-white border-t">
            <div className="font-medium text-center mb-2">{selectedPhotos.length}개 선택됨</div>
            <button
              onClick={handleDeleteSelected}
              disabled={selectedPhotos.length === 0 || isDeleting}
              className={`w-full py-3 rounded-md flex items-center justify-center transition-colors ${
                selectedPhotos.length > 0
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}>
              {isDeleting ? (
                <TbLoader2 className="animate-spin mr-2" size={20} />
              ) : (
                <MdDelete size={20} className="mr-2" />
              )}
              {isDeleting ? "삭제 중..." : `선택한 사진 ${selectedPhotos.length}개 삭제하기`}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GalleryEditPage;
