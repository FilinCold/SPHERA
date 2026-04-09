"use client";

import Uploady, { useUploady } from "@rpldy/uploady";
import {
  useItemProgressListener,
  useItemFinishListener,
  useItemErrorListener,
} from "@rpldy/uploady";
import { observer } from "mobx-react-lite";

import { LessonEditor } from "@/shared/components/LessonEditor";
import { LessonView } from "@/shared/components/LessonView";
import { useStores } from "@/shared/store";

const EditorWithUpload = () => {
  const { lessonStore } = useStores();
  const uploady = useUploady();

  const handleVideoClick = () => {
    lessonStore.startUpload();
    uploady.showFileUpload();
  };

  useItemProgressListener((item) => {
    lessonStore.setUploadProgress(item.completed);
  });

  useItemFinishListener((item) => {
    const url = URL.createObjectURL(item.file as File);

    lessonStore.finishUpload(url);
  });

  useItemErrorListener(() => {
    lessonStore.setError("Ошибка загрузки видео");
  });

  return (
    <>
      <LessonEditor
        key={lessonStore.editorKey}
        value={lessonStore.content}
        onChange={lessonStore.setContent}
        onVideoClick={handleVideoClick}
      />

      {lessonStore.isUploading && <div>Загрузка видео: {lessonStore.uploadProgress}%</div>}

      {lessonStore.videoUrl && <video width={400} controls src={lessonStore.videoUrl} />}

      {lessonStore.error && <div style={{ color: "red" }}>{lessonStore.error}</div>}
    </>
  );
};

export const LessonEditorWidget = observer(() => {
  const { lessonStore } = useStores();

  return (
    <Uploady destination={{ url: "/upload" }}>
      <EditorWithUpload />

      <button onClick={lessonStore.saveLesson} style={{ marginTop: 10 }}>
        Сохранить урок
      </button>

      <div style={{ marginTop: 20 }}>
        <h3>Сохранённые уроки:</h3>

        {lessonStore.lessons.map((lesson) => (
          <div key={lesson.id} style={{ marginBottom: 24 }}>
            <LessonView content={lesson.content} videoUrl={lesson.videoUrl} />
          </div>
        ))}
      </div>
    </Uploady>
  );
});
