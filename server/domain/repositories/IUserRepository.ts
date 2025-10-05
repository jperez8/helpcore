import { User, InsertUser } from "@shared/schema";

type UserCreateInput = InsertUser & { id?: string };

export interface IUserRepository {
  create(user: UserCreateInput): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: string, user: Partial<InsertUser>): Promise<User>;
}

export type { UserCreateInput };
