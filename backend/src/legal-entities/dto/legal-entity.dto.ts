import {
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
  MinLength,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
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

export class LegalEntityDataDto {
  @ApiPropertyOptional({ description: "INN (10 digits for UL, 12 for IP)" })
  @IsOptional()
  @IsString()
  inn?: string;

  @ApiPropertyOptional({ description: "OGRN (13 digits for UL, 15 for IP)" })
  @IsOptional()
  @IsString()
  ogrn?: string;

  @ApiPropertyOptional({ description: "Account number" })
  @IsOptional()
  @IsString()
  account?: string;

  @ApiPropertyOptional({ description: "Short name" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: "Full name" })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ description: "KPP" })
  @IsOptional()
  @IsString()
  kpp?: string;

  @ApiPropertyOptional({ description: "Registration address" })
  @IsOptional()
  @IsString()
  regAddress?: string;

  @ApiPropertyOptional({ description: "Fact address" })
  @IsOptional()
  @IsString()
  factAddress?: string;

  @ApiPropertyOptional({ description: "CEO name" })
  @IsOptional()
  @IsString()
  ceo?: string;

  @ApiPropertyOptional({ description: "Beneficiary name" })
  @IsOptional()
  @IsString()
  beneficiary?: string;

  @ApiPropertyOptional({ description: "Registration date" })
  @IsOptional()
  @IsString()
  regDate?: string;

  @ApiPropertyOptional({ description: "OKVED code" })
  @IsOptional()
  @IsString()
  okved?: string;

  @ApiPropertyOptional({ description: "Client type: ЮЛ or ИП" })
  @IsOptional()
  @IsString()
  type?: string;
}

export class ParseXlsxDto {
  @ApiProperty({
    type: [LegalEntityDataDto],
    description: "Array of parsed legal entities",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LegalEntityDataDto)
  items: LegalEntityDataDto[];
}
