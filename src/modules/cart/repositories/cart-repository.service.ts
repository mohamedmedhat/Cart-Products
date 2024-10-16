import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';

@Injectable()
export class CartRepository {
  constructor(
    @InjectRepository(Cart)
    private _cartRepo: Repository<Cart>,
  ) {}

  async createNewCart(): Promise<Cart> {
    const cart = this._cartRepo.create();
    return this._cartRepo.save(cart);
  }

  async findCartById(id: number): Promise<Cart> {
    return await this._cartRepo.findOneBy({ id });
  }
}
