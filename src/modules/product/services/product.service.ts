import { Injectable } from '@nestjs/common';
import {
  Between,
  IsNull,
  LessThan,
  MoreThan,
  Not,
} from 'typeorm';
import { ErrorService } from 'src/common/services/errors.service';
import { PaginationConst } from 'src/common/consts/variables.consts';
import { CartProductService } from 'src/modules/cart/services/cart-product.service';
import { CreateProductDto } from '../dto/create_product.dto';
import { Product } from '../entities/product.entity';
import { UpdateProductInput } from '../dto/update-product.dto';
import { ProductRepository } from '../repositories/product-repository.service';
import { ProductMapper } from '../mappers/product-mapper.service';
import { SharedProductService } from 'src/shared/product-shared.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly _productRepo: ProductRepository,
    private readonly _productMapper: ProductMapper,
    private readonly _sharedProductService: SharedProductService,
    private readonly _cartProductService: CartProductService,
    private readonly _errorService: ErrorService,
  ) {}

  async IncreaseProductQuantity(quantity: number, product: Product) {
    product.quantity += quantity;
    await this._productRepo.saveProduct(product);
  }

  async decreaseProductQuantity(quantity: number, product: Product) {
    if (product.quantity < quantity) {
      throw new Error('Not enough stock available');
    }
    product.quantity -= quantity;
    await this._productRepo.saveProduct(product);
  }

  async createProduct(
    imageUrl: string,
    data: CreateProductDto,
  ): Promise<Product> {
    try {
      return await this._productRepo.addProduct(data, imageUrl);
    } catch (error) {
      throw this._errorService.failedToCreateProduct(error);
    }
  }

  async updateProduct(
    productId: number,
    imageUrl: string,
    data: UpdateProductInput,
  ): Promise<Product> {
    try {
      const product = await this.findProductById(productId);
      const originalName = product.name;
      const updatedProduct = await this._productMapper.toUpdateEntity(
        data,
        imageUrl,
        product,
      );
      await this._cartProductService.updateAllCartProductsWithName(
        originalName,
        updatedProduct,
      );
      return await this._productRepo.saveProduct(updatedProduct);
    } catch (error) {
      throw this._errorService.failedToUpdateProduct(productId, error);
    }
  }

  async removeProduct(productId: number): Promise<[Product[], number]> {
    try {
      const product = await this.findProductById(productId);
      await Promise.all([
        this._cartProductService.deleteAllCartProductsWithName(product.name),
        this._productRepo.removeProduct(product),
      ]);
      return await this.getAllProducts();
    } catch (error) {
      throw this._errorService.failedToDeleteProduct(productId, error);
    }
  }

  async findProductById(productId: number): Promise<Product> {
    try {
      return await this._sharedProductService.findProduct(
        { id: productId },
        undefined,
        undefined,
      );
    } catch (error) {
      throw this._errorService.failedToGetProductById(productId, error);
    }
  }

  async getAllProducts(
    page: number = PaginationConst.DEFAULT_PAGE,
    pageSize: number = PaginationConst.DEFAULT_PAGE_SIZE,
  ): Promise<[Product[], number]> {
    try {
      return await this._sharedProductService.findProducts(
        page,
        pageSize,
        undefined,
        undefined,
      );
    } catch (error) {
      throw this._errorService.failedGetAllProducts(error);
    }
  }

  async filterProductsByHighestPrice(
    page: number = PaginationConst.DEFAULT_PAGE,
    pageSize: number = PaginationConst.DEFAULT_PAGE_SIZE,
  ): Promise<[Product[], number]> {
    return await this._sharedProductService.filterByPriceOrder(
      page,
      pageSize,
      'DESC',
    );
  }

  async filterProductsByLowestPrice(
    page: number = PaginationConst.DEFAULT_PAGE,
    pageSize: number = PaginationConst.DEFAULT_PAGE_SIZE,
  ): Promise<[Product[], number]> {
    return await this._sharedProductService.filterByPriceOrder(
      page,
      pageSize,
      'ASC',
    );
  }

  async filterProductsAvailableSalePrice(
    page: number = PaginationConst.DEFAULT_PAGE,
    pageSize: number = PaginationConst.DEFAULT_PAGE_SIZE,
  ): Promise<[Product[], number]> {
    return await this._sharedProductService.findProducts(
      page,
      pageSize,
      { sale_price: Not(IsNull()) },
      undefined,
      undefined,
    );
  }

  async filterProductsWherePriceLessThanOneHundered(
    page: number = PaginationConst.DEFAULT_PAGE,
    pageSize: number = PaginationConst.DEFAULT_PAGE_SIZE,
  ): Promise<[Product[], number]> {
    return await this._sharedProductService.filterByPriceStatus(
      page,
      pageSize,
      {
        price: LessThan(100.0),
      },
    );
  }

  async filterProductsWherePriceBetweenOneHunderedAndOneThousand(
    page: number = PaginationConst.DEFAULT_PAGE,
    pageSize: number = PaginationConst.DEFAULT_PAGE_SIZE,
  ): Promise<[Product[], number]> {
    return await this._sharedProductService.filterByPriceStatus(
      page,
      pageSize,
      {
        price: Between(100.0, 1000.0),
      },
    );
  }

  async filterProductsWherePriceMoreThanOneThousand(
    page: number = PaginationConst.DEFAULT_PAGE,
    pageSize: number = PaginationConst.DEFAULT_PAGE_SIZE,
  ): Promise<[Product[], number]> {
    return await this._sharedProductService.filterByPriceStatus(
      page,
      pageSize,
      {
        price: MoreThan(1000.0),
      },
    );
  }
}
