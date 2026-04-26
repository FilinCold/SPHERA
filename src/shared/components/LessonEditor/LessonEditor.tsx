"use client";

import { useEffect, useRef } from "react";

import styles from "./LessonEditor.module.scss";

import type { LessonEditorProps } from "./type";
import type QuillType from "quill";
import "quill/dist/quill.snow.css";

export function LessonEditor(props: LessonEditorProps) {
  const { value, onChange, onVideoClick } = props;

  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<QuillType | null>(null);

  const isInternalChange = useRef(false);

  useEffect(() => {
    const initQuill = async () => {
      const Quill = (await import("quill")).default;

      if (!editorRef.current || quillRef.current) return;

      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Введите описание урока",
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline"],
              [{ color: [] }, { background: [] }],
              ["link", "image", "video"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["clean"],
            ],
            handlers: {
              video: () => onVideoClick?.(),
            },
          },
        },
      });

      if (value) {
        quillRef.current.clipboard.dangerouslyPasteHTML(value);
      }

      quillRef.current.on("text-change", () => {
        if (isInternalChange.current) return;

        const html = quillRef.current?.root.innerHTML || "";

        if (html === "<p><br></p>") {
          onChange("");
        } else {
          onChange(html);
        }
      });
    };

    initQuill();
  }, []);

  useEffect(() => {
    if (!quillRef.current) return;

    const html = quillRef.current.root.innerHTML;

    if (value === html || (!value && html === "<p><br></p>")) {
      return;
    }

    isInternalChange.current = true;

    if (!value) {
      quillRef.current.setText("");
    } else {
      quillRef.current.clipboard.dangerouslyPasteHTML(value);
    }

    setTimeout(() => {
      isInternalChange.current = false;
    }, 0);
  }, [value]);

  return (
    <div className={styles.editorShell}>
      <div ref={editorRef} className={styles.editor} />
    </div>
  );
}
