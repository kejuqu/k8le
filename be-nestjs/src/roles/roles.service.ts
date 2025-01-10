import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  findAll() {
    return this.rolesRepository.find();
  }

  findOne(id: string) {
    return this.rolesRepository.findOne({ where: { id } });
  }

  create(role: Role) {
    return this.rolesRepository.save(role);
  }

  update(id: string, role: Role) {
    return this.rolesRepository.update(id, role);
  }

  remove(id: string) {
    return this.rolesRepository.delete(id);
  }
}
