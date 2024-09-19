import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { IsDate } from 'class-validator';
import { Product } from 'src/product/entities/product.entity';
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

@ObjectType()
@Entity({ name: 'carts' })
export class Cart {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => [Product])
  @OneToMany(() => Product, (product) => product.cart, { cascade: true })
  products: Product[];

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
