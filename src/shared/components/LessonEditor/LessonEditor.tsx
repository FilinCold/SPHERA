"use client";

import { useEffect, useRef } from "react";

import type QuillType from "quill";
import "quill/dist/quill.snow.css";

interface LessonEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function LessonEditor({ value, onChange }: LessonEditorProps) {
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

      quillRef.current.root.innerHTML = value;

      quillRef.current.on("text-change", () => {
        const html = quillRef.current?.root.innerHTML || "";

        onChange(html);
      });
    };

    initQuill();
  }, []);

  useEffect(() => {
    if (!quillRef.current) return;

    const currentHTML = quillRef.current.root.innerHTML;

    if (value !== currentHTML) {
      quillRef.current.root.innerHTML = value;
    }
  }, [value]);

  return (
    <div style={{ maxWidth: 800 }}>
      <div ref={editorRef}></div>
    </div>
  );
}
