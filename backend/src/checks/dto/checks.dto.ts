import { IsString, IsUUID, IsOptional, IsEnum } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CheckStatus } from "@prisma/client";

export class StartChecksDto {
  @ApiProperty()
  @IsUUID()
  legalEntityId: string;
}

export class UpdateCheckDto {
  @ApiProperty({ enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED"] })
  @IsEnum(["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED"])
  status: CheckStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  result?: string;

  @ApiPropertyOptional()
  @IsOptional()
  data?: Record<string, unknown>;
}

export class PerformCheckDto {
  @ApiProperty()
  @IsUUID()
  legalEntityId: string;

  @ApiProperty({ enum: ["SPARK", "INTERNAL_BASIC", "INTERNAL_EXTENDED"] })
  @IsString()
  checkType: "SPARK" | "INTERNAL_BASIC" | "INTERNAL_EXTENDED";
}
