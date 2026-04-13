import Link from "next/link";

import { Button } from "@/shared/components/Button";
import { PAGES } from "@/shared/config/pages.config";

export default function UsersPage() {
  return (
    <main className="app-shell">
      <section className="app-card">
        <h1>Пользователи</h1>
        <p>Раздел в разработке (RBAC: superadmin, admin).</p>
        <Link href={PAGES.HOME}>
          <Button>На главную</Button>
        </Link>
      </section>
    </main>
  );
}
