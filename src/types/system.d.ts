type Nullable<T> = T | null;

declare module '*.svg' {
  const content: any;

  export default content;
}
