import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Collection } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('api/v1/collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  async findAll(@CurrentUser('sub') ownerId: string): Promise<Collection[]> {
    return this.collectionsService.findAll(ownerId);
  }

  @Get('all')
  async findAllWithBookmarks(
    @CurrentUser('sub') ownerId: string,
  ): Promise<any[]> {
    return this.collectionsService.findAllWithBookmarks(ownerId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser('sub') ownerId: string,
  ): Promise<Collection> {
    return this.collectionsService.findOne(id, ownerId);
  }

  @Post()
  async create(
    @Body() createDto: CreateCollectionDto,
    @CurrentUser('sub') ownerId: string,
  ): Promise<Collection> {
    return this.collectionsService.create(createDto, ownerId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCollectionDto,
    @CurrentUser('sub') ownerId: string,
  ): Promise<Collection> {
    return this.collectionsService.update(id, updateDto, ownerId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CurrentUser('sub') ownerId: string,
  ): Promise<void> {
    await this.collectionsService.remove(id, ownerId);
  }
}
