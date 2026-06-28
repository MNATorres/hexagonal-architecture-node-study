import { randomUUID } from "crypto";
import { User } from "../../01_Domain_EnterpriseBusinessRules/User";
import { IUserRepository } from "../../02_Application_UseCasesAndPorts/Out_Ports/IUserRepository";

// An Out Adapter that fulfills the IUserRepository contract using an in-memory Map.
// Same port as TypeOrmUserRepository, zero database required. Useful for local
// development and demos: the application core cannot tell the difference.
export class InMemoryUserRepository implements IUserRepository {
  private readonly users = new Map<string, User>();

  async save(user: User): Promise<User> {
    // Mimic what a database does: assign an ID to brand-new entities.
    const id = user.id ?? randomUUID();
    const persisted = new User(id, user.name, user.email, user.age);
    this.users.set(id, persisted);
    return persisted;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }
}
