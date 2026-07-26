import { Injectable, NotFoundException } from '@nestjs/common';
import { Bookmark } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@Injectable()
export class BookmarksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    ownerId: string,
    collectionId?: string,
    search?: string,
  ): Promise<Bookmark[]> {
    // TODO: Implemented logic to fetch bookmarks filtered by ownerId, optional collectionId and search
    const where: any = { ownerId };

    if (collectionId === 'uncategorized') {
      where.collectionId = null;
    } else if (collectionId) {
      where.collectionId = collectionId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { url: { contains: search } },
        { notes: { contains: search } },
      ];
    }

    return this.prisma.bookmark.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, ownerId: string): Promise<Bookmark> {
    // TODO: Implemented logic to fetch a bookmark by id and ownerId
    const bookmark = await this.prisma.bookmark.findFirst({
      where: { id, ownerId },
    });

    if (!bookmark) {
      throw new NotFoundException(`Bookmark with ID ${id} not found`);
    }

    return bookmark;
  }

  async create(
    createDto: CreateBookmarkDto,
    ownerId: string,
  ): Promise<Bookmark> {
    // TODO: Implemented logic to create a bookmark
    return this.prisma.bookmark.create({
      data: {
        ...createDto,
        ownerId,
      },
    });
  }

  async update(
    id: string,
    updateDto: UpdateBookmarkDto,
    ownerId: string,
  ): Promise<Bookmark> {
    // TODO: Implemented logic to update a bookmark
    await this.findOne(id, ownerId);
    return this.prisma.bookmark.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string, ownerId: string): Promise<void> {
    // TODO: Implemented logic to delete a bookmark
    await this.findOne(id, ownerId);
    await this.prisma.bookmark.delete({
      where: { id },
    });
  }
}
