import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateBlogDto {
  @IsNotEmpty({ message: 'Blog title is required' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'Blog slug is required' })
  @IsString()
  slug: string;

  @IsNotEmpty({ message: 'Blog excerpt is required' })
  @IsString()
  excerpt: string;

  @IsNotEmpty({ message: 'Blog content is required' })
  @IsString()
  content: string;

  @IsNotEmpty({ message: 'Read time is required' })
  @IsString()
  readTime: string;

  @IsOptional()
  @IsString()
  featuredImage?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean = true;
}
