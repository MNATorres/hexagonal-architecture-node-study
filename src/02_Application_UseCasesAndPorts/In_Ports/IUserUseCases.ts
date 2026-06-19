import { User } from "../../01_Domain_EnterpriseBusinessRules/User";

export interface IUserUseCases {
  createUser(name: string, email: string, age: number): Promise<User>;
  getUser(id: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: string, name: string, age: number): Promise<User>;
  deleteUser(id: string): Promise<void>;
}
