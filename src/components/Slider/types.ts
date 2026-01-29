export interface Slide {
  id: number;
  image: string;
  alt: string;
  title?: string;
  description?: string;
}

export interface SliderProps {
  slides: Slide[];
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  isDots?: boolean;
  isButtons?: boolean;
}
