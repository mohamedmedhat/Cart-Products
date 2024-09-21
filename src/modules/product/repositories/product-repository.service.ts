import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create_product.dto';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    readonly _productRepo: Repository<Product>,
  ) {}

  async addProduct(data: CreateProductDto, imageUrl: string): Promise<Product> {
    const { name, price, quantity, sale_price } = data;
    const newProduct = this._productRepo.create({
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      sale_price: parseFloat(sale_price),
      imageUrl,
    });
    return await this.saveProduct(newProduct);
  }

  async selectProductRepo() {
    return Repository<Product>;
  }

  async findProductById(id: number): Promise<Product> {
    return await this._productRepo.findOneBy({ id });
  }

  async saveProduct(product: Product) {
    return await this._productRepo.save(product);
  }

  async removeProduct(product: Product) {
    return await this._productRepo.remove(product);
  }
}
