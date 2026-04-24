"use client";

import dynamic from "next/dynamic";

const CourseEditor = dynamic(() => import("@/widgets/CourseEditor"), {
  ssr: false,
});

export default function Page() {
  return <CourseEditor />;
}
