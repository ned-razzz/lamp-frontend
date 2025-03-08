import GalleryCompo from "@/components/GalleryCompo";
import { IoCamera } from "react-icons/io5";

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

const loadPhotos = async () => {
  const response = await fetch("http://localhost:8080/api/v1/photos");
  if (!response.ok) {
    throw new Error("Failed fetching photos");
  }
  const data: {
    id: number;
    title: string;
    description: string;
    photographer: string;
    takenAt: Date;
    tagNames: string[];
    fileUrl: string;
    created: Date;
    updated: Date;
  }[] = await response.json();

  // Date 객체를 ISO 문자열로 변환
  return data.map((photo) => ({
    ...photo,
    takenAt: photo.takenAt.toLocaleString(),
    created: photo.created.toLocaleString(),
    updated: photo.updated.toLocaleString(),
  }));
};

const GalleryPage = async () => {
  const photos: Photo[] = await loadPhotos();

  return (
    <>
      <header>
        <div className="p-4 flex items-center">
          <IoCamera className="mr-1" size={25} />
          <h1 className="text-xl font-bold">갤러리</h1>
        </div>
      </header>
      <div>
        <GalleryCompo photos={photos} />
      </div>
    </>
  );
};

export default GalleryPage;
