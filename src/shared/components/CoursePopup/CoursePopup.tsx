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
                width="52"
                height="52"
                viewBox="0 0 52 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_d_2002_21672)">
                  <rect
                    x="6.5"
                    y="5.2998"
                    width="39"
                    height="39"
                    rx="7.5"
                    stroke="#0B99C1"
                    shapeRendering="crispEdges"
                  />
                  <path
                    d="M25.043 16.8H18.043C17.5125 16.8 17.0038 17.0107 16.6288 17.3858C16.2537 17.7609 16.043 18.2696 16.043 18.8V32.8C16.043 33.3305 16.2537 33.8392 16.6288 34.2142C17.0038 34.5893 17.5125 34.8 18.043 34.8H32.043C32.5734 34.8 33.0821 34.5893 33.4572 34.2142C33.8323 33.8392 34.043 33.3305 34.043 32.8V25.8M32.543 15.3C32.9408 14.9022 33.4804 14.6787 34.043 14.6787C34.6056 14.6787 35.1451 14.9022 35.543 15.3C35.9408 15.6979 36.1643 16.2374 36.1643 16.8C36.1643 17.3626 35.9408 17.9022 35.543 18.3L26.043 27.8L22.043 28.8L23.043 24.8L32.543 15.3Z"
                    stroke="#181D27"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_d_2002_21672"
                    x="0"
                    y="-0.000195265"
                    width="52"
                    height="52"
                    filterUnits="userSpaceOnUse"
                    colorInterpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="1.2" />
                    <feGaussianBlur stdDeviation="3" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_2002_21672"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_2002_21672"
                      result="shape"
                    />
                  </filter>
                </defs>
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
              <Image src={imagePreview} alt="Preview" className={styles.previewImage} />
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
