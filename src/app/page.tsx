export default function Home() {
  return (
    <main className="app-shell">
      <section className="app-card">
        <div className="app-card__header">
          <div>
            <p className="pill">Infrastructure</p>
            <h1>Next.js + MobX Boilerplate</h1>
          </div>
          <p className="pill">Start here</p>
        </div>

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
      </section>
    </main>
  );
}
