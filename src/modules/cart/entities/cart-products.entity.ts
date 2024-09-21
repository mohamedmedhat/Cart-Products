import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { IsDate } from 'class-validator';
import { Product } from 'src/modules/product/entities/product.entity';

@ObjectType()
@Entity({ name: 'cart_products' })
export class CartProduct extends Product {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Cart)
  @ManyToOne(() => Cart, (cart) => cart.cartProducts)
  cart: Cart;

  @Field(() => String)
  @Column({ type: 'varchar', nullable: true })
  imageUrl?: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Field(() => Float)
  @Column('decimal', { nullable: true })
  sale_price?: number;

  @Field(() => Int)
  @Column({ type: 'int' })
  quantity: number;

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
