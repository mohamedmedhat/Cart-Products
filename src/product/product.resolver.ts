import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { PaginatedProducts } from './entities/pagination';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly _productService: ProductService) {}

  @Mutation(() => PaginatedProducts)
  async deleteProduct(
    @Args('productId', { type: () => Int }) productId: number,
  ): Promise<PaginatedProducts> {
    const [products, total] =
      await this._productService.removeProduct(productId);
    return { products, total };
  }

  @Query(() => Product)
  async getProductById(
    @Args('productId', { type: () => Int }) productId: number,
  ): Promise<Product> {
    return await this._productService.findProductById(productId);
  }

  @Query(() => PaginatedProducts)
  async getAllProducts(
    @Args('page', { type: () => Int }) page: number,
    @Args('pageSize', { type: () => Int }) pageSize: number,
  ): Promise<PaginatedProducts> {
    const [products, total] = await this._productService.getAllProducts(
      page,
      pageSize,
    );
    return { products, total };
  }

  @Query(() => PaginatedProducts)
  async getProductsHighestPrice(
    @Args('page', { type: () => Int }) page: number,
    @Args('pageSize', { type: () => Int }) pageSize: number,
  ): Promise<PaginatedProducts> {
    const [products, total] =
      await this._productService.filterProductsByHighestPrice(page, pageSize);
    return { products, total };
  }

  @Query(() => PaginatedProducts)
  async getProductsLowestPrice(
    @Args('page', { type: () => Int }) page: number,
    @Args('pageSize', { type: () => Int }) pageSize: number,
  ): Promise<PaginatedProducts> {
    const [products, total] =
      await this._productService.filterProductsByLowestPrice(page, pageSize);
    return { products, total };
  }

  @Query(() => PaginatedProducts)
  async getProductsAvailableSalePrice(
    @Args('page', { type: () => Int }) page: number,
    @Args('pageSize', { type: () => Int }) pageSize: number,
  ): Promise<PaginatedProducts> {
    const [products, total] =
      await this._productService.filterProductsAvailableSalePrice(
        page,
        pageSize,
      );
    return { products, total };
  }

  @Query(() => PaginatedProducts)
  async getProductsPriceLessThanOneHundered(
    @Args('page', { type: () => Int }) page: number,
    @Args('pageSize', { type: () => Int }) pageSize: number,
  ): Promise<PaginatedProducts> {
    const [products, total] =
      await this._productService.filterProductsWherePriceLessThanOneHundered(
        page,
        pageSize,
      );
    return { products, total };
  }

  @Query(() => PaginatedProducts)
  async getProductsPriceBetweenOneHundredAndOneThousand(
    @Args('page', { type: () => Int }) page: number,
    @Args('pageSize', { type: () => Int }) pageSize: number,
  ): Promise<PaginatedProducts> {
    const [products, total] =
      await this._productService.filterProductsWherePriceBetweenOneHunderedAndOneThousand(
        page,
        pageSize,
      );
    return { products, total };
  }

  @Query(() => PaginatedProducts)
  async getProductsPriceAboveOneThousand(
    @Args('page', { type: () => Int }) page: number,
    @Args('pageSize', { type: () => Int }) pageSize: number,
  ): Promise<PaginatedProducts> {
    const [products, total] =
      await this._productService.filterProductsWherePriceMoreThanOneThousand(
        page,
        pageSize,
      );
    return { products, total };
  }
}
