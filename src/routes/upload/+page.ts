// The upload page relies on browser-only APIs (pdfjs-dist references `DOMMatrix`
// at import time, plus canvas/FileReader), which crash during server-side
// rendering. This is a fully client-side interactive tool, so we render it on
// the client only. Behaviour is unchanged; this just avoids the SSR evaluation.
export const ssr = false;
