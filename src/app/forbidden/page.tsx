"use client";

import Link from "next/link";

import { Button } from "@/shared/components/Button";
import { PAGES } from "@/shared/config/pages.config";

export default function ForbiddenPage() {
  return (
    <main className="app-shell">
      <section className="app-card">
        <h1>Доступ запрещен</h1>
        <p>У вас недостаточно прав для открытия этого раздела.</p>
        <Link href={PAGES.HOME}>
          <Button>Вернуться на главную</Button>
        </Link>
      </section>
    </main>
  );
}
