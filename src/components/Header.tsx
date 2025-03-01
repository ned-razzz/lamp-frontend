import { FaChurch } from "react-icons/fa6";
import Nav from "./Nav";
import Link from "next/link";

const Header = () => {
  return (
    <div className="p-2 mb-4 border-b-2">
      <header className="flex justify-center">
        <Link href="/" className="flex justify-normal items-center gap-2">
          <FaChurch size={30} />
          <h1 className="font-bold text-xl">용인 함박 교회</h1>
        </Link>
      </header>
      <Nav />
    </div>
  );
};
export default Header;
