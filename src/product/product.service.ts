import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import {
  Between,
  FindOptionsOrder,
  FindOptionsWhere,
  IsNull,
  LessThan,
  MoreThan,
  Not,
  Repository,
} from 'typeorm';
import { CreateProductDto } from './dto/create_product.dto';
import { CustomQueries } from 'src/custom/custom.service';
import { ErrorService } from 'src/custom/errors.service';
import { PaginationConst } from 'src/consts/variables.consts';
import { CartProductService } from 'src/cart/cart-product.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly _productRepo: Repository<Product>,
    private readonly _customQuery: CustomQueries,
    private readonly _cartProductService: CartProductService,
    private readonly _errorService: ErrorService,
  ) {}

  async IncreaseProductQuantity(quantity: number, product: Product) {
    product.quantity += quantity;
    await this._productRepo.save(product);
  }

  async decreaseProductQuantity(quantity: number, product: Product) {
    if (product.quantity < quantity) {
      throw new Error('Not enough stock available');
    }
    product.quantity -= quantity;
    await this._productRepo.save(product);
  }

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
    page: number = PaginationConst.DEFAULT_PAGE,
    pageSize: number = PaginationConst.DEFAULT_PAGE_SIZE,
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
      throw this._errorService.failedToFindProducts(error);
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
      throw this._errorService.failedToCreateProduct(error);
    }
  }

  async updateProductData(
    product: Product,
    imageUrl: string,
    data: CreateProductDto,
  ): Promise<Product> {
    product.name = data.name;
    product.price = parseFloat(data.price);
    product.sale_price = parseFloat(data.sale_price);
    product.imageUrl = imageUrl;
    product.quantity = parseInt(data.quantity);
    product.updated_at = new Date();
    return product;
  }

  async updateProduct(
    productId: number,
    imageUrl: string,
    data: CreateProductDto,
  ): Promise<Product> {
    try {
      const product = await this.findProductById(productId);
      const originalName = product.name;
      const updatedProduct = await this.updateProductData(
        product,
        imageUrl,
        data,
      );
      await this._cartProductService.updateAllCartProductsWithName(
        originalName,
        updatedProduct,
      );
      return await this._productRepo.save(updatedProduct);
    } catch (error) {
      throw this._errorService.failedToUpdateProduct(productId, error);
    }
  }

  async removeProduct(productId: number): Promise<[Product[], number]> {
    try {
      const product = await this.findProductById(productId);
      await Promise.all([
        this._cartProductService.deleteAllCartProductsWithName(product.name),
        this._productRepo.remove(product),
      ]);
      return await this.getAllProducts();
    } catch (error) {
      throw this._errorService.failedToDeleteProduct(productId, error);
    }
  }

  async findProductById(productId: number): Promise<Product> {
    try {
      return await this.findProduct({ id: productId }, undefined, undefined);
    } catch (error) {
      throw this._errorService.failedToGetProductById(productId, error);
    }
  }

  async getAllProducts(
    page: number = PaginationConst.DEFAULT_PAGE,
    pageSize: number = PaginationConst.DEFAULT_PAGE_SIZE,
  ): Promise<[Product[], number]> {
    try {
      return await this.findProducts(page, pageSize, undefined, undefined);
    } catch (error) {
      throw this._errorService.failedGetAllProducts(error);
    }
  }

  async filterByPriceOrder(
    page: number = PaginationConst.DEFAULT_PAGE,
    pageSize: number = PaginationConst.DEFAULT_PAGE_SIZE,
    price: 'DESC' | 'ASC',
  ): Promise<[Product[], number]> {
    return await this.findProducts(
      page,
      pageSize,
      undefined,
      { price },
      undefined,
    );
  }

  async filterProductsByHighestPrice(
    page: number = PaginationConst.DEFAULT_PAGE,
    pageSize: number = PaginationConst.DEFAULT_PAGE_SIZE,
  ): Promise<[Product[], number]> {
    return await this.filterByPriceOrder(page, pageSize, 'DESC');
  }

  async filterProductsByLowestPrice(
    page: number = PaginationConst.DEFAULT_PAGE,
    pageSize: number = PaginationConst.DEFAULT_PAGE_SIZE,
  ): Promise<[Product[], number]> {
    return await this.filterByPriceOrder(page, pageSize, 'ASC');
  }

  async filterProductsAvailableSalePrice(
    page: number = PaginationConst.DEFAULT_PAGE,
    pageSize: number = PaginationConst.DEFAULT_PAGE_SIZE,
  ): Promise<[Product[], number]> {
    return await this.findProducts(
      page,
      pageSize,
      { sale_price: Not(IsNull()) },
      undefined,
      undefined,
    );
  }

  async filterByPriceStatus(
    page: number = PaginationConst.DEFAULT_PAGE,
    pageSize: number = PaginationConst.DEFAULT_PAGE_SIZE,
    where: FindOptionsWhere<Product>,
  ): Promise<[Product[], number]> {
    return await this.findProducts(page, pageSize, where, undefined, undefined);
  }

  async filterProductsWherePriceLessThanOneHundered(
    page: number = PaginationConst.DEFAULT_PAGE,
    pageSize: number = PaginationConst.DEFAULT_PAGE_SIZE,
  ): Promise<[Product[], number]> {
    return await this.filterByPriceStatus(page, pageSize, {
      price: LessThan(100.0),
    });
  }

  async filterProductsWherePriceBetweenOneHunderedAndOneThousand(
    page: number = PaginationConst.DEFAULT_PAGE,
    pageSize: number = PaginationConst.DEFAULT_PAGE_SIZE,
  ): Promise<[Product[], number]> {
    return await this.filterByPriceStatus(page, pageSize, {
      price: Between(100.0, 1000.0),
    });
  }

  async filterProductsWherePriceMoreThanOneThousand(
    page: number = PaginationConst.DEFAULT_PAGE,
    pageSize: number = PaginationConst.DEFAULT_PAGE_SIZE,
  ): Promise<[Product[], number]> {
    return await this.filterByPriceStatus(page, pageSize, {
      price: MoreThan(1000.0),
    });
  }
}
