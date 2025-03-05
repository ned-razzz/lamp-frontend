"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { IoCamera } from "react-icons/io5";
import { TbLoader2 } from "react-icons/tb";

const GalleryPage = () => {
  return (
    <>
      <header>
        <div className="max-w-lg mx-4 mb-4 flex items-center">
          <IoCamera className="mr-2 text-blue-500" size={24} />
          <h1 className="text-xl font-bold text-gray-800">Gallery</h1>
        </div>
      </header>
      <div className="min-h-screen">
        <Gallery />
      </div>
    </>
  );
};

interface Photo {
  id: number;
  src: string;
  alt: string;
  title: string;
  description: string;
  date: Date;
}

const Gallery = () => {
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState<Photo[]>([]);

  // 사진 데이터 가져오기 (시뮬레이션)
  useEffect(() => {
    const fetchPhotos = async () => {
      // API 지연 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 샘플 사진 데이터
      const photoData: Photo[] = Array.from(
        { length: 16 },
        (_, i): Photo => ({
          id: i + 1,
          src: `/test1.png`,
          alt: `사진 ${i + 1}`,
          title: `사진 제목 ${i + 1}`,
          description: `사진 ${i + 1}에 대한 설명입니다.`,
          date: new Date(2024, i % 12, (i % 28) + 1),
        })
      );

      setPhotos(photoData);
      setLoading(false);
    };

    fetchPhotos();
  }, []);

  return <div>{loading ? <PhotoGridLoading /> : <PhotoGrid photos={photos} />}</div>;
};

const PhotoGridLoading = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <TbLoader2 className="animate-spin" size={80} color="blue" />
    </div>
  );
};

const PhotoGrid = ({ photos }: { photos: Photo[] }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {photos.map((photo) => (
        <div key={photo.id} className="relative pb-[100%]">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={200}
            height={200}
            priority={true}
            quality={50}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default GalleryPage;
