## Testes unitários com Jest

### O que é Jest?

Jest é um framework de testes em JavaScript, desenvolvido pelo Facebook, que permite escrever testes unitários de forma simples e eficiente. Ele é amplamente utilizado em projetos React, mas pode ser usado com qualquer aplicação JavaScript, como Node.js, NestJS, Angular, Vue.js, entre outros.

### Instalação do Jest

Vamos instalar o Jest no nosso projeto. Execute o seguinte comando no terminal:

```bash
npm install --save-dev jest @types/jest ts-jest
npm install --save-dev @nestjs/testing
```

- O comando `npm install --save-dev jest @types/jest ts-jest` instala o Jest e suas definições de tipo para TypeScript.
- O comando `npm install --save-dev @nestjs/testing` instala o módulo de testes do NestJS, que facilita a criação de testes para aplicações NestJS.

### Configuração do Jest

Note que no arquivo `package.json` já existe uma configuração de comando para o Jest. Caso não exista, adicione a seguinte configuração:

```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

### Criando um suite de testes para o nosso módulo de usuário

#### Teste para a camada de serviço:

Vamos criar um arquivo de teste para o módulo de usuário, camada de serviço. Crie um arquivo chamado `user.service.spec.ts` na pasta `src/users` do seu projeto.

```typescript
import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { PrismaService } from "../prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";

// Mock do PrismaService
// Aqui estamos criando um mock do PrismaService para simular as operações de banco de dados
const mockPrisma = {
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

// Testes para o UsersService
// Aqui estamos criando uma suite de testes para o UsersService, que é responsável por gerenciar usuários
// Usamos o Jest para criar mocks e verificar se as funções estão sendo chamadas corretamente
describe("UsersService", () => {
  let service: UsersService;

  // Antes de cada teste, criamos uma instância do UsersService com o PrismaService mockado
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  // Testes individuais
  // Aqui definimos os testes individuais para cada funcionalidade do UsersService
  it("deve criar um usuário", async () => {
    const dto = { name: "Jonas", email: "jonas@example.com", password: "123" };
    mockPrisma.user.create.mockResolvedValue(dto);

    const result = await service.create(dto as any);
    expect(result).toEqual(dto);
    expect(mockPrisma.user.create).toHaveBeenCalledWith({ data: dto });
  });

  it("deve listar todos os usuários", async () => {
    const users = [{ name: "Jonas" }];
    mockPrisma.user.findMany.mockResolvedValue(users);

    expect(await service.findAll()).toEqual(users);
  });

  it("deve retornar um usuário por ID", async () => {
    const user = { id: 1, name: "Jonas" };
    mockPrisma.user.findUnique.mockResolvedValue(user);

    expect(await service.findOne(1)).toEqual(user);
  });

  it("deve lançar erro se usuário não encontrado", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it("deve atualizar um usuário", async () => {
    const updated = { id: 1, name: "Novo Nome" };
    mockPrisma.user.update.mockResolvedValue(updated);

    expect(await service.update(1, { name: "Novo Nome" })).toEqual(updated);
  });

  it("deve remover um usuário", async () => {
    const removed = { id: 1 };
    mockPrisma.user.delete.mockResolvedValue(removed);

    expect(await service.remove(1)).toEqual(removed);
  });
});
```

#### Testes para a camada de controle:

Vamos criar um arquivo de teste para o módulo de usuário, camada de controle. Crie um arquivo chamado `user.controller.spec.ts` na pasta `src/users` do seu projeto.

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';


const mockUsersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('deve criar um usuário', async () => {
    const dto = { name: 'Jonas' };
    mockUsersService.create.mockResolvedValue(dto);

    expect(await controller.create(dto as any)).toEqual(dto);
    expect(mockUsersService.create).toHaveBeenCalledWith(dto);
  });

  it('deve listar todos', async () => {
    const list = [{ name: 'Jonas' }];
    mockUsersService.findAll.mockResolvedValue(list);

    expect(await controller.findAll()).toEqual(list);
  });

  it('deve buscar por ID', async () => {
    const user = { id: 1, name: 'Jonas' };
    mockUsersService.findOne.mockResolvedValue(user);

    expect(await controller.findOne('1')).toEqual(user);
    expect(mockUsersService.findOne).toHaveBeenCalledWith(1);
  });

  it('deve atualizar', async () => {
    const updated = { id: 1, name: 'Novo' };
    mockUsersService.update.mockResolvedValue(updated);

    expect(await controller.update('1', { name: 'Novo' })).toEqual(updated);
  });

  it('deve remover', async () => {
    const removed = { id: 1 };
    mockUsersService.remove.mockResolvedValue(removed);

    expect(await controller.remove('1')).toEqual(removed);
  });
});
```


### Criando uma suite de testes para nosso módulo de lugares(places)

#### Testes para a camada de controle:
Crie um arquivo de teste para o módulo de lugares, camada de controle. Crie um arquivo chamado `places.controller.spec.ts` na pasta `src/places` do seu projeto.

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { CloudinaryService } from './cloudinary.service';
import { BadRequestException } from '@nestjs/common';

describe('PlaceController', () => {
  let controller: PlaceController;
  let placeService: jest.Mocked<PlaceService>;
  let cloudinaryService: jest.Mocked<CloudinaryService>;

  beforeEach(async () => {
    const mockPlaceService = {
      findAll: jest.fn(),
      findPaginated: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    const mockCloudinaryService = {
      uploadImage: jest.fn(),
      deleteImage: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaceController],
      providers: [
        { provide: PlaceService, useValue: mockPlaceService },
        { provide: CloudinaryService, useValue: mockCloudinaryService },
      ],
    }).compile();

    controller = module.get<PlaceController>(PlaceController);
    placeService = module.get(PlaceService);
    cloudinaryService = module.get(CloudinaryService);
  });

  it('deve listar todos os locais', async () => {
    const places: Place[] = [
      {
        id: '1',
        name: 'Praia Bonita',
        type: placeType.BAR, // valor válido para placeType
        phone: '12345678',
        latitude: -23.5,
        longitude: -46.6,
        images: [],
        created_at: new Date(),
      },
    ];
    placeService.findAll.mockResolvedValue(places);

    expect(await controller.findAll()).toEqual(places);
    expect(placeService.findAll).toHaveBeenCalled();
  });

  it('deve listar locais paginados', async () => {
    const paginated = { data: [], meta: {} };
    placeService.findPaginated.mockResolvedValue(paginated);

    const result = await controller.findPaginated(1 as any, 10 as any);
    expect(result).toEqual(paginated);
  });

  it('deve criar um local com imagens', async () => {
    const dto = { name: 'Praça' };
    const files = { images: [{ buffer: Buffer.from('img') }] } as any;
    cloudinaryService.uploadImage.mockResolvedValue({ url: 'nova', public_id: 'id' });
    placeService.create.mockResolvedValue({ id: '1', ...dto });

    const result = await controller.createPlace(dto as any, files);
    expect(result.id).toBe('1');
    expect(cloudinaryService.uploadImage).toHaveBeenCalled();
    expect(placeService.create).toHaveBeenCalled();
  });

  it('deve lançar erro ao criar sem imagens', async () => {
    await expect(
      controller.createPlace({} as any, { images: [] } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('deve atualizar local', async () => {
    const updated = { id: '1', name: 'Novo' };
    placeService.update.mockResolvedValue(updated);

    const result = await controller.updatePlace('1', { name: 'Novo' }, { images: [] } as any);
    expect(result).toEqual(updated);
  });

  it('deve deletar local', async () => {
    placeService.delete.mockResolvedValue(undefined);

    expect(await controller.deletePlace('1')).toBeUndefined();
    expect(placeService.delete).toHaveBeenCalledWith('1');
  });
});
```





### Executando os testes
Para executar os testes, você pode usar o seguinte comando no terminal:
```bash
npm test
```
Isso executará todos os testes definidos no seu projeto. Se você quiser executar os testes em modo de observação (watch mode), use:
```bash
npm test:watch
```
Se você quiser verificar a cobertura dos testes, use:

```bash
npm test:cov
```