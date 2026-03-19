import Link from "next/link";

import { Button } from "@/shared/components/Button";

export default function Home() {
  return (
    <main className="app-shell">
      <section className="app-card">
        <p className="muted">
          Минимальный каркас без бизнес-логики. Ознакомьтесь с README и docs, прежде чем добавлять
          доменные модули и страницы.
        </p>

        <ul className="list">
          <li>
            Инфраструктура и утилиты — в <code>src/shared</code>.
          </li>
          <li>
            Доменные модули — в <code>src/domains</code>, сборка UI — в <code>src/widgets</code>.
          </li>
          <li>MobX сторы регистрируем в RootStore, без глобальных синглтонов.</li>
          <li>
            Env валидируются в <code>src/shared/config/env.ts</code> при старте.
          </li>
        </ul>
        <Link href="/todos">
          <Button>Эталонная страница с туду</Button>
        </Link>
      </section>
    </main>
  );
}
