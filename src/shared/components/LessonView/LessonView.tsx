import styles from "./LessonView.module.scss";

import type { LessonViewerProps } from "./types";

export function LessonView({ content, videoUrl }: LessonViewerProps) {
  return (
    <div className={styles.lesson}>
      {videoUrl && (
        <div className={styles.lesson__video}>
          <video controls src={videoUrl} />
        </div>
      )}

      <div className={styles.lesson__content} dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
