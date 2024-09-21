import { Injectable } from '@nestjs/common';
import { PaginationConst } from 'src/common/consts/variables.consts';
import { ErrorService } from 'src/common/services/errors.service';
import { CustomQueriesUtils } from 'src/common/utils/sharedQueries.service';
import { Product } from 'src/modules/product/entities/product.entity';
import { ProductRepository } from 'src/modules/product/repositories/product-repository.service';
import { FindOptionsWhere, FindOptionsOrder } from 'typeorm';

@Injectable()
export class SharedProductService {
  constructor(
    private readonly _productRepo: ProductRepository,
    private readonly _customQuery: CustomQueriesUtils,
    private readonly _errorService: ErrorService,
  ) {}

  async findProduct(
    where?: FindOptionsWhere<Product>,
    order?: FindOptionsOrder<Product>,
    relations: string[] = [],
  ): Promise<Product> {
    return await this._customQuery.findItem(
      this._productRepo._productRepo,
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
        this._productRepo._productRepo,
        where,
        order,
        [...relations],
      );
      return [products, total];
    } catch (error) {
      throw this._errorService.failedToFindProducts(error);
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

  async filterByPriceStatus(
    page: number = PaginationConst.DEFAULT_PAGE,
    pageSize: number = PaginationConst.DEFAULT_PAGE_SIZE,
    where: FindOptionsWhere<Product>,
  ): Promise<[Product[], number]> {
    return await this.findProducts(page, pageSize, where, undefined, undefined);
  }
}
