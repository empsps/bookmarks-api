import {
  Body,
  CacheInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDTO, EditBookmarkDTO } from './dto/bookmark.dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private service: BookmarkService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  getAllBookmarks(@GetUser('id') userId: string) {
    return this.service.getAllBookmarks(userId);
  }

  @Get(':id')
  getBookmarkById(
    @Param('id', ParseUUIDPipe) bookmarkId: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.getBookmarkById(userId, bookmarkId);
  }

  @Post()
  createBookmark(
    @GetUser('id') userId: string,
    @Body() dto: CreateBookmarkDTO,
  ) {
    return this.service.createBookmark(dto, userId);
  }

  @Patch('edit/:id')
  editBookmarkById(
    @Param('id', ParseUUIDPipe) bookmarkId: string,
    @Body() dto: EditBookmarkDTO,
    @GetUser('id') userId: string,
  ) {
    return this.service.editBookmarkById(userId, bookmarkId, dto);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBookmarkById(
    @Param('id', ParseUUIDPipe) bookmarkId: string,
    @GetUser('id') userId: string,
  ) {
    return this.service.deleteBookmarkById(userId, bookmarkId);
  }
}
