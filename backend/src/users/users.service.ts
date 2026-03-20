import { Injectable } from '@nestjs/common';
import { ProxyService } from '../common/proxy.service';

@Injectable()
export class UsersService {
  constructor(private proxy: ProxyService) {}

  /**
   * Получить всех пользователей
   */
  async findAll() {
    return this.proxy.get('USERS_API', '/users');
  }

  /**
   * Получить пользователя по ID
   */
  async findOne(id: string) {
    return this.proxy.get('USERS_API', `/users/${id}`);
  }

  /**
   * Обновить пользователя
   */
  async update(
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      department?: string;
      role?: string;
      isActive?: boolean;
    },
  ) {
    return this.proxy.patch('USERS_API', `/users/${id}`, data);
  }

  /**
   * Деактивировать пользователя
   */
  async remove(id: string) {
    return this.proxy.delete('USERS_API', `/users/${id}`);
  }

  /**
   * Создать пользователя
   */
  async create(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    department: string;
    role?: string;
  }) {
    return this.proxy.post('USERS_API', '/users', data);
  }
}