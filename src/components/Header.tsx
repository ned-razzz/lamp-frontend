import ChurchLogo from "./ChurchLogo";
import Nav from "./Nav";

const Header = () => {
  return (
    <header className="sticky top-0 z-10 w-full bg-white p-2 mb-4 border-b-2">
      <ChurchLogo />
      <Nav />
    </header>
  );
};
export default Header;
