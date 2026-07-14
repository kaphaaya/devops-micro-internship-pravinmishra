import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, ILike, In, IsNull } from 'typeorm'
import { Product } from './entities/product.entity'
import { Category } from './entities/category.entity'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { ProductDto, CategoryDto, ProductSearchDto } from './dto/product.dto'
import { generateUUID } from '@hbos/core'

/**
 * Products Service
 * Handles product and category management for menu items and inventory
 */
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  // ============================================================================
  // Category Management
  // ============================================================================

  /**
   * Create a new category
   */
  async createCategory(tenantId: string, createCategoryDto: CreateCategoryDto): Promise<CategoryDto> {
    const { name, locationId } = createCategoryDto

    // Check for duplicate category name within location
    const existing = await this.categoriesRepository.findOne({
      where: { tenantId: tenantId as any, name, locationId: locationId as any },
    })

    if (existing) {
      throw new ConflictException(`Category "${name}" already exists`)
    }

    const category = this.categoriesRepository.create({
      id: generateUUID() as any,
      tenantId: tenantId as any,
      name,
      locationId: locationId as any,
      description: createCategoryDto.description,
      imageUrl: createCategoryDto.imageUrl,
      displayOrder: createCategoryDto.displayOrder || 0,
      status: 'active',
    })

    const saved = await this.categoriesRepository.save(category)
    return this.mapCategoryToDto(saved)
  }

  /**
   * Get category by ID
   */
  async getCategoryById(tenantId: string, categoryId: string): Promise<CategoryDto> {
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId as any, tenantId: tenantId as any },
    })

    if (!category) {
      throw new NotFoundException(`Category not found`)
    }

    return this.mapCategoryToDto(category)
  }

  /**
   * List categories for tenant (optional location filter)
   */
  async listCategories(
    tenantId: string,
    locationId?: string,
    skip = 0,
    take = 50,
  ): Promise<{ data: CategoryDto[]; total: number }> {
    const where: any = { tenantId: tenantId as any, status: 'active' }

    if (locationId) {
      // Get categories for this location OR tenant-wide categories
      where.locationId = In([locationId as any, null])
    }

    const [categories, total] = await this.categoriesRepository.findAndCount({
      where,
      skip,
      take,
      order: { displayOrder: 'ASC', createdAt: 'DESC' },
    })

    return {
      data: categories.map(c => this.mapCategoryToDto(c)),
      total,
    }
  }

  /**
   * Update category
   */
  async updateCategory(
    tenantId: string,
    categoryId: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId as any, tenantId: tenantId as any },
    })

    if (!category) {
      throw new NotFoundException(`Category not found`)
    }

    // Update allowed fields
    if (updateCategoryDto.name) {
      const existing = await this.categoriesRepository.findOne({
        where: {
          tenantId: tenantId as any,
          name: updateCategoryDto.name,
          locationId: category.locationId as any,
        },
      })
      if (existing && existing.id !== category.id) {
        throw new ConflictException(`Category "${updateCategoryDto.name}" already exists`)
      }
      category.name = updateCategoryDto.name
    }

    if (updateCategoryDto.description !== undefined) {
      category.description = updateCategoryDto.description
    }

    if (updateCategoryDto.imageUrl !== undefined) {
      category.imageUrl = updateCategoryDto.imageUrl
    }

    if (updateCategoryDto.displayOrder !== undefined) {
      category.displayOrder = updateCategoryDto.displayOrder
    }

    if (updateCategoryDto.status) {
      category.status = updateCategoryDto.status
    }

    const updated = await this.categoriesRepository.save(category)
    return this.mapCategoryToDto(updated)
  }

  /**
   * Delete category (only if no products)
   */
  async deleteCategory(tenantId: string, categoryId: string): Promise<void> {
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId as any, tenantId: tenantId as any },
    })

    if (!category) {
      throw new NotFoundException(`Category not found`)
    }

    // Check if category has products
    const productCount = await this.productsRepository.count({
      where: { categoryId: categoryId as any, tenantId: tenantId as any },
    })

    if (productCount > 0) {
      throw new BadRequestException(
        `Cannot delete category with ${productCount} product(s). Move or delete products first.`,
      )
    }

    await this.categoriesRepository.delete({ id: categoryId as any })
  }

  // ============================================================================
  // Product Management
  // ============================================================================

  /**
   * Create a new product
   */
  async createProduct(tenantId: string, createProductDto: CreateProductDto): Promise<ProductDto> {
    const { name, sku, locationId, categoryId } = createProductDto

    // Check for duplicate SKU (per tenant)
    if (sku) {
      const existing = await this.productsRepository.findOne({
        where: { tenantId: tenantId as any, sku },
      })

      if (existing) {
        throw new ConflictException(`Product with SKU "${sku}" already exists`)
      }
    }

    // Verify category exists if provided
    if (categoryId) {
      const category = await this.categoriesRepository.findOne({
        where: { id: categoryId as any, tenantId: tenantId as any },
      })
      if (!category) {
        throw new NotFoundException(`Category not found`)
      }
    }

    const product = this.productsRepository.create({
      id: generateUUID() as any,
      tenantId: tenantId as any,
      name,
      sku,
      barcode: createProductDto.barcode,
      description: createProductDto.description,
      imageUrl: createProductDto.imageUrl,
      unitPrice: createProductDto.unitPrice,
      costPrice: createProductDto.costPrice,
      taxPercentage: createProductDto.taxPercentage || 0,
      unitOfMeasure: createProductDto.unitOfMeasure || 'piece',
      isMenuItem: createProductDto.isMenuItem ?? true,
      isInventoryItem: createProductDto.isInventoryItem ?? false,
      isTaxable: createProductDto.isTaxable ?? true,
      isActive: true,
      status: 'active',
      categoryId: categoryId as any,
      locationId: locationId as any,
      metadata: createProductDto.metadata || {},
    })

    const saved = await this.productsRepository.save(product)
    return this.mapProductToDto(saved)
  }

  /**
   * Get product by ID
   */
  async getProductById(tenantId: string, productId: string): Promise<ProductDto> {
    const product = await this.productsRepository.findOne({
      where: { id: productId as any, tenantId: tenantId as any },
      relations: ['category'],
    })

    if (!product) {
      throw new NotFoundException(`Product not found`)
    }

    return this.mapProductToDto(product)
  }

  /**
   * List products for tenant (with filtering)
   */
  async listProducts(
    tenantId: string,
    filters?: {
      locationId?: string
      categoryId?: string
      isMenuItem?: boolean
      isInventoryItem?: boolean
      status?: string
      search?: string
    },
    skip = 0,
    take = 50,
  ): Promise<{ data: ProductDto[]; total: number }> {
    const where: any = { tenantId: tenantId as any }

    if (filters?.locationId) {
      // Products for location OR tenant-wide products
      where.locationId = In([filters.locationId as any, null])
    }

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId as any
    }

    if (filters?.isMenuItem !== undefined) {
      where.isMenuItem = filters.isMenuItem
    }

    if (filters?.isInventoryItem !== undefined) {
      where.isInventoryItem = filters.isInventoryItem
    }

    if (filters?.status) {
      where.status = filters.status
    } else {
      // Default to active products only
      where.status = 'active'
    }

    if (filters?.search) {
      where.name = ILike(`%${filters.search}%`)
    }

    const [products, total] = await this.productsRepository.findAndCount({
      where,
      relations: ['category'],
      skip,
      take,
      order: { createdAt: 'DESC' },
    })

    return {
      data: products.map(p => this.mapProductToDto(p)),
      total,
    }
  }

  /**
   * Search products by name or SKU
   */
  async searchProducts(
    tenantId: string,
    query: string,
    limit = 20,
  ): Promise<ProductSearchDto[]> {
    const products = await this.productsRepository.find({
      where: [
        { tenantId: tenantId as any, name: ILike(`%${query}%`) },
        { tenantId: tenantId as any, sku: ILike(`%${query}%`) },
      ],
      select: ['id', 'name', 'sku', 'unitPrice', 'categoryId', 'status'],
      take: limit,
    })

    return products.map(p => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      unitPrice: parseFloat(p.unitPrice as any),
      categoryId: p.categoryId,
      status: p.status,
    }))
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(
    tenantId: string,
    categoryId: string,
    skip = 0,
    take = 50,
  ): Promise<{ data: ProductDto[]; total: number }> {
    const [products, total] = await this.productsRepository.findAndCount({
      where: { tenantId: tenantId as any, categoryId: categoryId as any, status: 'active' },
      relations: ['category'],
      skip,
      take,
      order: { name: 'ASC' },
    })

    return {
      data: products.map(p => this.mapProductToDto(p)),
      total,
    }
  }

  /**
   * Update product
   */
  async updateProduct(
    tenantId: string,
    productId: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDto> {
    const product = await this.productsRepository.findOne({
      where: { id: productId as any, tenantId: tenantId as any },
      relations: ['category'],
    })

    if (!product) {
      throw new NotFoundException(`Product not found`)
    }

    // Check SKU uniqueness if changed
    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      const existing = await this.productsRepository.findOne({
        where: { tenantId: tenantId as any, sku: updateProductDto.sku },
      })
      if (existing) {
        throw new ConflictException(`Product with SKU "${updateProductDto.sku}" already exists`)
      }
    }

    // Verify category exists if changed
    if (updateProductDto.categoryId && updateProductDto.categoryId !== product.categoryId) {
      const category = await this.categoriesRepository.findOne({
        where: { id: updateProductDto.categoryId as any, tenantId: tenantId as any },
      })
      if (!category) {
        throw new NotFoundException(`Category not found`)
      }
    }

    // Update allowed fields
    if (updateProductDto.name) product.name = updateProductDto.name
    if (updateProductDto.sku !== undefined) product.sku = updateProductDto.sku
    if (updateProductDto.barcode !== undefined) product.barcode = updateProductDto.barcode
    if (updateProductDto.description !== undefined) product.description = updateProductDto.description
    if (updateProductDto.imageUrl !== undefined) product.imageUrl = updateProductDto.imageUrl
    if (updateProductDto.unitPrice !== undefined) product.unitPrice = updateProductDto.unitPrice
    if (updateProductDto.costPrice !== undefined) product.costPrice = updateProductDto.costPrice
    if (updateProductDto.taxPercentage !== undefined) product.taxPercentage = updateProductDto.taxPercentage
    if (updateProductDto.unitOfMeasure !== undefined) product.unitOfMeasure = updateProductDto.unitOfMeasure
    if (updateProductDto.isMenuItem !== undefined) product.isMenuItem = updateProductDto.isMenuItem
    if (updateProductDto.isInventoryItem !== undefined) product.isInventoryItem = updateProductDto.isInventoryItem
    if (updateProductDto.isTaxable !== undefined) product.isTaxable = updateProductDto.isTaxable
    if (updateProductDto.isActive !== undefined) product.isActive = updateProductDto.isActive
    if (updateProductDto.status) product.status = updateProductDto.status
    if (updateProductDto.categoryId !== undefined) product.categoryId = updateProductDto.categoryId as any
    if (updateProductDto.metadata !== undefined) product.metadata = { ...product.metadata, ...updateProductDto.metadata }

    const updated = await this.productsRepository.save(product)
    return this.mapProductToDto(updated)
  }

  /**
   * Soft delete product
   */
  async deleteProduct(tenantId: string, productId: string): Promise<void> {
    const product = await this.productsRepository.findOne({
      where: { id: productId as any, tenantId: tenantId as any },
    })

    if (!product) {
      throw new NotFoundException(`Product not found`)
    }

    // Soft delete
    product.status = 'discontinued'
    product.isActive = false
    await this.productsRepository.save(product)
  }

  /**
   * Get pricing for product (for orders)
   */
  async getProductPricing(
    tenantId: string,
    productId: string,
  ): Promise<{ unitPrice: number; costPrice?: number; taxPercentage: number; isTaxable: boolean }> {
    const product = await this.productsRepository.findOne({
      where: { id: productId as any, tenantId: tenantId as any },
      select: ['unitPrice', 'costPrice', 'taxPercentage', 'isTaxable'],
    })

    if (!product) {
      throw new NotFoundException(`Product not found`)
    }

    return {
      unitPrice: parseFloat(product.unitPrice as any),
      costPrice: product.costPrice ? parseFloat(product.costPrice as any) : undefined,
      taxPercentage: parseFloat(product.taxPercentage as any),
      isTaxable: product.isTaxable,
    }
  }

  /**
   * Bulk get products (for orders)
   */
  async getProductsBulk(
    tenantId: string,
    productIds: string[],
  ): Promise<ProductDto[]> {
    const products = await this.productsRepository.find({
      where: { id: In(productIds as any[]), tenantId: tenantId as any },
      relations: ['category'],
    })

    return products.map(p => this.mapProductToDto(p))
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private mapCategoryToDto(category: Category): CategoryDto {
    return {
      id: category.id,
      tenantId: category.tenantId,
      locationId: category.locationId,
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl,
      displayOrder: category.displayOrder,
      status: category.status,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }
  }

  private mapProductToDto(product: Product): ProductDto {
    return {
      id: product.id,
      tenantId: product.tenantId,
      locationId: product.locationId,
      categoryId: product.categoryId,
      sku: product.sku,
      barcode: product.barcode,
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      unitPrice: parseFloat(product.unitPrice as any),
      costPrice: product.costPrice ? parseFloat(product.costPrice as any) : undefined,
      taxPercentage: parseFloat(product.taxPercentage as any),
      unitOfMeasure: product.unitOfMeasure,
      isMenuItem: product.isMenuItem,
      isInventoryItem: product.isInventoryItem,
      isTaxable: product.isTaxable,
      isActive: product.isActive,
      status: product.status,
      metadata: product.metadata,
      category: product.category ? this.mapCategoryToDto(product.category) : undefined,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }
  }
}
