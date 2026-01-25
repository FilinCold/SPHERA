# Onboarding (15 минут)

1. Установи Node 20 (`nvm use` или скачай LTS), включи corepack: `corepack enable`.
2. Установи pnpm: `corepack prepare pnpm@latest --activate` (если ещё нет).
3. Установи зависимости: `pnpm install`.
4. Скопируй env: `cp .env.example .env.local` и проставь значения.
5. (Разово) поставь git hooks: `pnpm prepare` — установит husky.
6. Запусти дев-сервер: `pnpm dev` → http://localhost:3000.
7. Перед пушем: `pnpm lint` и `pnpm build` (CI делает то же).

### Где править код?

Проект использует **Feature-Sliced Design (FSD)**:

- **`src/shared`** — инфраструктура: утилиты, стили, конфиги, store core.
- **`src/domains/<domain>`** — доменные модули: модели, репозитории, сервисы, сторы MobX.
- **`src/widgets/<feature>`** — UI-блоки: сборка доменных данных в переиспользуемые компоненты.
- **`src/app`** — маршруты App Router: композиция виджетов, минимум логики.

### Добавление новой фичи

Подробный пример с кодом см. в `docs/ARCHITECTURE.md` (раздел "Пример: Страница профиля пользователя").

**Краткий алгоритм:**

1. Определи домен: `src/domains/<domain>` — модели, репозитории, сервисы, сторы.
2. Зарегистрируй стор: добавь в `RootStore` конструктор.
3. Создай виджет: `src/widgets/<feature>` — UI-компонент, использующий домен.
4. Создай страницу: `src/app/<route>/page.tsx` — композиция виджетов, минимум логики.
