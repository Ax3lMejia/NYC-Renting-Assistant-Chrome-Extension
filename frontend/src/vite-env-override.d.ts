/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NYC_OPENDATA_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*?inline' {
  const content: string;
  export default content;
}
