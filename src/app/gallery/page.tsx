import GalleryGrid from "@/app/gallery/components";
import { Photo } from "./types";

const loadPhotos = async (): Promise<Photo[]> => {
  const response = await fetch("http://localhost:8080/api/v1/photos");
  if (!response.ok) {
    throw new Error("Failed fetching photos");
  }
  return response.json();
};

const GalleryPage = async () => {
  const photos: Photo[] = await loadPhotos();

  return (
    <>
      <div>
        <GalleryGrid photos={photos} />
      </div>
    </>
  );
};

export default GalleryPage;
