import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { LegalEntitiesService } from "./legal-entities.service";
import {
  CreateLegalEntityDto,
  UpdateLegalEntityDto,
  SaveQuestionnaireDto,
  ParseXlsxDto,
} from "./dto/legal-entity.dto";

@ApiTags("legal-entities")
@Controller("legal-entities")
export class LegalEntitiesController {
  constructor(private legalEntitiesService: LegalEntitiesService) {}

  @Get()
  @ApiOperation({ summary: "Get all legal entities" })
  findAll(@Query("page") page: string, @Query("limit") limit: string) {
    const skip = (parseInt(page || "1") - 1) * parseInt(limit || "20");
    const take = parseInt(limit || "20");
    return this.legalEntitiesService.findAll({ skip, take });
  }

  @Get(":id")
  @ApiOperation({ summary: "Get legal entity by ID" })
  findOne(@Param("id") id: string) {
    return this.legalEntitiesService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: "Create legal entity" })
  create(@Body() dto: CreateLegalEntityDto) {
    return this.legalEntitiesService.create(dto);
  }

  @Post("batch")
  @ApiOperation({
    summary: "Batch import legal entities from parsed XLSX data",
  })
  batchImport(@Body() dto: ParseXlsxDto) {
    return this.legalEntitiesService.batchImport(dto.items);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update legal entity" })
  update(@Param("id") id: string, @Body() dto: UpdateLegalEntityDto) {
    return this.legalEntitiesService.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete legal entity" })
  remove(@Param("id") id: string) {
    return this.legalEntitiesService.delete(id);
  }

  @Post("questionnaire")
  @ApiOperation({ summary: "Save questionnaire" })
  saveQuestionnaire(@Body() dto: SaveQuestionnaireDto) {
    return this.legalEntitiesService.saveQuestionnaire(dto);
  }

  @Get(":id/questionnaire")
  @ApiOperation({ summary: "Get latest questionnaire" })
  getQuestionnaire(@Param("id") id: string) {
    return this.legalEntitiesService.getQuestionnaire(id);
  }
}
