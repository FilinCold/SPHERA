import Image from "next/image";
import React, { useState } from "react";

import styles from "@/shared/components/CoursePopup/CoursePopup.module.scss";

import type { CoursePopupProps, CourseData } from "./type";

export const CoursePopup = ({ onCancel, onSave }: CoursePopupProps) => {
  const [courseData, setCourseData] = useState<CourseData>({
    title: "",
    description: "",
    coverImage: "",
  });

  const [imagePreview, setImagePreview] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const imageUrl = reader.result as string;

        setImagePreview(imageUrl);
        setCourseData((prev) => ({
          ...prev,
          coverImage: imageUrl,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (courseData.title && courseData.description) {
      onSave(courseData);
      onCancel();
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>Создание курса</div>
      <div className={styles.body}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Название курса</label>
          <input
            type="text"
            name="title"
            placeholder="Введите название курса"
            value={courseData.title}
            onChange={handleInputChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Описание</label>
          <textarea
            name="description"
            placeholder="Введите описание курса"
            value={courseData.description}
            onChange={handleInputChange}
            className={styles.textarea}
            rows={4}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Обложка курса</label>
          <div className={styles.uploadWrapper}>
            <input
              type="text"
              placeholder="Добавить обложку курса"
              value={courseData.coverImage || ""}
              readOnly
              className={styles.uploadInput}
            />
            <label className={styles.uploadIcon}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 13V17C19 17.5304 18.7893 18.0391 18.4142 18.4142C18.0391 18.7893 17.5304 19 17 19H3C2.46957 19 1.96086 18.7893 1.58579 18.4142C1.21071 18.0391 1 17.5304 1 17V13M15 6L10 1M10 1L5 6M10 1V13"
                  stroke="#181D27"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className={styles.hiddenFileInput}
              />
            </label>
          </div>
          <div className={styles.helperText}>Оптимальные размеры 3200 x 410px</div>
          {imagePreview && (
            <div className={styles.imagePreview}>
              <Image
                src={imagePreview}
                alt="Preview"
                className={styles.previewImage}
                width={316}
                height={128}
              />
            </div>
          )}
        </div>
      </div>
      <div className={styles.footer}>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>
          Отмена
        </button>
        <button
          type="button"
          className={styles.saveButton}
          onClick={handleSave}
          disabled={!courseData.title || !courseData.description}
        >
          Сохранить
        </button>
      </div>
    </div>
  );
};

export default CoursePopup;
