export type Config = { users: User[] };

export type User = {
  email: string;
  threshold: number;
  queries: Query[];
};

export type Query = {
  threshold?: number;
  search: string;
};
