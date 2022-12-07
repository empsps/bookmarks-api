import { Injectable, NotFoundException } from '@nestjs/common';
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

    if (!bookmark || bookmark.userId !== userId) {
      throw new NotFoundException(
        "the requested bookmark coulnd't be found or doesn't belong to this user",
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
    let bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id,
      },
    });

    if (!bookmark || bookmark.userId !== userId) {
      throw new NotFoundException(
        "the requested bookmark coulnd't be found or doesn't belong to this user",
      );
    }

    bookmark = await this.prisma.bookmark.update({
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

    if (!bookmark || bookmark.userId !== userId) {
      throw new NotFoundException(
        "the requested bookmark coulnd't be found or doesn't belong to this user",
      );
    }

    await this.prisma.bookmark.delete({
      where: {
        id,
      },
    });
  }
}
