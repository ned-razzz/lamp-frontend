import { PageHeader } from "@/components/PageHeader";
import { IoLibrarySharp } from "react-icons/io5";

const ArchiveLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <PageHeader title="자료실" Icon={IoLibrarySharp} />
      {children}
    </>
  );
};

export default ArchiveLayout;
