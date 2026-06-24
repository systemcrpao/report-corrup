/**
 * @param {string} html
 * @returns {Promise<void>}
 */
export function openPrintDocument(html) {
  return new Promise((resolve, reject) => {
    try {
      const iframe = document.createElement("iframe");
      iframe.setAttribute("title", "print-frame");
      iframe.setAttribute("aria-hidden", "true");
      Object.assign(iframe.style, {
        position: "fixed",
        right: "0",
        bottom: "0",
        width: "0",
        height: "0",
        border: "0",
        opacity: "0",
        pointerEvents: "none",
      });

      document.body.appendChild(iframe);

      const frameWindow = iframe.contentWindow;
      if (!frameWindow) {
        iframe.remove();
        reject(new Error("PRINT_FRAME_ERROR"));
        return;
      }

      const doc = frameWindow.document;
      doc.open();
      doc.write(html);
      doc.close();

      const cleanup = () => {
        setTimeout(() => iframe.remove(), 800);
        resolve();
      };

      const triggerPrint = () => {
        try {
          frameWindow.focus();
          frameWindow.print();
        } catch (error) {
          iframe.remove();
          reject(error);
          return;
        }
        cleanup();
      };

      setTimeout(triggerPrint, 350);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * @param {string} html
 * @param {string} title
 */
export function openReportPreview(html, title = "รายงาน") {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const previewWindow = window.open(url, "_blank");

  if (!previewWindow) {
    URL.revokeObjectURL(url);
    throw new Error("PREVIEW_BLOCKED");
  }

  previewWindow.onload = () => URL.revokeObjectURL(url);
  previewWindow.document.title = title;
}
