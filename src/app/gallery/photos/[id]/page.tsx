import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { IoImage } from "react-icons/io5";

interface PhotoDetailPageProps {
  params: {
    id: string;
  };
}

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

async function getPhoto(id: string): Promise<Photo> {
  const response = await fetch(`http://localhost:8080/api/v1/photos/${id}`, {
    next: { revalidate: 60 }, // 캐시 유효 시간 60초
  });

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    throw new Error("Failed to fetch photo");
  }

  const data = await response.json();

  // 날짜 형식 변환
  return {
    ...data,
    takenAt: new Date(data.takenAt).toLocaleString(),
    created: new Date(data.created).toLocaleString(),
    updated: new Date(data.updated).toLocaleString(),
  };
}

const PhotoDetailPage = async ({ params }: PhotoDetailPageProps) => {
  const photo = await getPhoto(params.id);

  return (
    <div className="container mx-auto p-4">
      <PageHeader title="사진 상세" Icon={IoImage} />

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-96 w-full">
          <Image
            src={photo.fileUrl}
            alt={photo.title}
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{photo.title}</h1>
            <Link
              href={`/gallery/photos/${photo.id}/edit`}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
              수정
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">사진 정보</h2>
              <dl className="space-y-2">
                {photo.description && (
                  <>
                    <dt className="text-sm font-medium text-gray-500">설명</dt>
                    <dd className="text-gray-700 ml-2">{photo.description}</dd>
                  </>
                )}

                {photo.photographer && (
                  <>
                    <dt className="text-sm font-medium text-gray-500">촬영자</dt>
                    <dd className="text-gray-700 ml-2">{photo.photographer}</dd>
                  </>
                )}

                <dt className="text-sm font-medium text-gray-500">촬영일시</dt>
                <dd className="text-gray-700 ml-2">{photo.takenAt}</dd>
              </dl>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">메타데이터</h2>
              <dl className="space-y-2">
                <dt className="text-sm font-medium text-gray-500">ID</dt>
                <dd className="text-gray-700 ml-2">{photo.id}</dd>

                <dt className="text-sm font-medium text-gray-500">등록일</dt>
                <dd className="text-gray-700 ml-2">{photo.created}</dd>

                <dt className="text-sm font-medium text-gray-500">수정일</dt>
                <dd className="text-gray-700 ml-2">{photo.updated}</dd>
              </dl>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">태그</h2>
            <div className="flex flex-wrap gap-2">
              {photo.tagNames.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200">
            <Link href="/gallery" className="text-blue-500 hover:underline">
              ← 갤러리로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetailPage;
