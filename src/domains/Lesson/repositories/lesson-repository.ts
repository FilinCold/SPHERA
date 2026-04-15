export class LessonRepository {
  public async saveLesson(content: string, videoUrl: string | null) {
    return {
      id: Date.now().toString(),
      content,
      videoUrl,
    };
  }
}

export const lessonRepository = new LessonRepository();
