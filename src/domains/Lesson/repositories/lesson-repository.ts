export class LessonRepository {
  public async saveLesson(content: string) {
    return {
      id: Date.now().toString(),
      content,
    };
  }
}

export const lessonRepository = new LessonRepository();
