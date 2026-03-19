import { Controller, Get, Patch, Delete, Param, Body } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { UsersService } from "./users.service";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: "Get all users" })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user by ID" })
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update user" })
  update(@Param("id") id: string, @Body() data: Record<string, unknown>) {
    return this.usersService.update(id, data);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Deactivate user" })
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
