import { Injectable, NotFoundException } from '@nestjs/common';
import { Collection } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(ownerId: string): Promise<Collection[]> {
    // TODO: Implemented logic to fetch collections filtered by ownerId
    return this.prisma.collection.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllWithBookmarks(ownerId: string): Promise<any[]> {
    // TODO: Implemented Anti-N+1 single payload query endpoint for GET /collections/all
    return this.prisma.collection.findMany({
      where: { ownerId },
      include: { bookmarks: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, ownerId: string): Promise<Collection> {
    // TODO: Implemented logic to fetch a collection by id and ownerId
    const collection = await this.prisma.collection.findFirst({
      where: { id, ownerId },
    });

    if (!collection) {
      throw new NotFoundException(`Collection with ID ${id} not found`);
    }

    return collection;
  }

  async create(
    createDto: CreateCollectionDto,
    ownerId: string,
  ): Promise<Collection> {
    // TODO: Implemented logic to create a collection
    return this.prisma.collection.create({
      data: {
        ...createDto,
        ownerId,
      },
    });
  }

  async update(
    id: string,
    updateDto: UpdateCollectionDto,
    ownerId: string,
  ): Promise<Collection> {
    // TODO: Implemented logic to update a collection
    await this.findOne(id, ownerId);
    return this.prisma.collection.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string, ownerId: string): Promise<void> {
    // TODO: Implemented logic to delete a collection with SetNull rule
    await this.findOne(id, ownerId);
    await this.prisma.collection.delete({
      where: { id },
    });
  }
}
