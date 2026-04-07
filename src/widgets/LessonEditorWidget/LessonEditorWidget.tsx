"use client";

import { observer } from "mobx-react-lite";

import { LessonEditor } from "@/shared/components/LessonEditor";
import { useStores } from "@/shared/store";

export const LessonEditorWidget = observer(() => {
  const { lessonStore } = useStores();

  return (
    <div>
      <LessonEditor value={lessonStore.content} onChange={lessonStore.setContent} />

      <button onClick={lessonStore.saveLesson}>Сохранить урок</button>

      <div>
        <h3>Сохранённые уроки:</h3>
        {lessonStore.lessons.map((lesson) => (
          <div key={lesson.id} dangerouslySetInnerHTML={{ __html: lesson.content }} />
        ))}
      </div>
    </div>
  );
});
