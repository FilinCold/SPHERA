# PROJECT CONTEXT — SFERA LMS (frontend)

Единая точка входа для людей и агентов. Подробности см. в связанных файлах ниже; этот документ намеренно компактный.

---

## TL;DR

- **Продукт:** SFERA LMS — SaaS для рекрутмента и обучения кандидатов через курсы (компании создают курсы, шлют ссылку, собирают данные, ведут кандидатов).
- **Tenant-модель:** у компании изолированное **Пространство**; данные не смешиваются; доступ зависит от **подписки** (активна / приостановлена — блокирует всех, включая прохождение кандидатами).
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript strict, MobX, Zod (env), SCSS modules; организация — **Feature-Sliced Design** (`shared → domains → widgets → app`).
- **MVP:** пространства, роли, курсы/уроки, прохождение по ссылке, прогресс, отклики, базовая аналитика. Нет ЛК-candidate, интеграций HRM/ATS, сложной аналитики, mobile, кастом UI, i18n.
- **Реализация:** не ломать архитектуру; переиспользовать компоненты; таблицы + forma + состояния loading / empty / error / forbidden / draft vs published.
- **Имя в репо:** часто **Sphera**; в продуктовых текстах — **SFERA LMS** — сверяться с API/UI-копирайтом.

---

## 1. Продукт и домен

### Зачем продукт

Замена внешних LMS, структурированный сбор данных от кандидатов, управление наймом через курсы.

### Роли (для guard’ов и UX)

| Роль                   | Кратко                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| Суперадминистратор     | Пространства, подписки, полный доступ                                                      |
| Администратор компании | Пользователи, курсы, кандидаты, аналитика                                                  |
| Пользователь (HR)      | Просмотр, статусы кандидатов; **не** редактирует «сущности» как админ                      |
| Кандидат               | Внешний пользователь по ссылке; анкета, уроки, отклик; в MVP **нет** полноценного кабинета |

### Сущности (глоссарий)

Пространство компании, Подписка, Пользователь, Роль, Курс, Урок, Ссылка на курс (slug), Кандидат, Отклик, Статус кандидата, Прогресс прохождения, Статистика курса.

### Сценарии (ориентиры для экранов)

- Пространство: создание, назначение админа.
- Пользователи: приглашение, регистрация по ссылке, роли.
- Курсы: создание, первый урок-анкета по умолчанию, уроки, черновик/публикация, ссылка.
- Кандидат: ссылка → анкета → уроки → прогресс → отклик.
- Аналитика: списки, фильтры, статусы, ответы.

### Критичные бизнес-правила

- Данные **изолированы** между пространствами.
- Пользователь **только в одном** пространстве.
- Доступ по **роли** и **подписке**; при приостановке — блок для внутренних ролей и для кандидатов на прохождении.
- Курс для кандидата — **по уникальной ссылке**.
- **Один отклик = один курс**; кандидат может проходить **несколько** курсов.

### UX и ограничения

- Таблицы и формы; состояния: loading, empty, error, доступ запрещён, черновик/опубликовано.
- Только веб, современные браузеры; **ПДн** — не светить лишнее в логах и UI.

**Детализация:** [docs/sphera-context.md](sphera-context.md)

---

## 2. Инженерия репозитория

### Стек

Next.js 16, React 19, TypeScript 5 (strict + `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`), MobX + mobx-react-lite, Zod, Sass/SCSS, ESLint 9, Prettier 3, pnpm 10, Node 20.

### FSD-слои

- `src/app` — маршруты, композиция виджетов, минимум бизнес-логики.
- `src/shared` — инфраструктура (UI-kit уровня shared, config, store core, styles, api).
- `src/domains` — модели, репозитории, сторы по домену.
- `src/widgets` — сборка UI из доменов + shared.

Порядок зависимостей: **`shared → domains → widgets → app`**.

### Правила

- Домены **не** импортируют друг друга напрямую.
- Страницы **`app`** не импортируют домены напрямую — через **widgets**.
- Бизнес-логика не в `shared`.
- Импорты: алиас `@/*` → `src/*`.
- MobX: сторы в `RootStore`, без глобальных singleton.

### Точки входа и маршруты

- `src/app/layout.tsx` — root layout; вызывает `getPublicEnv()` (см. env).
- Провайдеры: `src/app/providers.tsx` → store provider.
- Root store: `src/shared/store/root-store.ts`.

Маршруты-эталоны: `/`, `/todos`, `/login`, `/registration`, `/courses`, `/candidates` (см. `src/app/...`).

### Окружение

`src/shared/config/env.ts`: обязательны **`NEXT_PUBLIC_APP_ENV`** (`development` | `staging` | `production`) и **`NEXT_PUBLIC_API_URL`** (URL). Ошибка валидации — падение на старте (layout). В CI для build переменные задаются в `.github/workflows/ci.yml`.

### Команды

`pnpm install` · `pnpm dev` · `pnpm lint` · `pnpm type-check` · `pnpm build` · `pnpm start` · `pnpm format` / `pnpm format:check`

### Качество

Husky + lint-staged; pre-commit: lint-staged → `pnpm lint` → `pnpm type-check` → `pnpm build`. CI: install → lint → build на ветках `main` / `master` / `develop`.

### Алгоритм новой фичи

1. Домен `src/domains/<domain>`.
2. Стор и регистрация в `RootStore`.
3. Виджет `src/widgets/<feature>`.
4. Страница `src/app/<route>/page.tsx`.
5. Проверка: `pnpm lint && pnpm type-check && pnpm build`.

### Замечания по репо

- В README могут быть ссылки на `.nvmrc` / `.env.example` — файлов может не быть; env смотреть по `env.ts` и CI.
- Есть и `pnpm-lock.yaml`, и `package-lock.json` — ориентир: **pnpm**.

**Детализация:** [docs/AGENT_CONTEXT.md](AGENT_CONTEXT.md), [docs/ARCHITECTURE.md](ARCHITECTURE.md)

---

## 3. Процесс разработки

Ветки, PR, коммиты (в т.ч. `pnpm commit`), запрет самослива в `main` без процесса — см. [docs/CONTRIBUTING.md](CONTRIBUTING.md). Быстрый старт: [docs/ONBOARDING.md](ONBOARDING.md), корневой [README.md](../README.md).

---

## 4. Работа агента (Antigravity Kit)

В репозитории описан модульный набор: **агенты**, **скиллы**, **workflows** (`/plan`, `/debug`, `/orchestrate` и др.). Принцип: **тип задачи → подходящий агент/скилл**, скиллы читать по `SKILL.md` перед применением.

Ориентиры для этого стека:

- UI/логика фронта: `frontend-specialist` + `nextjs-best-practices`, `react-patterns`, `typescript-expert`.
- Планирование/исследование: `project-planner` + `plan-writing`, `brainstorming`.
- Сложная координация: `orchestrator` + `parallel-agents`.
- Отладка: `debugger` + `systematic-debugging`.
- CI/Docker: `devops-engineer` + `deployment-procedures`, `docker-expert`.

**Карта и списки:** [cursor/ARCHITECTURE.md](../cursor/ARCHITECTURE.md)

---

## 5. Связанные документы (источники)

| Файл                                                   | Назначение                                       |
| ------------------------------------------------------ | ------------------------------------------------ |
| [sphera-context.md](sphera-context.md)                 | Продукт, роли, сущности, MVP, бизнес-правила, UX |
| [AGENT_CONTEXT.md](AGENT_CONTEXT.md)                   | Краткий инженерный контекст репозитория          |
| [ARCHITECTURE.md](ARCHITECTURE.md)                     | FSD, MobX, примеры, стили                        |
| [CONTRIBUTING.md](CONTRIBUTING.md)                     | Ветки, PR, хуки                                  |
| [ONBOARDING.md](ONBOARDING.md)                         | Запуск за 15 минут                               |
| [prompt*от_PRD*до_tasks.md](prompt_от_PRD_до_tasks.md) | От PRD к задачам                                 |
| [cursor/ARCHITECTURE.md](../cursor/ARCHITECTURE.md)    | Агенты, скиллы, workflows                        |
