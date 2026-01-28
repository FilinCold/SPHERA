// Слайдер из задачи №49
// что реализовано:
// клики по кнопкам влево/вправо 
// клик на точку для перехода к конкретному слайду
// клики по клаве влево/вправо 
// бесконечная прокрутка - переход с последнего на первый и наоборот



"use client";

import { useState, useEffect, useCallback } from 'react';
import styles from './Slider.module.scss';

interface Slide {
  id: number;
  image: string;
  alt: string;
}

interface SliderProps {
  slides: Slide[];
}

export default function Slider({ slides }: SliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToSlide = useCallback((slideIndex: number) => {
    setCurrentSlide(slideIndex);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide(current => 
      current === slides.length - 1 ? 0 : current + 1
    );
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(current => 
      current === 0 ? slides.length - 1 : current - 1
    );
  }, [slides.length]);
  

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  return (
    <div className={styles.slider}>
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={styles.slide}
          style={{
            transform: `translateX(${100 * (index - currentSlide)}%)`,
          }}
        >
          <img 
            src={slide.image} 
            alt={slide.alt}
            className={styles.image}
          />
        </div>
      ))}

      <button 
        className={`${styles.sliderBtn} ${styles.sliderBtnLeft}`}
        onClick={prevSlide}
        aria-label=" Предыдущий слайд"
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

      <div className={styles.dots}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.dotsDot} ${
              index === currentSlide ? styles.dotsDotActive : ''
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Перейти к слайду ${index + 1}`}
            data-slide={index}
          />
        ))}
      </div>
    </div>
  );
}