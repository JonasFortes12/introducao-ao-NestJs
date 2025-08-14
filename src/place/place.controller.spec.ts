import { Test, TestingModule } from "@nestjs/testing";
import { PlaceController } from "./place.controller";
import { PlaceService } from "./place.service";
import { CloudinaryService } from "./cloudinary.service";



describe("PlaceController testes", ()=> {

    let controller: PlaceController;
    let placeService: jest.Mocked<PlaceService>;
    let cloudinaryService: jest.Mocked<CloudinaryService>;

    beforeEach(async () => {
        const mockPlaceService = {
            findAll: jest.fn(),
            findPaginated: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        } as any;

        const mockCloudinaryService = {
            uploadImage: jest.fn(),
            deleteImage: jest.fn(),
        } as any;

        const module: TestingModule = await Test.createTestingModule({
            controllers: [PlaceController],
            providers: [
                {provide: PlaceService, useValue: mockPlaceService},
                {provide: CloudinaryService, useValue: mockCloudinaryService}
            ]
        }).compile()

        controller = module.get<PlaceController>(PlaceController);
        placeService = module.get(mockPlaceService);
        cloudinaryService = module.get(mockCloudinaryService);
    });

    // "Deve listar todos os locais"
    




})