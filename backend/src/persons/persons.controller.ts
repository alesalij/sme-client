import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { PersonsService, VDmPerson, VDmPersonQueryParams, PaginatedResult } from './persons.service';

@Controller('persons')
export class PersonsController {
 constructor(private personsService: PersonsService) {}

 /**
 * Получить список персон с пагинацией
 */
 @Get()
 async findAll(
 @Query('skip') skip?: string,
 @Query('take') take?: string,
 @Query('inn') inn?: string,
 @Query('ogrn') ogrn?: string,
 @Query('name') name?: string,
 @Query('type') type?: string,
 @Query('status') status?: string,
 ): Promise<PaginatedResult<VDmPerson>> {
 const takeNum = take ? parseInt(take,10) :20;
 const skipNum = skip ? parseInt(skip,10) :0;

 const params: VDmPersonQueryParams = {
 skip: skipNum,
 take: Math.min(Math.max(takeNum,1),100), // Ограничение1-100
 inn,
 ogrn,
 name,
 type,
 status,
 };

 return this.personsService.findAll(params);
 }

 /**
 * Получить персону по ID
 */
 @Get(':id')
 async findById(@Param('id') id: string): Promise<VDmPerson> {
 const personId = parseInt(id,10);
 const person = await this.personsService.findById(personId);

 if (!person) {
 throw new NotFoundException(`Персона с ID ${personId} не найдена`);
 }

 return person;
 }

 /**
 * Поиск персон
 */
 @Get('search/:query')
 async search(@Param('query') query: string, @Query('limit') limit?: string): Promise<VDmPerson[]> {
 const limitNum = limit ? parseInt(limit,10) :50;
 return this.personsService.search(query, limitNum);
 }
}
