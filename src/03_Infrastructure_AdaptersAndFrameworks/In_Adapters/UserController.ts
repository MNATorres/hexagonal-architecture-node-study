import { Request, Response } from "express";
import { IUserUseCases } from "../../02_Application_UseCasesAndPorts/In_Ports/IUserUseCases";
import { createUserSchema, updateUserSchema } from "./UserSchemas";
import { ZodError } from "zod";

export class UserController {
  // Dependency Injection via constructor
  constructor(private readonly userUseCases: IUserUseCases) {
    // Bind methods to keep 'this' context when passing to express router
    this.create = this.create.bind(this);
    this.get = this.get.bind(this);
    this.getAll = this.getAll.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async create(req: Request, res: Response) {
    try {
      const data = createUserSchema.parse(req.body);
      const user = await this.userUseCases.createUser(data.name, data.email, data.age);
      res.status(201).json(user);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: (error as any).errors });
      }
      res.status(400).json({ error: error.message });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const user = await this.userUseCases.getUser(req.params.id as string);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const users = await this.userUseCases.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const data = updateUserSchema.parse(req.body);
      const user = await this.userUseCases.updateUser(req.params.id as string, data.name, data.age);
      res.json(user);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: (error as any).errors });
      }
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.userUseCases.deleteUser(req.params.id as string);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
