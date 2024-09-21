import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1726941441906 implements MigrationInterface {
    name = 'SchemaUpdate1726941441906'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "imageUrl" character varying, "name" character varying(255) NOT NULL, "price" numeric(10,2) NOT NULL, "sale_price" numeric, "quantity" integer NOT NULL, "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cart_products" ("id" SERIAL NOT NULL, "imageUrl" character varying, "name" character varying(255) NOT NULL, "price" numeric(10,2) NOT NULL, "sale_price" numeric, "quantity" integer NOT NULL, "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "cartId" integer, CONSTRAINT "PK_3b12299e401712e78753a7b4fec" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "carts" ("id" SERIAL NOT NULL, "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cart_products" ADD CONSTRAINT "FK_3ee3d2f230cd0cda8966be069b4" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_products" DROP CONSTRAINT "FK_3ee3d2f230cd0cda8966be069b4"`);
        await queryRunner.query(`DROP TABLE "carts"`);
        await queryRunner.query(`DROP TABLE "cart_products"`);
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
