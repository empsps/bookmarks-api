import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private service: BookmarkService) {}

  @Get()
  getAllBookmarks() {}

  @Get()
  getBookmarkById() {}

  @Post()
  createBookmark() {}

  @Patch()
  editBookmarkById() {}

  @Delete()
  deleteBookmarkById() {}
}
