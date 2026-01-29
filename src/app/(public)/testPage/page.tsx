"use client";

import { useState } from "react";

import { Modal } from "@/shared/components/Modal";
import { Button } from "@/shared/ui/Button";

export default function TestPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Открыть модальное окно</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div>
          <p>content1</p>
          <p>content2</p>
          <p>content3</p>
        </div>
      </Modal>
    </>
  );
}
