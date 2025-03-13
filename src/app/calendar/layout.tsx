import { PageHeader } from "@/components/PageHeader";
import { FaCalendarAlt } from "react-icons/fa";

const CalendarLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <PageHeader title="교회 일정" Icon={FaCalendarAlt} />
      {children}
    </>
  );
};

export default CalendarLayout;
