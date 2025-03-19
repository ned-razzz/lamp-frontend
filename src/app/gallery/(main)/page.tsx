import { GalleryGrid } from "./components";
import Link from "next/link";
import { MdEdit } from "react-icons/md";
import { Photo } from "../types";
import { getPhotos } from "../actions";

const GalleryPage = async () => {
  const photos: Photo[] = await getPhotos();

  return (
    <>
      <div className="relative">
        <GalleryGrid photos={photos} />

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
