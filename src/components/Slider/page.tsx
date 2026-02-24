import { Slider } from "@/components/Slider";

import { MOCK_SLIDES } from "./constants";
import styles from "./page.module.scss";

export default function HomePage() {
  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <Slider slides={MOCK_SLIDES} />
      </section>
    </main>
  );
}
