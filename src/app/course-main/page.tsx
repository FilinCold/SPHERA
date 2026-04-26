import { CourseCard } from "@/shared/components/CourseCard/CourseCard";
import type { CourseCardProps } from "@/shared/components/CourseCard/types";
import TitleBar from "@/shared/components/TitleBar/TitleBar";

type CourseListItem = CourseCardProps & { id: string };

const courses: CourseListItem[] = Array.from({ length: 4 }, (_, index) => ({
  id: `course-${index + 1}`,
  title: "Супер курс",
  description: "Lorem ipsum dolor sit amet...",
  image: "https://picsum.photos/403/300",
  status: "active" as const,
  usersCount: 89,
  date: "20.02.2026",
  link: "#",
  users: [],
}));

/*
// Пример реальной загрузки курсов на страницу (вместо мокового массива выше)
const [courses, setCourses] = useState<CourseCardProps[]>([]);

useEffect(() => {
  const fetchCourses = async () => {
    const response = await fetch("/api/courses", { method: "GET" });
    if (!response.ok) throw new Error("Не удалось загрузить курсы");
    const data = (await response.json()) as CourseCardProps[];
    setCourses(data);
  };

  fetchCourses();
}, []);
*/

export default function CourseMainPage() {
  return (
    <>
      <TitleBar />
      {courses.map(({ id, ...course }) => (
        <CourseCard key={id} {...course} />
      ))}
    </>
  );
}
