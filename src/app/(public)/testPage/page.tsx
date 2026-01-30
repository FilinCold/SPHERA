"use client";

import { useState } from "react";

import { Button } from "@/shared/components/Button";
import { Modal } from "@/shared/components/Modal";

export default function TestPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Открыть модальное окно</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div>
          <p>content1</p>
          <p>content2content2</p>
          <p>content3content3content3</p>
          <p>content4content4content4content4</p>
          <p>content5</p>
        </div>
      </Modal>
    </>
  );
}
