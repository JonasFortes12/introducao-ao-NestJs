import { Test, TestingModule } from '@nestjs/testing';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { CloudinaryService } from './cloudinary.service';
import { Place, placeType } from '@prisma/client';


describe('PlaceController testes', () => {
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
        { provide: PlaceService, useValue: mockPlaceService },
        { provide: CloudinaryService, useValue: mockCloudinaryService },
      ],
    }).compile();

    controller = module.get<PlaceController>(PlaceController);
    placeService = module.get(PlaceService);
    cloudinaryService = module.get(CloudinaryService);
  });

  // "Deve listar todos os locais"
  it('deve listar todos os locais', async () => {
    const places: Place[] = [
      {
        id: "1",
        name: 'Bar Tunico',
        type: placeType.BAR,
        phone: '899223',
        latitude: 23.6,
        longitude: 23.5,
        images: [],
        created_at: new Date()
      },
    ];

    placeService.findAll.mockResolvedValue(places);

    expect(await controller.findAll()).toEqual(places);



  });

  // "Deve listar locais paginados"
  //...
});
