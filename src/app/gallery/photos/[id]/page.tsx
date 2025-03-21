// src/app/gallery/photos/[id]/page.tsx
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { IoImage } from "react-icons/io5";
import { getPhoto } from "@/app/gallery/actions";
import PhotoDetail from "./components";

interface PhotoDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PhotoDetailPage({ params }: PhotoDetailPageProps) {
  try {
    const { id } = await params;
    const photo = await getPhoto(id);
    console.log(photo);

    return (
      <div className="container mx-auto p-4">
        <PageHeader title="사진 상세" Icon={IoImage} />
        <PhotoDetail photo={photo} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching photo:", error);
    notFound();
  }
}
