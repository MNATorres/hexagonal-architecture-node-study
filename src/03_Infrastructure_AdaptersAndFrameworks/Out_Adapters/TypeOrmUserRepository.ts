import { Repository } from "typeorm";
import { User } from "../../01_Domain_EnterpriseBusinessRules/User";
import { IUserRepository } from "../../02_Application_UseCasesAndPorts/Out_Ports/IUserRepository";
import { UserOrmEntity } from "./UserOrmEntity";

export class TypeOrmUserRepository implements IUserRepository {
  constructor(private readonly ormRepository: Repository<UserOrmEntity>) {}

  // Mapper: ORM Entity -> Domain Entity
  private toDomain(ormEntity: UserOrmEntity): User {
    return new User(ormEntity.id, ormEntity.name, ormEntity.email, ormEntity.age);
  }

  // Mapper: Domain Entity -> ORM Entity
  private toOrm(domainEntity: User): UserOrmEntity {
    const ormEntity = new UserOrmEntity();
    if (domainEntity.id) {
      ormEntity.id = domainEntity.id;
    }
    ormEntity.name = domainEntity.name;
    ormEntity.email = domainEntity.email;
    ormEntity.age = domainEntity.age;
    return ormEntity;
  }

  async save(user: User): Promise<User> {
    const ormEntity = this.toOrm(user);
    const savedEntity = await this.ormRepository.save(ormEntity);
    return this.toDomain(savedEntity);
  }

  async findById(id: string): Promise<User | null> {
    const ormEntity = await this.ormRepository.findOneBy({ id });
    if (!ormEntity) return null;
    return this.toDomain(ormEntity);
  }

  async findAll(): Promise<User[]> {
    const ormEntities = await this.ormRepository.find();
    return ormEntities.map(this.toDomain);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
