import Link from "next/link";
import { IconType } from "react-icons";

interface PageHeaderProps {
  title: string;
  Icon: IconType;
  linkTo?: string;
}

export const PageHeader = ({ title, Icon, linkTo }: PageHeaderProps) => {
  // 헤더 내용을 감싸는 컴포넌트
  const HeaderContent = () => (
    <div className="flex items-center py-4">
      <Icon className="text-blue-500 text-2xl mr-2 group-hover:text-blue-700 transition" />
      <h1 className="text-2xl font-bold group-hover:text-blue-700 transition">{title}</h1>
    </div>
  );

  // linkTo 속성이 있으면 Link로 감싸고, 없으면 div로 반환
  return (
    <div className="bg-white shadow mb-6">
      <div className="container mx-auto px-4">
        <Link href={linkTo ?? "#"} className="group cursor-pointer inline-block">
          <HeaderContent />
        </Link>
      </div>
    </div>
  );
};
