import { IUserRepository, UserCreateInput } from "../../domain/repositories/IUserRepository";
import { InsertUser, User } from "@shared/schema";

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: InsertUser, options?: { id?: string }): Promise<User> {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const payload: UserCreateInput = {
      ...data,
      ...(options?.id ? { id: options.id } : {}),
    };

    return this.userRepository.create(payload);
  }
}
