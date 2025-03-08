import Link from "next/link";

const Nav = () => {
  return (
    <nav>
      <ul className="flex justify-center items-center gap-2">
        <li>
          <Link href="/archive">Archive</Link>
        </li>
        <li>
          <Link href="/gallery">Gallery</Link>
        </li>
        <li>
          <Link href="/calendar">Calendar</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
