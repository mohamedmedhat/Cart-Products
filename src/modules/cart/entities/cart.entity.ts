import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { IsDate } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { CartProduct } from './cart-products.entity';

@ObjectType()
@Entity({ name: 'carts' })
export class Cart {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => [CartProduct])
  @OneToMany(() => CartProduct, (product) => product.cart, { cascade: true })
  cartProducts: CartProduct[];

  @Field(() => Float)
  @VersionColumn()
  version: number;

  @IsDate()
  @Field(() => Date)
  @CreateDateColumn()
  created_at: Date;

  @IsDate()
  @Field(() => Date)
  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  protected setCreatedAt(): void {
    this.created_at = new Date();
  }

  @BeforeUpdate()
  protected setUpdatedAt(): void {
    this.updated_at = new Date();
  }
}
