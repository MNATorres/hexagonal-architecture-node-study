import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { AppDataSource } from "../03_Infrastructure_AdaptersAndFrameworks/Out_Adapters/DataSource";
import { UserOrmEntity } from "../03_Infrastructure_AdaptersAndFrameworks/Out_Adapters/UserOrmEntity";
import { TypeOrmUserRepository } from "../03_Infrastructure_AdaptersAndFrameworks/Out_Adapters/TypeOrmUserRepository";
import { UserUseCasesImpl } from "../02_Application_UseCasesAndPorts/UseCases/UserUseCasesImpl";
import { UserController } from "../03_Infrastructure_AdaptersAndFrameworks/In_Adapters/UserController";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

async function bootstrap() {
  try {
    // 1. Inicializamos Base de Datos (Adaptador de Salida)
    await AppDataSource.initialize();
    console.log("Database initialized successfully");

    // 2. Composición / Inyección de Dependencias
    // Instanciamos el repositorio ORM
    const userOrmRepository = AppDataSource.getRepository(UserOrmEntity);
    
    // Instanciamos nuestro Repositorio que implementa IUserRepository (Puerto de salida)
    const userRepository = new TypeOrmUserRepository(userOrmRepository);
    
    // Instanciamos el Caso de Uso (Capa de Aplicación), inyectándole el repositorio
    const userUseCases = new UserUseCasesImpl(userRepository);
    
    // Instanciamos el Controlador (Adaptador de entrada), inyectándole los Casos de Uso
    const userController = new UserController(userUseCases);

    // 3. Configuración de Rutas (Mundo exterior -> Adaptador de entrada)
    app.post("/users", userController.create);
    app.get("/users", userController.getAll);
    app.get("/users/:id", userController.get);
    app.put("/users/:id", userController.update);
    app.delete("/users/:id", userController.delete);

    // 4. Arrancar servidor
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Hexagonal Architecture is fully assembled and listening!`);
    });

  } catch (error) {
    console.error("Error during initialization:", error);
    process.exit(1);
  }
}

bootstrap();
