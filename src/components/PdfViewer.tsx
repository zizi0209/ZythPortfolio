"use client";

import { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Download } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Khai báo worker cho pdf.js (cách an toàn với Next.js/Webpack)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

type PdfViewerProps = {
  fileUrl: string; // ví dụ: "/resume.pdf"
};

export default function PdfViewer({ fileUrl }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState(1.2);

  const onLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => setNumPages(numPages),
    []
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <button
          className="px-2 py-1 border rounded"
          onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}
        >
          –
        </button>
        <span className="text-sm">Zoom {Math.round(scale * 100)}%</span>
        <button
          className="px-2 py-1 border rounded"
          onClick={() => setScale((s) => Math.min(3, s + 0.2))}
        >
          +
        </button>

        <a
          href={fileUrl}
          download
          className="ml-auto inline-flex items-center gap-1 text-sm underline"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </a>
      </div>

      {/* PDF content */}
      <Document
        file={fileUrl}
        onLoadSuccess={onLoadSuccess}
        loading={<p className="p-4">Loading PDF…</p>}
      >
        {Array.from(new Array(numPages), (_, i) => (
          <Page
            key={`p_${i + 1}`}
            pageNumber={i + 1}
            scale={scale}
            renderTextLayer={false} // mượt hơn
          />
        ))}
      </Document>
    </div>
  );
}
