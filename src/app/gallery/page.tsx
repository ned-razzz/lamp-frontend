"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { IoCamera } from "react-icons/io5";
import { TbLoader2 } from "react-icons/tb";
import { IoIosCloseCircle } from "react-icons/io";

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
          src: `/test3.png`,
          alt: `사진 ${i + 1}`,
          title: `사진 제목 ${i + 1}`,
          description: `사진 ${
            i + 1
          } : Ad sit id cillum incididunt ullamco laborum amet ipsum dolor veniam. Aute consequat adipisicing ad irure nostrud consectetur veniam irure et elit et. Nisi ut elit sunt quis magna mollit sit.`,
          date: new Date(2024, i % 12, (i % 28) + 1),
        })
      );

      setPhotos(photoData);
      setLoading(false);
    };

    fetchPhotos();
  }, []);

  const [seletedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const openDetail = (photo: Photo) => {
    setSelectedPhoto(photo);
  };
  const closeDetail = () => {
    setSelectedPhoto(null);
  };

  return (
    <div>
      {loading ? (
        <PhotoGridLoading />
      ) : (
        <div>
          <PhotoGrid photos={photos} onClickPhoto={openDetail} />
          {seletedPhoto ? <PhotoDetail photo={seletedPhoto} onClose={closeDetail} /> : null}
        </div>
      )}
    </div>
  );
};

const PhotoGridLoading = () => {
  return (
    <section className="flex items-center justify-center h-64">
      <TbLoader2 className="animate-spin" size={80} color="blue" />
    </section>
  );
};

const PhotoGrid = ({
  photos,
  onClickPhoto: clickPhoto,
}: {
  photos: Photo[];
  onClickPhoto: (photo: Photo) => void;
}) => {
  return (
    <section className="grid grid-cols-3 gap-2">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="relative pb-[100%]"
          onClick={() => {
            clickPhoto(photo);
          }}>
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
    </section>
  );
};

const PhotoDetail = ({ photo, onClose }: { photo: Photo; onClose: () => void }) => {
  return (
    <section className="fixed inset-0 z-50 bg-black bg-opacity-85">
      <div className="w-full h-full flex flex-col md:flex-row items-stretch ">
        <section className="relative basis-40 md:basis-60 p-4 bg-black bg-opacity-50 text-white ">
          <h3 className="text-lg font-bold">{photo.title}</h3>
          <p className="mt-3 text-sm">{photo.description}</p>
          <p className="text-xs text-gray-300 mt-1">{photo.date.toDateString()}</p>
          <button
            className="absolute top-2 right-2 z-10 w-10 h-10"
            onClick={() => {
              onClose();
            }}>
            <IoIosCloseCircle className="w-full h-full" />
          </button>
        </section>
        <section className="grow relative">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            quality={100}
            className="absolute inset-0 object-contain"
          />
        </section>
      </div>
    </section>
  );
};

export default GalleryPage;
