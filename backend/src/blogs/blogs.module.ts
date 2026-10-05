import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController, AdminBlogsController } from './blogs.controller';

@Module({
  controllers: [BlogsController, AdminBlogsController],
  providers: [BlogsService],
  exports: [BlogsService],
})
export class BlogsModule {}
