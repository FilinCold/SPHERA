"use client";

import { useState, useEffect, useCallback } from "react";

import type { SliderProps } from "@/components/Slider/types";

import styles from "./Slider.module.scss";

export default function Slider({
  slides,
  isDots = false,
  isButtons = false,
}: SliderProps & { isDots?: boolean; isButtons?: boolean }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);

  const goToSlide = useCallback((slideIndex: number) => {
    setCurrentSlide(slideIndex);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((current) => (current === slides.length - 1 ? 0 : current + 1));
  }, [slides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((current) => (current === 0 ? slides.length - 1 : current - 1));
  }, [slides]);

  const enableDrag = !isDots && !isButtons;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!enableDrag) return;
      setIsDragging(true);
      setDragStartX(e.clientX);
    },
    [enableDrag],
  );

  const handleMouseUp = useCallback(() => {
    if (!enableDrag || !isDragging) return;
    setIsDragging(false);
  }, [enableDrag, isDragging]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!enableDrag || !isDragging) return;

      const dragDistance = e.clientX - dragStartX;
      const threshold = 100;

      if (Math.abs(dragDistance) > threshold) {
        if (dragDistance > 0) {
          prevSlide();
        } else {
          nextSlide();
        }
        setIsDragging(false);
      }
    },
    [enableDrag, isDragging, dragStartX, prevSlide, nextSlide],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      }
      if (e.key === "ArrowRight") {
        nextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide]);

  useEffect(() => {
    if (!enableDrag) return;

    const handleGlobalMouseMove = (e: MouseEvent) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [enableDrag, handleMouseMove, handleMouseUp]);

  return (
    <div
      className={styles.slider}
      onMouseDown={enableDrag ? handleMouseDown : undefined}
      style={{ cursor: enableDrag ? "grab" : "default" }}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={styles.slide}
          style={{
            transform: `translateX(${100 * (index - currentSlide)}%)`,
          }}
        >
          <img src={slide.image} alt={slide.alt} className={styles.image} />
        </div>
      ))}

      {isButtons && (
        <>
          <button
            className={`${styles.sliderBtn} ${styles.sliderBtnLeft}`}
            onClick={prevSlide}
            aria-label="Предыдущий слайд"
          >
            &larr;
          </button>

          <button
            className={`${styles.sliderBtn} ${styles.sliderBtnRight}`}
            onClick={nextSlide}
            aria-label="Следующий слайд"
          >
            &rarr;
          </button>
        </>
      )}

      {isDots && (
        <div className={styles.dots}>
          {slides.map((_, index) => (
            <button
              key={index}
              className={`${styles.dotsDot} ${index === currentSlide ? styles.dotsDotActive : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Перейти к слайду ${index + 1}`}
              data-slide={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
