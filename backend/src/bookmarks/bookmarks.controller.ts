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
  Query,
} from '@nestjs/common';
import { Bookmark } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@Controller('api/v1/bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Get()
  async findAll(
    @CurrentUser('sub') ownerId: string,
    @Query('collectionId') collectionId?: string,
    @Query('search') search?: string,
  ): Promise<Bookmark[]> {
    return this.bookmarksService.findAll(ownerId, collectionId, search);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser('sub') ownerId: string,
  ): Promise<Bookmark> {
    return this.bookmarksService.findOne(id, ownerId);
  }

  @Post()
  async create(
    @Body() createDto: CreateBookmarkDto,
    @CurrentUser('sub') ownerId: string,
  ): Promise<Bookmark> {
    return this.bookmarksService.create(createDto, ownerId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateBookmarkDto,
    @CurrentUser('sub') ownerId: string,
  ): Promise<Bookmark> {
    return this.bookmarksService.update(id, updateDto, ownerId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CurrentUser('sub') ownerId: string,
  ): Promise<void> {
    await this.bookmarksService.remove(id, ownerId);
  }
}
