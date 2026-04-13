"use client";

import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/components/Button";
import { PAGES } from "@/shared/config/pages.config";
import { useStores } from "@/shared/store";

const SubscriptionPausedView = () => {
  const { auth } = useStores();
  const router = useRouter();

  return (
    <main className="app-shell">
      <section className="app-card">
        <h1>Подписка приостановлена</h1>
        <p>Работа пространства временно недоступна. Обратитесь к администратору сервиса.</p>
        {auth.isAuthorized ? (
          <Button
            onClick={() => {
              void (async () => {
                await auth.logout();
                router.replace(PAGES.LOGIN);
              })();
            }}
          >
            Выйти
          </Button>
        ) : null}
      </section>
    </main>
  );
};

export default observer(SubscriptionPausedView);
