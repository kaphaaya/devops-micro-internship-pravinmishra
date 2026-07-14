import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { ProductDto, CategoryDto, ProductSearchDto } from './dto/product.dto'

/**
 * Products Controller
 * Handles product and category management
 */
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // ============================================================================
  // Category Endpoints
  // ============================================================================

  /**
   * POST /products/categories
   * Create a new category
   */
  @Post('categories')
  @HttpCode(HttpStatus.CREATED)
  async createCategory(
    @Request() req: any,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDto> {
    return this.productsService.createCategory(req.user.tenantId, createCategoryDto)
  }

  /**
   * GET /products/categories
   * List categories
   */
  @Get('categories')
  async listCategories(
    @Request() req: any,
    @Query('locationId') locationId?: string,
    @Query('skip') skip = 0,
    @Query('take') take = 50,
  ): Promise<{ data: CategoryDto[]; total: number }> {
    return this.productsService.listCategories(
      req.user.tenantId,
      locationId,
      parseInt(skip as any),
      parseInt(take as any),
    )
  }

  /**
   * GET /products/categories/:categoryId
   * Get category by ID
   */
  @Get('categories/:categoryId')
  async getCategory(
    @Request() req: any,
    @Param('categoryId') categoryId: string,
  ): Promise<CategoryDto> {
    return this.productsService.getCategoryById(req.user.tenantId, categoryId)
  }

  /**
   * PATCH /products/categories/:categoryId
   * Update category
   */
  @Patch('categories/:categoryId')
  async updateCategory(
    @Request() req: any,
    @Param('categoryId') categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    return this.productsService.updateCategory(req.user.tenantId, categoryId, updateCategoryDto)
  }

  /**
   * DELETE /products/categories/:categoryId
   * Delete category
   */
  @Delete('categories/:categoryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCategory(
    @Request() req: any,
    @Param('categoryId') categoryId: string,
  ): Promise<void> {
    await this.productsService.deleteCategory(req.user.tenantId, categoryId)
  }

  // ============================================================================
  // Product Endpoints
  // ============================================================================

  /**
   * POST /products
   * Create a new product
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(
    @Request() req: any,
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductDto> {
    return this.productsService.createProduct(req.user.tenantId, createProductDto)
  }

  /**
   * GET /products
   * List products with filters
   */
  @Get()
  async listProducts(
    @Request() req: any,
    @Query('locationId') locationId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('isMenuItem') isMenuItem?: string,
    @Query('isInventoryItem') isInventoryItem?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('skip') skip = 0,
    @Query('take') take = 50,
  ): Promise<{ data: ProductDto[]; total: number }> {
    const filters = {
      locationId,
      categoryId,
      isMenuItem: isMenuItem === 'true',
      isInventoryItem: isInventoryItem === 'true',
      status,
      search,
    }

    return this.productsService.listProducts(
      req.user.tenantId,
      filters,
      parseInt(skip as any),
      parseInt(take as any),
    )
  }

  /**
   * GET /products/search
   * Search products by name or SKU
   */
  @Get('search')
  async searchProducts(
    @Request() req: any,
    @Query('q') query: string,
    @Query('limit') limit = 20,
  ): Promise<ProductSearchDto[]> {
    return this.productsService.searchProducts(req.user.tenantId, query, parseInt(limit as any))
  }

  /**
   * GET /products/category/:categoryId
   * Get products by category
   */
  @Get('category/:categoryId')
  async getProductsByCategory(
    @Request() req: any,
    @Param('categoryId') categoryId: string,
    @Query('skip') skip = 0,
    @Query('take') take = 50,
  ): Promise<{ data: ProductDto[]; total: number }> {
    return this.productsService.getProductsByCategory(
      req.user.tenantId,
      categoryId,
      parseInt(skip as any),
      parseInt(take as any),
    )
  }

  /**
   * GET /products/:productId
   * Get product by ID
   */
  @Get(':productId')
  async getProduct(
    @Request() req: any,
    @Param('productId') productId: string,
  ): Promise<ProductDto> {
    return this.productsService.getProductById(req.user.tenantId, productId)
  }

  /**
   * PATCH /products/:productId
   * Update product
   */
  @Patch(':productId')
  async updateProduct(
    @Request() req: any,
    @Param('productId') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductDto> {
    return this.productsService.updateProduct(req.user.tenantId, productId, updateProductDto)
  }

  /**
   * DELETE /products/:productId
   * Delete product (soft delete)
   */
  @Delete(':productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(
    @Request() req: any,
    @Param('productId') productId: string,
  ): Promise<void> {
    await this.productsService.deleteProduct(req.user.tenantId, productId)
  }

  // ============================================================================
  // Pricing Endpoints (Internal - for orders)
  // ============================================================================

  /**
   * GET /products/:productId/pricing
   * Get product pricing (for orders)
   */
  @Get(':productId/pricing')
  async getProductPricing(
    @Request() req: any,
    @Param('productId') productId: string,
  ) {
    return this.productsService.getProductPricing(req.user.tenantId, productId)
  }

  /**
   * POST /products/bulk/pricing
   * Get pricing for multiple products
   */
  @Post('bulk/pricing')
  async getProductsPricing(
    @Request() req: any,
    @Body('productIds') productIds: string[],
  ) {
    const products = await this.productsService.getProductsBulk(req.user.tenantId, productIds)
    return products.map(p => ({
      id: p.id,
      name: p.name,
      unitPrice: p.unitPrice,
      costPrice: p.costPrice,
      taxPercentage: p.taxPercentage,
      isTaxable: p.isTaxable,
    }))
  }
}
