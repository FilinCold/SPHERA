import React from "react";

import styles from "./PopupCard.module.scss";

import type { PopupCardProps } from "./types";

const PopupCard: React.FC<PopupCardProps> = ({ title, inputs = [], onSubmit, onCancel }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>{title}</div>

      <div className={styles.body}>
        {inputs.map((input, index) => (
          <div key={index} className={styles.inputGroup}>
            <label className={styles.label}>{input.label}</label>

            {input.type === "select" ? (
              <select
                value={input.value}
                onChange={(e) => input.onChange(e.target.value)}
                className={styles.input}
              >
                {input.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={input.type || "text"}
                placeholder={input.placeholder}
                value={input.value}
                onChange={(e) => input.onChange(e.target.value)}
                className={styles.input}
              />
            )}
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button className={styles.cancel} onClick={onCancel}>
          Отмена
        </button>
        <button className={styles.submit} onClick={onSubmit}>
          Создать
        </button>
      </div>
    </div>
  );
};

export default PopupCard;
