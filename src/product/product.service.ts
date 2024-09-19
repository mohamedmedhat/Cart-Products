import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import {
  Between,
  FindOptionsOrder,
  FindOptionsWhere,
  IsNull,
  LessThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { CreateProductDto } from './dto/create_product.dto';
import { CustomQueries } from 'src/custom/custom.service';
import { ErrorService } from 'src/custom/errors.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly _productRepo: Repository<Product>,
    private readonly _customQuery: CustomQueries,
    private readonly _errorService: ErrorService,
  ) {}

  async findProduct(
    where?: FindOptionsWhere<Product>,
    order?: FindOptionsOrder<Product>,
    relations: string[] = [],
  ): Promise<Product> {
    return await this._customQuery.findItem(
      this._productRepo,
      where,
      order,
      relations,
    );
  }

  async findProducts(
    page: number = 1,
    pageSize: number = 9,
    where?: FindOptionsWhere<Product>,
    order?: FindOptionsOrder<Product>,
    relations: string[] = [],
  ): Promise<[Product[], number]> {
    try {
      const [products, total] = await this._customQuery.findItems(
        page,
        pageSize,
        this._productRepo,
        where,
        order,
        [...relations],
      );
      return [products, total];
    } catch (error) {
      this._errorService.failedToFindProducts(error);
    }
  }

  async addProduct(data: CreateProductDto, imageUrl: string): Promise<Product> {
    const { name, price, quantity, sale_price } = data;
    return this._productRepo.create({
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      sale_price: parseFloat(sale_price),
      imageUrl,
    });
  }

  async createProduct(
    imageUrl: string,
    data: CreateProductDto,
  ): Promise<Product> {
    try {
      const newProduct = await this.addProduct(data, imageUrl);
      return await this._productRepo.save(newProduct);
    } catch (error) {
      this._errorService.failedToCreateProduct(error);
    }
  }

  async updateProduct(
    productId: number,
    imageUrl: string,
    data: CreateProductDto,
  ): Promise<Product> {
    try {
      const product = await this.findProduct({ id: productId });
      if (!product) {
        throw new Error(`Product with id ${productId} not found.`);
      }
      Object.assign(product, { ...data, imageUrl });
      return await this._productRepo.save(product);
    } catch (error) {
      this._errorService.failedToUpdateProduct(productId, error);
    }
  }

  async removeProduct(productId: number): Promise<[Product[], number]> {
    try {
      const product = await this.findProductById(productId);
      await this._productRepo.remove(product);
      return await this.getAllProducts();
    } catch (error) {
      this._errorService.failedToDeleteProduct(productId, error);
    }
  }

  async findProductById(productId: number): Promise<Product> {
    try {
      return await this.findProduct({ id: productId }, undefined, undefined);
    } catch (error) {
      this._errorService.failedToGetProductById(productId, error);
    }
  }

  async getAllProducts(
    page: number = 1,
    pageSize: number = 9,
  ): Promise<[Product[], number]> {
    try {
      return await this.findProducts(page, pageSize, undefined, undefined);
    } catch (error) {
      this._errorService.failedGetAllProducts(error);
    }
  }

  async filterProductsByHighestPrice(
    page: number = 1,
    pageSize: number = 9,
  ): Promise<[Product[], number]> {
    return await this.findProducts(
      page,
      pageSize,
      undefined,
      { price: 'DESC' },
      undefined,
    );
  }

  async filterProductsByLowestPrice(
    page: number = 1,
    pageSize: number = 9,
  ): Promise<[Product[], number]> {
    return await this.findProducts(
      page,
      pageSize,
      undefined,
      { price: 'ASC' },
      undefined,
    );
  }

  async filterProductsAvailableSalePrice(
    page: number = 1,
    pageSize: number = 9,
  ): Promise<[Product[], number]> {
    return await this.findProducts(
      page,
      pageSize,
      { sale_price: Not(IsNull()) },
      undefined,
      undefined,
    );
  }

  async filterProductsWherePriceLessThanOneHundered(
    page: number = 1,
    pageSize: number = 9,
  ): Promise<[Product[], number]> {
    return await this.findProducts(
      page,
      pageSize,
      { price: LessThan(100.0) },
      undefined,
      undefined,
    );
  }

  async filterProductsWherePriceBetweenOneHunderedAndOneThousand(
    page: number = 1,
    pageSize: number = 9,
  ): Promise<[Product[], number]> {
    return await this.findProducts(
      page,
      pageSize,
      { price: Between(100.0, 1000.0) },
      { price: 'ASC' },
      undefined,
    );
  }

  async filterProductsWherePriceMoreThanOneThousand(
    page: number = 1,
    pageSize: number = 9,
  ): Promise<[Product[], number]> {
    return await this.findProducts(
      page,
      pageSize,
      { price: MoreThanOrEqual(1000.0) },
      { price: 'ASC' },
      undefined,
    );
  }
}
