"use client";

import { IoAdd, IoCloudUpload, IoArrowBack } from "react-icons/io5";
import { GlobalFormComponent, PhotoForm } from "./components";
import { usePhotoUpload } from "./hooks";

const BatchPhotoUploadPage = () => {
  const {
    isSubmitting,
    uploadEnabled,
    globalTags,
    globalPhotographer,
    globalTakenAt,
    tagErrors,
    photosData,
    errors,
    handleGlobalTagsChange,
    handleGlobalPhotographerChange,
    handleGlobalTakenAtChange,
    removePhotoForm,
    handlePhotoDataChange,
    handleMultipleFiles,
    handleSubmit,
    router,
  } = usePhotoUpload();

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

      {/* 파일 선택 카드 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <div className="relative">
          <input
            type="file"
            accept="image/png, image/jpeg"
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

      <div className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit}>
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
              <GlobalFormComponent
                tags={globalTags}
                photographer={globalPhotographer}
                takenAt={globalTakenAt}
                onTagsChange={handleGlobalTagsChange}
                onPhotographerChange={handleGlobalPhotographerChange}
                onTakenAtChange={handleGlobalTakenAtChange}
                errors={tagErrors}
              />
            </>
          )}

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
