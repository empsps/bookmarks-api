import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDTO, EditBookmarkDTO } from './dto/bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async getAllBookmarks(userId: string) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });

    return bookmarks;
  }

  async getBookmarkById(userId: string, id: string) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id,
      },
    });

    if (bookmark.userId !== userId) {
      throw new ForbiddenException(
        "the requested bookmark doesn't belong to this user",
      );
    }

    return bookmark;
  }

  async createBookmark(dto: CreateBookmarkDTO, userId: string) {
    const newBookmark = await this.prisma.bookmark.create({
      data: {
        ...dto,
        userId,
      },
    });

    return newBookmark;
  }

  async editBookmarkById(userId: string, id: string, dto: EditBookmarkDTO) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id,
      },
    });

    if (bookmark.userId !== userId) {
      throw new ForbiddenException(
        "the requested bookmark doesn't belong to this user",
      );
    }

    await this.prisma.bookmark.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });

    return bookmark;
  }

  async deleteBookmarkById(userId: string, id: string) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id,
      },
    });

    if (bookmark.userId !== userId) {
      throw new ForbiddenException(
        "the requested bookmark doesn't belong to this user",
      );
    }

    await this.prisma.bookmark.delete({
      where: {
        id,
      },
    });

    return bookmark;
  }
}