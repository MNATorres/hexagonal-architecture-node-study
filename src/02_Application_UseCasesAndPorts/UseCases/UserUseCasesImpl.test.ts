import { UserUseCasesImpl } from './UserUseCasesImpl';
import { IUserRepository } from '../Out_Ports/IUserRepository';
import { User } from '../../01_Domain_EnterpriseBusinessRules/User';

// MOCK the Out Port (IUserRepository)
class MockUserRepository implements IUserRepository {
  private users: User[] = [];

  async save(user: User): Promise<User> {
    if (!user.id) {
      // Simulate DB assigning an ID
      Reflect.set(user, 'id', Math.random().toString());
    }
    const index = this.users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      this.users[index] = user;
    } else {
      this.users.push(user);
    }
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter(u => u.id !== id);
  }
}

describe('UserUseCasesImpl', () => {
  let userRepository: IUserRepository;
  let useCases: UserUseCasesImpl;

  beforeEach(() => {
    userRepository = new MockUserRepository();
    useCases = new UserUseCasesImpl(userRepository);
  });

  it('should create a user successfully', async () => {
    const user = await useCases.createUser('Alice', 'alice@test.com', 28);
    expect(user.id).toBeDefined();
    expect(user.name).toBe('Alice');

    // Verify it was saved in repo
    const allUsers = await userRepository.findAll();
    expect(allUsers).toHaveLength(1);
  });

  it('should get a user by ID', async () => {
    const created = await useCases.createUser('Bob', 'bob@test.com', 20);
    const fetched = await useCases.getUser(created.id as string);
    expect(fetched).not.toBeNull();
    expect(fetched?.name).toBe('Bob');
  });

  it('should update a user', async () => {
    const created = await useCases.createUser('Charlie', 'charlie@test.com', 40);
    const updated = await useCases.updateUser(created.id as string, 'Charlie Updated', 41);
    
    expect(updated.name).toBe('Charlie Updated');
    expect(updated.age).toBe(41);

    const fetched = await useCases.getUser(created.id as string);
    expect(fetched?.name).toBe('Charlie Updated');
  });

  it('should throw error when updating non-existent user', async () => {
    await expect(useCases.updateUser('missing-id', 'Ghost', 99)).rejects.toThrow('User not found');
  });

  it('should delete a user', async () => {
    const created = await useCases.createUser('Dave', 'dave@test.com', 50);
    await useCases.deleteUser(created.id as string);
    
    const fetched = await useCases.getUser(created.id as string);
    expect(fetched).toBeNull();
  });
});
