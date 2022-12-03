export interface RecordUpdate {
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: number;
  public_address: string;
  verifier: string;
  verifier_id: string;
  guardians: string;
  nominee: string;
  recovery_address: string;
}

export type UserInsertType = Partial<User> & Pick<User, "public_address" | "verifier" | "verifier_id">;

export type UserUpdateType = Partial<User>;

export const USER = "user";
