import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateBookmarkDto {
  @IsUrl()
  @IsNotEmpty()
  url!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  collectionId?: string;
}
