export const ResponseType = {
  JSON: 'json',
  TEXT: 'text',
  BLOB: 'blob',
  ARRAY_BUFFER: 'arrayBuffer',
  NONE: 'none',
} as const;

export type ResponseType = (typeof ResponseType)[keyof typeof ResponseType];

export type RequestOptions = RequestInit & {
  secured?: boolean;
};
