import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: Role) {
    return this.rolesService.create(createRoleDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateRoleDto: Role,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }
}
