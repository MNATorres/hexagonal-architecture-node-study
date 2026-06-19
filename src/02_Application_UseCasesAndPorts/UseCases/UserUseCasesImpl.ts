import { User } from "../../01_Domain_EnterpriseBusinessRules/User";
import { IUserUseCases } from "../In_Ports/IUserUseCases";
import { IUserRepository } from "../Out_Ports/IUserRepository";

export class UserUseCasesImpl implements IUserUseCases {
  // Dependency Injection via constructor
  constructor(private readonly userRepository: IUserRepository) {}

  async createUser(name: string, email: string, age: number): Promise<User> {
    const user = new User(null, name, email, age); // null ID as it's new
    return this.userRepository.save(user);
  }

  async getUser(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async updateUser(id: string, name: string, age: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    user.updateProfile(name, age);
    return this.userRepository.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
