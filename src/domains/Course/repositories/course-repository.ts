import type { Course } from "../model/course-model";

export class CourseRepository {
  public async getCourses(): Promise<Course[]> {
    const IMAGE = "/088a04fd-db67-47c4-a83a-53c0840d36f6.jpg";

    return [
      {
        id: "1",
        title: "React для начинающих",
        description: "Изучение основ React и компонентов",
        image: IMAGE,
        status: "active",
        studentsCount: 120,
        studentsAvatars: [IMAGE, IMAGE, IMAGE],
        courseUrl: "/courses/react",
      },
      {
        id: "2",
        title: "Next.js с нуля",
        description: "SSR, routing и production подход",
        image: IMAGE,
        status: "archived",
        studentsCount: 80,
        studentsAvatars: [IMAGE, IMAGE, IMAGE],
        courseUrl: "/courses/next",
      },
      {
        id: "3",
        title: "TypeScript практика",
        description: "Типизация в реальных проектах",
        image: IMAGE,
        status: "deleted",
        studentsCount: 45,
        studentsAvatars: [IMAGE, IMAGE, IMAGE],
        courseUrl: "/courses/ts",
      },
    ];
  }
}

export const courseRepository = new CourseRepository();
