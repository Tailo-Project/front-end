/// <reference types="vite/client" />

declare module "*.jpg" {
    const content: string;
    export default content;
}

declare module "*.png" {
    const content: string;
    export default content;
}
/// <reference types="vite-plugin-pwa/client" />
