import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

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
describe('Suit de testes para serviços de usuáios', () => {
  let service: UserService; 

  //Antes de cada teste, criamos uma instância do UserService com
  // o PrimsaService mockado
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UserService>(UserService)
    

  });

  // Testes Individuais------------------------

  //01. Teste do método UserService.create
  it('deve criar um usuário', async () => {
    const userDataDto = {
      name: 'Jonas',
      email: 'jonas@gmail.com',
    };

    mockPrisma.user.create.mockResolvedValue(userDataDto)

    const result = await service.create(userDataDto as any)

    expect(result).toEqual(userDataDto)
    expect(mockPrisma.user.create).toHaveBeenCalledWith({data: userDataDto})

  });

  //02. Teste para o método UserService.findAll
  it("deve listar todos os usuários", async () => {
    const users = [
      {id: 1, name: "Jonas", email: "jonas@gmail.com"},
      {id: 2, name: "willian", email: "wilian@gmail.com"},
      {id: 3, name: "felipe", email: "felipe@gmail.com"}
    ]

    mockPrisma.user.findMany.mockResolvedValue(users)

    const result = await service.findAll()
  
    expect(result).toEqual(users)

  })
  

});

// Executar os  testes: npm test
