"use client";

import { useEffect, useRef } from "react";

import type QuillType from "quill";
import "quill/dist/quill.snow.css";

export default function LessonEditor() {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<QuillType | null>(null);

  useEffect(() => {
    const initQuill = async () => {
      const Quill = (await import("quill")).default;

      if (!editorRef.current) return;

      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Введите описание урока",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline"],
            ["link", "image"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["clean"],
          ],
        },
      });
    };

    initQuill();
  }, []);

  return (
    <div style={{ maxWidth: 800 }}>
      <div ref={editorRef}></div>
    </div>
  );
}
