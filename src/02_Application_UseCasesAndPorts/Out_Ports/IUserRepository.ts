import { User } from "../../01_Domain_EnterpriseBusinessRules/User";

export interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  delete(id: string): Promise<void>;
}
