export class User {
  constructor(
    public readonly id: string | null, // null when it's a new domain object not yet persisted
    public name: string,
    public email: string,
    public age: number
  ) {
    this.validateBusinessRules();
  }

  private validateBusinessRules(): void {
    if (!this.name || this.name.trim() === '') {
      throw new DomainException('User name cannot be empty');
    }
    if (!this.email || !this.email.includes('@')) {
      throw new DomainException('User email must have a valid format');
    }
    if (this.age < 0) {
      throw new DomainException('User age cannot be negative');
    }
  }

  // Domain behaviors
  public updateProfile(newName: string, newAge: number): void {
    this.name = newName;
    this.age = newAge;
    this.validateBusinessRules();
  }
}

export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
  }
}
