import { Controller, Get, Post, Patch, Param, Body } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import type { Prisma } from "@prisma/client";
import { ChecksService } from "./checks.service";
import {
  StartChecksDto,
  UpdateCheckDto,
  PerformCheckDto,
} from "./dto/checks.dto";

@ApiTags("checks")
@Controller("checks")
export class ChecksController {
  constructor(private checksService: ChecksService) {}

  @Post("start")
  @ApiOperation({ summary: "Start checks for legal entity" })
  startChecks(@Body() dto: StartChecksDto) {
    return this.checksService.startChecks(dto.legalEntityId);
  }

  @Post("perform")
  @ApiOperation({ summary: "Perform specific check" })
  performCheck(@Body() dto: PerformCheckDto) {
    switch (dto.checkType) {
      case "SPARK":
        return this.checksService.performSparkCheck(dto.legalEntityId);
      case "INTERNAL_BASIC":
      case "INTERNAL_EXTENDED":
        return this.checksService.performInternalCheck(
          dto.legalEntityId,
          dto.checkType,
        );
      default:
        throw new Error("Unknown check type");
    }
  }

  @Get("legal-entity/:id")
  @ApiOperation({ summary: "Get all checks for legal entity" })
  findByLegalEntity(@Param("id") id: string) {
    return this.checksService.findByLegalEntity(id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get check by ID" })
  findOne(@Param("id") id: string) {
    return this.checksService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update check status" })
  updateStatus(@Param("id") id: string, @Body() dto: UpdateCheckDto) {
    return this.checksService.updateStatus(
      id,
      dto.status,
      dto.result,
      dto.data as Prisma.InputJsonValue,
    );
  }

  @Post("periodic/:inn")
  @ApiOperation({ summary: "Perform periodic check by INN" })
  performPeriodicCheck(@Param("inn") inn: string) {
    return this.checksService.performPeriodicCheck(inn);
  }
}
