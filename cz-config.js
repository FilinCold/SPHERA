// Получаем название текущей ветки
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { execSync } = require("child_process");
let branchName = "";
try {
  branchName = execSync("git branch --show-current", { encoding: "utf-8" }).trim();
} catch (e) {
  // Если не удалось получить ветку, оставляем пустым
}

module.exports = {
  types: [
    { value: "feat", name: "feat:     Новая функциональность" },
    { value: "fix", name: "fix:      Исправление бага" },
    { value: "docs", name: "docs:     Изменения в документации" },
    { value: "style", name: "style:    Изменения форматирования (не влияют на код)" },
    { value: "refactor", name: "refactor: Рефакторинг кода" },
    { value: "perf", name: "perf:     Улучшение производительности" },
    { value: "test", name: "test:     Добавление или исправление тестов" },
    {
      value: "chore",
      name: "chore:    Изменения в процессе сборки или вспомогательных инструментах",
    },
  ],

  messages: {
    type: "Выберите тип изменения:",
    subject: branchName
      ? `Краткое описание (до 72 символов). Коммит будет: "${branchName} <type>: <описание>"`
      : "Краткое описание (до 72 символов):",
    body: "Подробное описание (опционально, используйте | для новой строки):",
    breaking: "Breaking changes (опционально):",
    footer: "Issues closed (опционально, например: #123):",
    confirmCommit: "Создать коммит с этим сообщением?",
  },

  allowBreakingChanges: ["feat", "fix"],
  skipQuestions: ["scope", "footer"],

  subjectLimit: 72,
};
