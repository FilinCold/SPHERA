# Архитектурный каркас

Проект использует подход **Feature-Sliced Design (FSD)** для организации кода. Это обеспечивает чёткое разделение ответственности между слоями и упрощает масштабирование.

## Слои FSD

### `src/app` — App Router (Pages)

Маршруты Next.js App Router. Минимум логики; только композиция виджетов и layout.

### `src/shared` — Инфраструктура

Общие утилиты, стили, конфиги, store core. Переиспользуемый код без бизнес-логики.

### `src/domains` — Доменные модули

Бизнес-логика приложения: модели данных, репозитории (API-клиенты), сервисы, сторы MobX. Каждый домен изолирован и регистрируется в RootStore.

### `src/widgets` — UI-блоки

Сборка доменных данных в переиспользуемые UI-компоненты. Виджеты используют домены и shared UI, собираются на страницах.

## Пример: Страница профиля пользователя

Рассмотрим простой пример страницы профиля, демонстрирующий FSD подход:

### Структура файлов

```
src/
├── app/
│   └── profile/
│       └── page.tsx              # Страница профиля
├── domains/
│   └── user/
│       ├── model.ts              # Модель пользователя
│       ├── repository.ts         # API-клиент для работы с пользователями
│       └── user-store.ts         # MobX стор для управления состоянием
├── widgets/
│   └── user-profile/
│       └── user-profile.tsx      # Виджет профиля пользователя
└── shared/
    └── store/
        └── root-store.ts         # Регистрация UserStore
```

### 1. Domain: `src/domains/user/`

#### Модель (`model.ts`)

```typescript
// src/domains/user/model.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
```

#### Репозиторий (`repository.ts`)

```typescript
// src/domains/user/repository.ts
import type { User } from "./model";

export class UserRepository {
  async getUserById(id: string): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) throw new Error("Failed to fetch user");
    return response.json();
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update user");
    return response.json();
  }
}
```

#### Стор (`user-store.ts`)

```typescript
// src/domains/user/user-store.ts
import { makeAutoObservable, runInAction } from "mobx";
import type { RootStore } from "@/shared/store/root-store";
import type { User } from "./model";
import { UserRepository } from "./repository";

export class UserStore {
  currentUser: User | null = null;
  isLoading = false;
  error: string | null = null;

  private repository = new UserRepository();

  constructor(private readonly root: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async loadUser(userId: string) {
    this.isLoading = true;
    this.error = null;

    try {
      const user = await this.repository.getUserById(userId);
      runInAction(() => {
        this.currentUser = user;
        this.isLoading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : "Unknown error";
        this.isLoading = false;
      });
    }
  }

  async updateUser(userId: string, data: Partial<User>) {
    if (!this.currentUser) return;

    try {
      const updated = await this.repository.updateUser(userId, data);
      runInAction(() => {
        this.currentUser = updated;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : "Unknown error";
      });
    }
  }
}
```

#### Регистрация в RootStore

```typescript
// src/shared/store/root-store.ts
import { makeAutoObservable } from "mobx";
import { UiStore } from "./ui-store";
import { UserStore } from "@/domains/user/user-store";

export class RootStore {
  ui: UiStore;
  user: UserStore; // ← Регистрируем доменный стор

  constructor() {
    this.ui = new UiStore(this);
    this.user = new UserStore(this); // ← Инициализируем с ссылкой на root
    makeAutoObservable(this, {}, { autoBind: true });
  }
}
```

### 2. Widget: `src/widgets/user-profile/`

```typescript
// src/widgets/user-profile/user-profile.tsx
"use client";

import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useStores } from "@/shared/store";

interface UserProfileProps {
  userId: string;
}

export const UserProfile = observer(({ userId }: UserProfileProps) => {
  const { user } = useStores();

  useEffect(() => {
    user.loadUser(userId);
  }, [userId, user]);

  if (user.isLoading) {
    return <div>Загрузка...</div>;
  }

  if (user.error) {
    return <div>Ошибка: {user.error}</div>;
  }

  if (!user.currentUser) {
    return <div>Пользователь не найден</div>;
  }

  return (
    <div className="user-profile">
      <img src={user.currentUser.avatar} alt={user.currentUser.name} />
      <h2>{user.currentUser.name}</h2>
      <p>{user.currentUser.email}</p>
    </div>
  );
});
```

### 3. Page: `src/app/profile/page.tsx`

```typescript
// src/app/profile/page.tsx
import { UserProfile } from "@/widgets/user-profile/user-profile";

export default function ProfilePage() {
  // Получаем userId из параметров (например, из URL или сессии)
  const userId = "123"; // В реальности из searchParams или session

  return (
    <main>
      <h1>Профиль</h1>
      <UserProfile userId={userId} />
    </main>
  );
}
```

## Принципы FSD в проекте

### ✅ Правильно

1. **Домены изолированы**: `domains/user` не импортирует `domains/product`
2. **Виджеты используют домены**: `widgets/user-profile` использует `domains/user`
3. **Страницы композируют виджеты**: `app/profile` использует `widgets/user-profile`
4. **Shared — только инфраструктура**: утилиты, стили, конфиги без бизнес-логики
5. **Сторы регистрируются в RootStore**: доступ через `useStores()`

### ❌ Неправильно

1. **Импорт между доменами**: `domains/user` → `domains/product` (используй кросс-доменные сервисы в shared, если нужно)
2. **Бизнес-логика в страницах**: `app/profile` не должен содержать API-вызовы или сложную логику
3. **Прямые импорты доменов в страницы**: страницы должны использовать виджеты, а не домены напрямую
4. **Глобальные синглтоны**: сторы живут в RootStore через Context, не глобально

## MobX

- `RootStore` создаётся внутри `StoreProvider` через `useMemo` + `enableStaticRendering`, что безопасно для SSR и изолирует запросы.
- `enableStaticRendering` отключает реактивность MobX на сервере (один рендер), на клиенте работает как обычно.
- Доступ к стору через хук `useStores()` из `@/shared/store` в любом компоненте.
- Добавляя новые сторы, инициализируй их в конструкторе RootStore и храни ссылку на `root` для кросс-сторовых зависимостей.
- Избегай глобальных синглтонов: стор живёт в провайдере (один экземпляр на провайдер, не глобально). Это позволяет изолировать состояние между тестами и SSR-запросами.

## Env

- Валидируются в `shared/config/env.ts` через zod. Только `NEXT_PUBLIC_*` переменные.
- Ошибки валидатора должны падать рано (layout вызывает `getPublicEnv()`).

## Стили

- SCSS modules для компонентов, глобальные слои в `shared/styles` (reset, tokens, globals).
- Токены — минимальный набор цветов/отступов/радиусов, дополняй при необходимости.

## Добавление фич

1. **Определи домен**: `src/domains/<domain>` — модели, репозитории, сервисы, сторы.
2. **Зарегистрируй стор**: добавь в `RootStore` конструктор.
3. **Создай виджет**: `src/widgets/<feature>` — UI-компонент, использующий домен.
4. **Создай страницу**: `src/app/<route>/page.tsx` — композиция виджетов, минимум логики.

## Порядок импортов

При импортах соблюдай порядок слоёв (снизу вверх):

```typescript
// 1. Shared (инфраструктура)
import { useStores } from "@/shared/store";
import { clsx } from "@/shared/lib/clsx";

// 2. Domains (бизнес-логика)
import type { User } from "@/domains/user/model";

// 3. Widgets (UI-блоки)
import { UserProfile } from "@/widgets/user-profile/user-profile";
```
