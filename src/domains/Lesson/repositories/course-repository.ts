import type { Lesson } from "../model/lesson-model";

export class CourseRepository {
  public async saveLesson(lesson: Lesson): Promise<Lesson> {
    return {
      ...lesson,
    };
  }
}

export const courseRepository = new CourseRepository();
