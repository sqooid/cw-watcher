export type Data = {
  users: Record<string, UserData>;
};

export type UserData = {
  lastMessageHash: number;
};
