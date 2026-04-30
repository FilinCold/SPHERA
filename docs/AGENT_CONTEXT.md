# AGENT CONTEXT: SPHERA

Краткий рабочий контекст проекта для быстрого погружения в кодовую базу.

## 1) Что это за проект

- Frontend-шаблон на Next.js App Router для HR-продукта.
- Основной принцип организации: Feature-Sliced Design (FSD).
- Бизнес-фичи минимальны, акцент на инфраструктурный каркас.

## 2) Технологический стек

- Ядро: Next.js 16, React 19, TypeScript 5 (strict).
- State management: MobX + mobx-react-lite.
- Валидация окружения: Zod.
- Стили: Sass/SCSS modules.
- Линт/формат: ESLint 9, Prettier 3.
- Пакетный менеджер: pnpm 10.
- Runtime: Node 20.

## 3) Структура проекта (FSD)

- `src/app` — маршруты и композиция виджетов, минимум бизнес-логики.
- `src/shared` — инфраструктура (ui, utils, config, store core, styles, api).
- `src/domains` — доменные сущности: модели, репозитории, сервисы, сторы.
- `src/widgets` — UI-композиции, которые используют домены и shared.

Критичный порядок зависимостей слоев:

- `shared -> domains -> widgets -> app`

## 4) Точки входа и важные файлы

- App entry: `src/app/layout.tsx`
- Главная страница: `src/app/page.tsx`
- Провайдеры: `src/app/providers.tsx`
- Root store: `src/shared/store/root-store.ts`
- Store context/provider: `src/shared/store/store-provider.tsx`
- Env validation: `src/shared/config/env.ts`

Основные маршруты:

- `/` -> `src/app/page.tsx`
- `/todos` -> `src/app/todos/page.tsx`
- `/login` -> `src/app/login/page.tsx`
- `/registration` -> `src/app/registration/page.tsx`
- `/courses` -> `src/app/(public)/courses/page.tsx`
- `/candidates` -> `src/app/(public)/candidates/page.tsx`

## 5) Команды разработки

- Установка: `pnpm install`
- Dev: `pnpm dev`
- Lint: `pnpm lint`
- Type-check: `pnpm type-check`
- Build: `pnpm build`
- Prod start: `pnpm start`
- Format: `pnpm format`
- Проверка формата: `pnpm format:check`

## 6) Качество и CI/CD

- Husky + lint-staged включены.
- Pre-commit запускает:
  - lint-staged (автофикс для staged-файлов)
  - `pnpm lint`
  - `pnpm type-check`
  - `pnpm build`
- CI (`.github/workflows/ci.yml`): install -> lint -> build.

## 7) Правила архитектуры и кода

- Домены не должны импортировать друг друга напрямую.
- Страницы в `app` не должны импортировать домены напрямую (использовать `widgets`).
- Бизнес-логика не размещается в `shared`.
- Импорты через алиас `@/...`.
- MobX-сторы создаются и регистрируются в `RootStore`, без глобальных singleton-инстансов.

## 8) Документация для быстрого старта

- `README.md` — установка, базовые команды, обзор FSD.
- `docs/ARCHITECTURE.md` — детально про FSD/MobX/структуру.
- `docs/ONBOARDING.md` — запуск проекта за 15 минут.
- `docs/CONTRIBUTING.md` — правила веток, PR, commit-процесс.

## 9) Замечания по консистентности

- В `README.md` упоминаются `.nvmrc` и `.env.example`, но в репозитории они могут отсутствовать.
- В проекте одновременно есть `pnpm-lock.yaml` и `package-lock.json`; ориентироваться на pnpm как основной менеджер.

## 10) Быстрый алгоритм для новых изменений

1. Определить домен в `src/domains/<domain>`.
2. Добавить/обновить стор и зарегистрировать его в `RootStore`.
3. Собрать UI-часть в `src/widgets/<feature>`.
4. Подключить виджет в `src/app/<route>/page.tsx`.
5. Прогнать минимум: `pnpm lint && pnpm type-check && pnpm build`.
