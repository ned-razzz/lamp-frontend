import { LuClock4, LuUsers, LuBookOpen, LuClock, LuMapPin, LuBuilding } from "react-icons/lu";
import { FaCircleInfo, FaRegHeart, FaHandsPraying, FaChurch } from "react-icons/fa6";
import { SiNaver } from "react-icons/si";
import { IconType } from "react-icons";
import React from "react";

const LandingPage = () => {
  return (
    <div className="relative pt-14">
      <Background />
      <HeroSection className="pb-32" />
      <VisionSection className="pb-16" />
      <ScheduleSection className="py-16" />
      <ChurchHistorySection />
    </div>
  );
};

const Background = () => {
  return (
    <div className="absolute top-0 w-full min-h-screen z-[-1] bg-gradient-to-b from-sky-100 to-white"></div>
  );
};

//처음 소개 페이지
const HeroSection = ({ className }: { className: string }) => {
  return (
    <section className={className}>
      <header>
        <h1 className="text-4xl/normal font-bold text-center mb-4">
          성경 말씀을 배우고
          <br />
          하나님의 말씀대로
          <br />
          실천하는 교회
        </h1>
        <p className="mx-10 mb-8 text-base text-center">
          모든 성도들이 말씀과 기도로 하나되어 하나님 나라를 이 땅에 세워가는 공동체입니다.
        </p>
        <div className="flex flex-col gap-4 justify-center items-center">
          <button className="w-40 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center">
            <FaCircleInfo size={20} className="mr-2" />
            교회 소개
          </button>
          <button className="w-40 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center">
            <LuClock4 size={20} className="mr-2" />
            예배 안내
          </button>
          <button className="w-40 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center">
            <SiNaver size={16} className="mr-2" />
            회원 등록
          </button>
        </div>
      </header>
    </section>
  );
};

const SectionHeader = ({
  children = null,
  title,
}: {
  children?: React.ReactNode;
  title: string;
}) => {
  return (
    <header className="mb-8">
      <h2 className="mb-2 text-4xl font-bold text-center">{title}</h2>
      <div className="mx-auto mb-6 w-20 h-1 bg-blue-500"></div>
      {children}
    </header>
  );
};

interface IVision {
  title: string;
  description: string;
  icon: IconType;
}

const VisionSection = ({ className }: { className: string }) => {
  const visionContents: IVision[] = [
    {
      title: "예배 중심",
      description:
        "하나님께 드리는 예배를 통해 은혜를 경험하고 말씀의 능력으로 변화되는 삶을 지향합니다.",
      icon: FaRegHeart,
    },
    {
      title: "공동체 성장",
      description: "서로 사랑하고 섬기며 함께 성장하는 건강한 교회 공동체를 추구합니다.",
      icon: LuUsers,
    },
    {
      title: "말씀 실천",
      description: "복음의 진리를 배우고 삶 속에서 실천하며 세상을 섬기는 제자의 삶을 살아갑니다.",
      icon: LuBookOpen,
    },
  ];

  return (
    <section className={className}>
      <SectionHeader title="Vision">
        <h3 className="text-lg font-semibold mb-4 text-center">마태복음 28:19-20</h3>
        <p className="px-8 text-gray-800 text-center text-base italic break-keep">
          &quot;그러므로 너희는 가서 모든 민족을 제자로 삼아 아버지와 아들과 성령의 이름으로 세례를
          베풀고 내가 너희에게 분부한 모든 것을 가르쳐 지키게 하라 볼지어다 내가 세상 끝날까지
          너희와 항상 함께 있으리라&quot;
        </p>
      </SectionHeader>

      <section className="px-6 flex flex-col gap-8">
        {visionContents.map((vision, index) => {
          return <VisionCard key={index} vision={vision}></VisionCard>;
        })}
      </section>
    </section>
  );
};

const VisionCard = ({ vision }: { vision: IVision }) => {
  return (
    <article className="p-4 rounded-xl bg-blue-50 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-600 text-white">
          <vision.icon size={32} />
        </div>
      </div>
      <h3 className="py-2 text-xl font-semibold text-center">{vision.title}</h3>
      <p className="text-gray-700 text-center">{vision.description}</p>
    </article>
  );
};

interface ISechdule {
  name: string;
  time: string;
  location: string;
  icon: IconType;
}

const ScheduleSection = ({ className }: { className: string }) => {
  // 예배 시간 데이터
  const schedules: ISechdule[] = [
    {
      name: "주일 예배",
      time: "매주 일요일 오전 11:00",
      location: "교회",
      icon: FaHandsPraying,
    },
    {
      name: "성경 공부",
      time: "매주 금요일 저녁 8:00",
      location: "각 구역별 장소",
      icon: LuUsers,
    },
  ];

  return (
    <section className={className}>
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionHeader title="Schedule">
          <p className="px-8 text-center text-gray-600">
            하나님을 경배하고 말씀을 나누는 소중한 시간에 여러분을 초대합니다. 함께 예배드리며
            은혜를 경험하세요.
          </p>
        </SectionHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {schedules.map((schedule, index) => (
            <ScheduleCard key={index} schedule={schedule} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ScheduleCard = ({ schedule }: { schedule: ISechdule }) => {
  return (
    <article className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex">
      <div className="mr-5 mt-1">
        <schedule.icon size={24} />
      </div>
      <div>
        <h3 className="mb-2 text-xl font-semibold text-gray-800">{schedule.name}</h3>
        <p className="mb-1 flex items-center text-gray-600">
          <LuClock size={18} className="mr-2" />
          <span>{schedule.time}</span>
        </p>
        <p className="flex items-center text-gray-600">
          <LuMapPin size={18} className="mr-2" />
          <span>{schedule.location}</span>
        </p>
      </div>
    </article>
  );
};

const ChurchHistorySection = () => {
  // 교회 연혁 데이터
  const historyEvents = [
    {
      year: "1995",
      title: "교회 설립",
      description: "5명의 성도와 함께 홍길동 목사의 인도로 가정에서 첫 예배를 드렸습니다.",
      icon: <FaChurch className="text-white" size={20} />,
    },
    {
      year: "1998",
      title: "첫 성전 건축",
      description: "성도 50명이 함께하는 교회로 성장하여 첫 성전을 건축하였습니다.",
      icon: <LuBuilding className="text-white" size={20} />,
    },
    {
      year: "2003",
      title: "교회학교 설립",
      description: "다음 세대를 위한 교회학교를 설립하고 주일학교 프로그램을 시작했습니다.",
      icon: <LuBookOpen className="text-white" size={20} />,
    },
    {
      year: "2008",
      title: "새 성전 이전",
      description: "성도 200명이 넘는 교회로 성장하여 더 넓은 현재의 성전으로 이전했습니다.",
      icon: <LuMapPin className="text-white" size={20} />,
    },
    {
      year: "2015",
      title: "해외 선교 시작",
      description: "아시아 지역을 중심으로 해외 선교 활동을 시작했습니다.",
      icon: <LuMapPin className="text-white" size={20} />,
    },
    {
      year: "2023",
      title: "교회 설립 28주년",
      description: "500명이 넘는 성도들과 함께 교회 설립 28주년 감사예배를 드렸습니다.",
      icon: <LuUsers className="text-white" size={20} />,
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <SectionHeader title="History">
          <p className="px-8 text-center text-gray-600">
            하나님의 인도하심으로 걸어온 우리 교회의 발자취입니다. 지난 역사를 통해 하나님의
            신실하심을 기억하고 미래를 향해 나아갑니다.
          </p>
        </SectionHeader>

        <div className="relative">
          {/* 수직 타임라인 라인 */}
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-1 bg-amber-400"></div>

          {/* 타임라인 이벤트 */}
          {historyEvents.map((event, index) => (
            <div key={index} className="relative flex mb-12 md:mb-16 pl-6 md:pl-12">
              {/* 타임라인 포인트 */}
              <div className="absolute left-0.5 transform -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 z-1">
                {event.icon}
              </div>

              {/* 이벤트 내용 */}
              <div className="pt-1 pl-2 pr-14 w-full">
                <div className="flex items-center mb-2">
                  <span className="font-bold text-xl text-amber-500 mr-3">{event.year}</span>
                  <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
                </div>
                <p className="text-gray-600">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
