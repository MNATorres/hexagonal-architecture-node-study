import { User, DomainException } from './User';

describe('User Domain Entity', () => {
  it('should create a valid user', () => {
    const user = new User(null, 'John Doe', 'john@example.com', 30);
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
    expect(user.age).toBe(30);
  });

  it('should throw DomainException if name is empty', () => {
    expect(() => new User(null, '', 'john@example.com', 30)).toThrow(DomainException);
    expect(() => new User(null, '   ', 'john@example.com', 30)).toThrow('User name cannot be empty');
  });

  it('should throw DomainException if email is invalid', () => {
    expect(() => new User(null, 'John Doe', 'invalid-email', 30)).toThrow('User email must have a valid format');
  });

  it('should throw DomainException if age is negative', () => {
    expect(() => new User(null, 'John Doe', 'john@example.com', -1)).toThrow('User age cannot be negative');
  });

  it('should update profile properly', () => {
    const user = new User('123', 'John Doe', 'john@example.com', 30);
    user.updateProfile('Jane Doe', 25);
    expect(user.name).toBe('Jane Doe');
    expect(user.age).toBe(25);
  });

  it('should throw error when updating profile with invalid data', () => {
    const user = new User('123', 'John Doe', 'john@example.com', 30);
    expect(() => user.updateProfile('', 25)).toThrow(DomainException);
  });
});
