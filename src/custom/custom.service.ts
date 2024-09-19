import { Injectable } from '@nestjs/common';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class CustomQueries {
  async findItem<T>(
    repo: Repository<T>,
    where?: FindOptionsWhere<T>,
    order?: FindOptionsOrder<T>,
    relations: string[] = [],
  ): Promise<T> {
    return await repo.findOne({
      where,
      order,
      relations,
    });
  }

  async findItems<T>(
    page: number = 1,
    pageSize: number = 9,
    repo: Repository<T>,
    where?: FindOptionsWhere<T>,
    order?: FindOptionsOrder<T>,
    relations: string[] = [],
  ): Promise<[T[], number]> {
    return await repo.findAndCount({
      where,
      order,
      relations,
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
  }
}
