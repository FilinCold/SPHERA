import CourseEditor from "@/widgets/CourseEditor";

interface CoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page(props: CoursePageProps) {
  const { id } = await props.params;

  return <CourseEditor courseId={id} />;
}
