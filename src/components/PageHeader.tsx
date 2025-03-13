import { IconType } from "react-icons";

export const PageHeader = ({ title, Icon }: { title: string; Icon: IconType }) => (
  <header>
    <div className="max-w-lg p-4 flex items-center">
      <Icon className="mr-1" size={25} />
      <h1 className="font-bold text-xl">{title}</h1>
    </div>
  </header>
);
