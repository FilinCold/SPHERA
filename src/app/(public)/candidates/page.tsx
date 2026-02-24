"use client";

import { useState } from "react";

import { Button } from "@/shared/components/Button";
import { Modal } from "@/shared/components/Modal";

export default function TestPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Открыть подборку кандидатов</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div>
          <p>Кандидат</p>
          <p>Кандидат2</p>
          <p>Кандидат3</p>
        </div>
      </Modal>
    </>
  );
}
