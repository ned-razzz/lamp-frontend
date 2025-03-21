import { PageHeader } from "@/components/PageHeader";
import { IoCamera } from "react-icons/io5";

const GalleryLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <PageHeader title="갤러리" Icon={IoCamera} linkTo="/gallery" />
      {children}
    </>
  );
};

export default GalleryLayout;
