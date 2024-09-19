import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { IsDate } from 'class-validator';
import { Cart } from 'src/cart/entities/cart.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@ObjectType()
@Entity('products')
export class Product {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

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

  @Field(() => Cart, { nullable: true })
  @ManyToOne(() => Cart, (cart) => cart.products, { nullable: true })
  cart?: Cart;

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
