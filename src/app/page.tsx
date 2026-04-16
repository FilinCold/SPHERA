import { redirect } from "next/navigation";

import { PAGES } from "@/shared/config/pages.config";

export default function Home() {
  redirect(PAGES.LOGIN);
}
