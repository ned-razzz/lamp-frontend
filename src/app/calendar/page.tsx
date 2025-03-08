"use client";
import React, { useState } from "react";
import { LuChevronLeft, LuChevronRight, LuX } from "react-icons/lu";
import { TbEdit } from "react-icons/tb";

const CalendarPage = () => {
  return (
    <div>
      <h1>Calendar Page</h1>
      <CalendarComponent />
    </div>
  );
};

const CalendarComponent = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([
    { id: 1, date: "2025-03-03", title: "회의", time: "09:00 ~ 10:00" },
    { id: 2, date: "2025-03-04", title: "일정3", time: "14:00 ~ 15:30" },
    { id: 3, date: "2025-03-04", title: "일정4", time: "16:00 ~ 17:00" },
  ]);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const renderCalendarHeader = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;

    return (
      <div className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-lg">
        <button
          className="p-2 hover:bg-blue-700 rounded-full transition-colors"
          onClick={handlePrevMonth}>
          <LuChevronLeft size={24} />
        </button>
        <div className="text-xl font-medium">
          {year}년 {month}월
        </div>
        <button
          className="p-2 hover:bg-blue-700 rounded-full transition-colors"
          onClick={handleNextMonth}>
          <LuChevronRight size={24} />
        </button>
      </div>
    );
  };

  const renderDayNames = () => {
    const days = ["1", "2", "3", "4", "5", "6", "7"];

    return (
      <div className="grid grid-cols-7 text-center bg-blue-50">
        {days.map((day, index) => (
          <div key={index} className="py-3 font-medium text-blue-800">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const startingDayOfWeek = firstDayOfMonth.getDay();
    const days = [];

    // Fill in the days
    for (let i = 0; i < 42; i++) {
      const dayIndex = i - startingDayOfWeek + 1;

      if (dayIndex > 0 && dayIndex <= daysInMonth) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayIndex).padStart(
          2,
          "0"
        )}`;
        const dayEvents = events.filter((event) => event.date === dateStr);
        const isSelected = selectedDate === dateStr;

        days.push(
          <div
            key={i}
            className={`h-24 p-2 relative hover:bg-blue-50 transition-colors cursor-pointer ${
              isSelected ? "bg-blue-100" : ""
            }`}
            onClick={() => setSelectedDate(dateStr)}>
            <div
              className={`absolute top-2 left-2 w-6 h-6 flex items-center justify-center rounded-full ${
                isSelected ? "bg-blue-600 text-white" : ""
              }`}>
              {dayIndex}
            </div>
            <div className="mt-8 overflow-hidden h-12">
              {dayEvents.length > 0 && (
                <>
                  <div className="mb-1">
                    <div className="bg-blue-500 text-white text-xs rounded px-2 py-1 inline-block shadow-sm truncate max-w-full">
                      {dayEvents[0].title}
                    </div>
                  </div>
                  {dayEvents.length > 1 && (
                    <div className="text-blue-600 text-xs font-medium">
                      ... 외 {dayEvents.length - 1}개
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );
      } else {
        days.push(<div key={i} className="h-24 bg-gray-50"></div>);
      }
    }

    return <div className="grid grid-cols-7">{days}</div>;
  };

  const renderMonthlyEventList = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    const monthStr = String(month).padStart(2, "0");

    // Filter events for the current month
    const monthEvents = events.filter((event) => event.date.startsWith(`${year}-${monthStr}`));

    // Sort events by date
    monthEvents.sort((a, b) => {
      const dateA = new Date(a.date + "T" + a.time.split(" ~ ")[0]);
      const dateB = new Date(b.date + "T" + b.time.split(" ~ ")[0]);
      return dateA - dateB;
    });

    return (
      <div className="mt-6">
        {monthEvents.map((event) => {
          const eventDate = new Date(event.date);
          const day = eventDate.getDate();

          return (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-md mb-4 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="font-medium text-lg">{event.title}</div>
                <div className="flex">
                  <button className="mr-2 p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <TbEdit size={18} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <LuX size={18} className="text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="text-sm font-medium text-blue-600">
                  {day}일 {event.time}
                </div>
                <div className="border-t my-3"></div>
                <div className="text-sm text-gray-600 h-12"></div>
              </div>
            </div>
          );
        })}

        {monthEvents.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            이번 달 일정이 없습니다.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-100 py-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div>
          {renderCalendarHeader()}
          {renderDayNames()}
          {renderDays()}
        </div>

        <div className="p-4 bg-gray-50">{renderMonthlyEventList()}</div>
      </div>
    </div>
  );
};

export default CalendarPage;
