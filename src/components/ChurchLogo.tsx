import { FaChurch } from "react-icons/fa6";
import Link from "next/link";

const ChurchLogo = () => {
  return (
    <div className="flex justify-center">
      <Link href="/" className="flex justify-normal items-center gap-2">
        <FaChurch size={30} />
        <h1 className="font-bold text-xl">용인 함박 교회</h1>
      </Link>
    </div>
  );
};
export default ChurchLogo;
