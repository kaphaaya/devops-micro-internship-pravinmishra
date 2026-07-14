import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProductsService } from './products.service'
import { Product } from './entities/product.entity'
import { Category } from './entities/category.entity'
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common'

describe('ProductsService', () => {
  let service: ProductsService
  let productRepository: Repository<Product>
  let categoryRepository: Repository<Category>

  const tenantId = '550e8400-e29b-41d4-a716-446655440000'
  const categoryId = '550e8400-e29b-41d4-a716-446655440001'
  const productId = '550e8400-e29b-41d4-a716-446655440002'

  const mockCategory: Category = {
    id: categoryId as any,
    tenantId: tenantId as any,
    locationId: null,
    name: 'Appetizers',
    description: 'Appetizer dishes',
    imageUrl: 'https://example.com/appetizers.jpg',
    displayOrder: 1,
    status: 'active',
    products: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockProduct: Product = {
    id: productId as any,
    tenantId: tenantId as any,
    locationId: null,
    categoryId: categoryId as any,
    sku: 'APP-001',
    barcode: '1234567890',
    name: 'Bruschetta',
    description: 'Toasted bread with tomatoes',
    imageUrl: 'https://example.com/bruschetta.jpg',
    unitPrice: 8.99,
    costPrice: 2.5,
    taxPercentage: 8,
    unitOfMeasure: 'piece',
    isMenuItem: true,
    isInventoryItem: false,
    isTaxable: true,
    isActive: true,
    status: 'active',
    metadata: { allergens: ['gluten'] },
    category: mockCategory,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            findAndCount: jest.fn(),
            count: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Category),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            count: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<ProductsService>(ProductsService)
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product))
    categoryRepository = module.get<Repository<Category>>(getRepositoryToken(Category))
  })

  describe('Category Management', () => {
    describe('createCategory', () => {
      it('should create a new category', async () => {
        const createDto = { name: 'Appetizers', description: 'Appetizer dishes' }

        jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null)
        jest.spyOn(categoryRepository, 'create').mockReturnValue(mockCategory)
        jest.spyOn(categoryRepository, 'save').mockResolvedValue(mockCategory)

        const result = await service.createCategory(tenantId, createDto)

        expect(result).toBeDefined()
        expect(result.name).toBe(mockCategory.name)
        expect(categoryRepository.save).toHaveBeenCalled()
      })

      it('should throw ConflictException if category already exists', async () => {
        const createDto = { name: 'Appetizers' }

        jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(mockCategory)

        await expect(service.createCategory(tenantId, createDto)).rejects.toThrow(
          ConflictException,
        )
      })
    })

    describe('getCategoryById', () => {
      it('should return a category by ID', async () => {
        jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(mockCategory)

        const result = await service.getCategoryById(tenantId, categoryId)

        expect(result).toBeDefined()
        expect(result.id).toBe(mockCategory.id)
        expect(result.name).toBe(mockCategory.name)
      })

      it('should throw NotFoundException if category does not exist', async () => {
        jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null)

        await expect(service.getCategoryById(tenantId, 'non-existent')).rejects.toThrow(
          NotFoundException,
        )
      })
    })

    describe('listCategories', () => {
      it('should return paginated list of categories', async () => {
        jest.spyOn(categoryRepository, 'findAndCount').mockResolvedValue([[mockCategory], 1])

        const result = await service.listCategories(tenantId, undefined, 0, 50)

        expect(result).toBeDefined()
        expect(result.data).toHaveLength(1)
        expect(result.total).toBe(1)
      })

      it('should filter by location if provided', async () => {
        jest.spyOn(categoryRepository, 'findAndCount').mockResolvedValue([[mockCategory], 1])

        await service.listCategories(tenantId, 'location-1', 0, 50)

        expect(categoryRepository.findAndCount).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              tenantId: tenantId as any,
            }),
          }),
        )
      })
    })

    describe('updateCategory', () => {
      it('should update category details', async () => {
        const updateDto = { name: 'Updated Appetizers' }
        const updated = { ...mockCategory, name: updateDto.name }

        jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(mockCategory)
        jest.spyOn(categoryRepository, 'save').mockResolvedValue(updated)

        const result = await service.updateCategory(tenantId, categoryId, updateDto)

        expect(result.name).toBe(updateDto.name)
      })

      it('should throw NotFoundException if category does not exist', async () => {
        jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null)

        await expect(
          service.updateCategory(tenantId, 'non-existent', {}),
        ).rejects.toThrow(NotFoundException)
      })
    })

    describe('deleteCategory', () => {
      it('should delete a category with no products', async () => {
        jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(mockCategory)
        jest.spyOn(productRepository, 'count').mockResolvedValue(0)
        jest.spyOn(categoryRepository, 'delete').mockResolvedValue({ affected: 1 } as any)

        await service.deleteCategory(tenantId, categoryId)

        expect(categoryRepository.delete).toHaveBeenCalled()
      })

      it('should throw error if category has products', async () => {
        jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(mockCategory)
        jest.spyOn(productRepository, 'count').mockResolvedValue(5)

        await expect(service.deleteCategory(tenantId, categoryId)).rejects.toThrow(
          BadRequestException,
        )
      })
    })
  })

  describe('Product Management', () => {
    describe('createProduct', () => {
      it('should create a new product', async () => {
        const createDto = {
          name: 'Bruschetta',
          unitPrice: 8.99,
          sku: 'APP-001',
        }

        jest.spyOn(productRepository, 'findOne').mockResolvedValue(null)
        jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(mockCategory)
        jest.spyOn(productRepository, 'create').mockReturnValue(mockProduct)
        jest.spyOn(productRepository, 'save').mockResolvedValue(mockProduct)

        const result = await service.createProduct(tenantId, createDto)

        expect(result).toBeDefined()
        expect(result.name).toBe(mockProduct.name)
        expect(productRepository.save).toHaveBeenCalled()
      })

      it('should throw ConflictException if SKU already exists', async () => {
        const createDto = { name: 'Product', unitPrice: 10, sku: 'APP-001' }

        jest.spyOn(productRepository, 'findOne').mockResolvedValue(mockProduct)

        await expect(service.createProduct(tenantId, createDto)).rejects.toThrow(
          ConflictException,
        )
      })

      it('should throw NotFoundException if category does not exist', async () => {
        const createDto = {
          name: 'Product',
          unitPrice: 10,
          categoryId: 'non-existent',
        }

        jest.spyOn(productRepository, 'findOne').mockResolvedValue(null)
        jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null)

        await expect(service.createProduct(tenantId, createDto)).rejects.toThrow(
          NotFoundException,
        )
      })
    })

    describe('getProductById', () => {
      it('should return a product by ID', async () => {
        jest.spyOn(productRepository, 'findOne').mockResolvedValue(mockProduct)

        const result = await service.getProductById(tenantId, productId)

        expect(result).toBeDefined()
        expect(result.id).toBe(mockProduct.id)
        expect(result.name).toBe(mockProduct.name)
      })

      it('should throw NotFoundException if product does not exist', async () => {
        jest.spyOn(productRepository, 'findOne').mockResolvedValue(null)

        await expect(service.getProductById(tenantId, 'non-existent')).rejects.toThrow(
          NotFoundException,
        )
      })
    })

    describe('listProducts', () => {
      it('should return paginated list of products', async () => {
        jest.spyOn(productRepository, 'findAndCount').mockResolvedValue([[mockProduct], 1])

        const result = await service.listProducts(tenantId, {}, 0, 50)

        expect(result).toBeDefined()
        expect(result.data).toHaveLength(1)
        expect(result.total).toBe(1)
      })

      it('should filter by category', async () => {
        jest.spyOn(productRepository, 'findAndCount').mockResolvedValue([[mockProduct], 1])

        await service.listProducts(tenantId, { categoryId }, 0, 50)

        expect(productRepository.findAndCount).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              categoryId: categoryId as any,
            }),
          }),
        )
      })

      it('should search by name', async () => {
        jest.spyOn(productRepository, 'findAndCount').mockResolvedValue([[mockProduct], 1])

        await service.listProducts(tenantId, { search: 'Bruschetta' }, 0, 50)

        expect(productRepository.findAndCount).toHaveBeenCalled()
      })
    })

    describe('searchProducts', () => {
      it('should search products by name or SKU', async () => {
        jest.spyOn(productRepository, 'find').mockResolvedValue([mockProduct])

        const result = await service.searchProducts(tenantId, 'Bruschetta', 20)

        expect(result).toBeDefined()
        expect(result).toHaveLength(1)
        expect(result[0].name).toBe(mockProduct.name)
      })
    })

    describe('getProductsByCategory', () => {
      it('should return products in a category', async () => {
        jest.spyOn(productRepository, 'findAndCount').mockResolvedValue([[mockProduct], 1])

        const result = await service.getProductsByCategory(tenantId, categoryId, 0, 50)

        expect(result).toBeDefined()
        expect(result.data).toHaveLength(1)
      })
    })

    describe('updateProduct', () => {
      it('should update product details', async () => {
        const updateDto = { name: 'Updated Bruschetta', unitPrice: 9.99 }
        const updated = { ...mockProduct, ...updateDto }

        jest.spyOn(productRepository, 'findOne').mockResolvedValue(mockProduct)
        jest.spyOn(productRepository, 'save').mockResolvedValue(updated)

        const result = await service.updateProduct(tenantId, productId, updateDto)

        expect(result.name).toBe(updateDto.name)
        expect(result.unitPrice).toBe(updateDto.unitPrice)
      })

      it('should throw NotFoundException if product does not exist', async () => {
        jest.spyOn(productRepository, 'findOne').mockResolvedValue(null)

        await expect(
          service.updateProduct(tenantId, 'non-existent', {}),
        ).rejects.toThrow(NotFoundException)
      })
    })

    describe('deleteProduct', () => {
      it('should soft delete a product', async () => {
        jest.spyOn(productRepository, 'findOne').mockResolvedValue(mockProduct)
        jest.spyOn(productRepository, 'save').mockResolvedValue(mockProduct)

        await service.deleteProduct(tenantId, productId)

        expect(productRepository.save).toHaveBeenCalled()
      })

      it('should throw NotFoundException if product does not exist', async () => {
        jest.spyOn(productRepository, 'findOne').mockResolvedValue(null)

        await expect(service.deleteProduct(tenantId, 'non-existent')).rejects.toThrow(
          NotFoundException,
        )
      })
    })

    describe('getProductPricing', () => {
      it('should return product pricing', async () => {
        jest.spyOn(productRepository, 'findOne').mockResolvedValue(mockProduct)

        const result = await service.getProductPricing(tenantId, productId)

        expect(result).toBeDefined()
        expect(result.unitPrice).toBe(8.99)
        expect(result.taxPercentage).toBe(8)
      })
    })

    describe('getProductsBulk', () => {
      it('should return multiple products by IDs', async () => {
        jest.spyOn(productRepository, 'find').mockResolvedValue([mockProduct])

        const result = await service.getProductsBulk(tenantId, [productId])

        expect(result).toBeDefined()
        expect(result).toHaveLength(1)
      })
    })
  })
})
