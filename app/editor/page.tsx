import { Suspense } from "react";
import EditorClient from "./EditorClient";

export default function EditorPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Loading editor…</div>}>
      <EditorClient />
    </Suspense>
  );
}
