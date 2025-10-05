import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { InsertUser, User } from "@shared/schema";

type UpdateUserInput = Partial<InsertUser>;

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, data: UpdateUserInput): Promise<User> {
    const existing = await this.userRepository.findById(id);
    if (!existing) {
      throw new Error("USER_NOT_FOUND");
    }

    if (data.email && data.email !== existing.email) {
      const emailOwner = await this.userRepository.findByEmail(data.email);
      if (emailOwner && emailOwner.id !== id) {
        throw new Error("EMAIL_ALREADY_EXISTS");
      }
    }

    const updated = await this.userRepository.update(id, data);
    return updated;
  }
}
