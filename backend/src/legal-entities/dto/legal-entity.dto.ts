import {
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
  MinLength,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SearchByInnDto {
  @ApiProperty({ example: "7707083893" })
  @IsString()
  @MinLength(10)
  inn: string;
}

export class CreateLegalEntityDto {
  @ApiProperty({ example: "7707083893" })
  @IsString()
  @MinLength(10)
  inn: string;

  @ApiProperty({ example: 'ООО "Ромашка"' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  director?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  activity?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  registrationDate?: string;
}

export class UpdateLegalEntityDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  director?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  activity?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  registrationDate?: string;
}

export class SaveQuestionnaireDto {
  @ApiProperty()
  @IsUUID()
  legalEntityId: string;

  @ApiProperty()
  questionnaireData: Record<string, unknown>;

  @ApiProperty()
  @IsUUID()
  userId: string;
}
