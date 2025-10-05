import { User, InsertUser } from "@shared/schema";

export interface IUserRepository {
  create(user: InsertUser): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
}
