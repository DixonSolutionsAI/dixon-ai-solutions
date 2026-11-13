const MAX_TEXT_BYTES = 16000;
const MAX_PDF_BYTES = 10 * 1024 * 1024;

export async function readDocument(file) {
  const name = file.name.toLowerCase();
  let content;

  if (name.endsWith(".txt")) {
    if (file.size > MAX_TEXT_BYTES) {
      throw new Error("Text files must be at most 16,000 bytes.");
    }
    try {
      content = new TextDecoder("utf-8", { fatal: true }).decode(await file.arrayBuffer());
    } catch {
      throw new Error("Unable to read the file as UTF-8 text.");
    }
  } else if (name.endsWith(".pdf")) {
    if (file.size > MAX_PDF_BYTES) {
      throw new Error("PDF files must be at most 10 MB.");
    }
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    if (typeof window !== "undefined") {
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    }
    let pdf;
    try {
      pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
      const pages = [];
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const text = await page.getTextContent();
        pages.push(text.items.map((item) => "str" in item ? item.str + (item.hasEOL ? "\n" : "") : "").join(""));
        if (new TextEncoder().encode(pages.join("\n")).length > MAX_TEXT_BYTES) {
          throw new Error("Extracted document text must be at most 16,000 bytes.");
        }
      }
      content = pages.join("\n");
    } catch (error) {
      if (error.message === "Extracted document text must be at most 16,000 bytes.") throw error;
      throw new Error("Unable to read this PDF. Check that it is valid and not password-protected.");
    } finally {
      if (pdf) await pdf.destroy();
    }
  } else {
    throw new Error("Choose a UTF-8 .txt or text-based .pdf file.");
  }

  if (!content.trim() || content.includes("\0")) {
    throw new Error("The document must contain readable text. Scanned PDFs require OCR before upload.");
  }
  return content;
}
