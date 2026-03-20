import { IsString, IsUUID, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class StartChecksDto {
  @ApiProperty()
  @IsUUID()
  legalEntityId: string;

  @ApiProperty()
  @IsUUID()
  userId: string;
}

export class UpdateCheckDto {
  @ApiProperty({ enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED"] })
  @IsString()
  status: string;

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

  @ApiProperty({ enum: ["INTERNAL_BASIC", "INTERNAL_EXTENDED"] })
  @IsString()
  checkType: "INTERNAL_BASIC" | "INTERNAL_EXTENDED";
}
