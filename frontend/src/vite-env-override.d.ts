/// <reference types="vite/client" />

declare module '*?inline' {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_NYC_OPENDATA_API_KEY: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
