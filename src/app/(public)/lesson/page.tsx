"use client";

import dynamic from "next/dynamic";

const LessonEditorWidgetNoSSR = dynamic(() => import("@/widgets/LessonEditorWidget"), {
  ssr: false,
});

export default function LessonPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Создание урока</h1>
      <LessonEditorWidgetNoSSR />
    </div>
  );
}
