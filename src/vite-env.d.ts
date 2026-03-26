/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_IS_LOCALHOST_SECURE: boolean;
}

interface ImportMeta {
  readonly env: Readonly<ImportMetaEnv>;
}
