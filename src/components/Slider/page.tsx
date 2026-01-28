// папку с картинками не стал создавать пока что 

import Slider from '@/components/Slider/Slider';
import styles from './page.module.scss';

export default function HomePage() {
  const slides = [
    {
      id: 1,
      image: '/images/slide1.jpg',
      alt: '',
    },
    {
      id: 2,
      image: '/images/slide2.jpg',
      alt: '',
    },
    {
      id: 3,
      image: '/images/slide3.jpg',
      alt: '',
    },
  ];

  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <Slider slides={slides} />
      </section>
    </main>
  );
}