import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { BlogsService } from './blogs.service';

@Controller('api/v1/blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  findAllPublic() {
    return this.blogsService.findAllPublic();
  }

  @Get(':slug')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  findBySlug(@Param('slug') slug: string) {
    return this.blogsService.findBySlug(slug);
  }
}
