"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { TbLoader2 } from "react-icons/tb";
import { IoIosCloseCircle } from "react-icons/io";

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

const GalleryCompo = ({ photos }: { photos: Photo[] }) => {
  const [loading, setLoading] = useState(true);

  // 사진 데이터 가져오기 (시뮬레이션)
  useEffect(() => {
    (async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setLoading(false);
    })();
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
            src={photo.fileUrl}
            alt="no load"
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
          <p className="text-xs text-gray-300 mt-1">{photo.takenAt}</p>
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
            src={photo.fileUrl}
            alt="no load"
            fill
            quality={100}
            className="absolute inset-0 object-contain"
          />
        </section>
      </div>
    </section>
  );
};

export default GalleryCompo;
