import { MdEdit } from "react-icons/md";
import Link from "next/link";
import { Photo, Tag } from "../types";
import { getPhotos, getPhotoTags } from "../actions";
import { SearchableGallery } from "./searchable-gallery";

const GalleryPage = async () => {
  // 서버 사이드에서 초기 데이터 불러오기
  const photos: Photo[] = await getPhotos();
  const tags: Tag[] = await getPhotoTags();

  return (
    <>
      <div className="relative">
        <SearchableGallery initialPhotos={photos} initialTags={tags} />

        {/* 편집 버튼 (우측 하단에 고정) */}
        <div className="fixed bottom-4 right-4 z-10">
          <Link
            href="/gallery/photos/edit"
            className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all">
            <MdEdit size={24} />
          </Link>
        </div>
      </div>
    </>
  );
};

export default GalleryPage;
