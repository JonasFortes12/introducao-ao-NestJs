
import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UserService } from "./users.service";

const mockUserServices = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
}


describe("User Controller Tests", () => {

    let controller: UsersController;
    
    beforeEach( async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {provide: UserService, useValue: mockUserServices},
            ],
        }).compile()

        controller = module.get<UsersController>(UsersController)
    });

    it('deve criar listar todos os usuario', async () => {
        const users = [
            {name: "Jonas", email: "jonas@gmail.com"},
            {name: "Joao", email: "joao@gmail.com"}
        ]
        mockUserServices.findAll.mockResolvedValue(users)

        expect(await controller.findAll()).toEqual(users)

    })
    

})
