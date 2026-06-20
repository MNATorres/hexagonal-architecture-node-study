import { UserController } from './UserController';
import { IUserUseCases } from '../../02_Application_UseCasesAndPorts/In_Ports/IUserUseCases';
import { User } from '../../01_Domain_EnterpriseBusinessRules/User';
import { Request, Response } from 'express';

// Mock Express Objects
const mockRequest = () => {
  const req: Partial<Request> = {};
  req.body = {};
  req.params = {};
  return req as Request;
};

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res as Response;
};

// Mock Use Cases (In Port)
class MockUserUseCases implements IUserUseCases {
  async createUser(name: string, email: string, age: number): Promise<User> {
    return new User('123', name, email, age);
  }
  async getUser(id: string): Promise<User | null> {
    if (id === '123') return new User('123', 'Alice', 'alice@test.com', 30);
    return null;
  }
  async getAllUsers(): Promise<User[]> {
    return [new User('123', 'Alice', 'alice@test.com', 30)];
  }
  async updateUser(id: string, name: string, age: number): Promise<User> {
    return new User(id, name, 'alice@test.com', age);
  }
  async deleteUser(id: string): Promise<void> {}
}

describe('UserController', () => {
  let controller: UserController;
  let useCases: IUserUseCases;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    useCases = new MockUserUseCases();
    controller = new UserController(useCases);
    req = mockRequest();
    res = mockResponse();
  });

  describe('create', () => {
    it('should return 201 and created user when body is valid', async () => {
      req.body = { name: 'Alice', email: 'alice@test.com', age: 30 };
      await controller.create(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'Alice', id: '123' }));
    });

    it('should return 400 when Zod validation fails (missing email)', async () => {
      req.body = { name: 'Alice', age: 30 }; // missing email
      await controller.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ errors: expect.any(Array) }));
    });
  });

  describe('get', () => {
    it('should return 200 and the user if found', async () => {
      req.params.id = '123';
      await controller.get(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'Alice' }));
    });

    it('should return 404 if user not found', async () => {
      req.params.id = '999';
      await controller.get(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });
  });
});
