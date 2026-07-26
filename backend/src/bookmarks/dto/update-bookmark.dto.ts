import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateBookmarkDto {
  @IsUrl()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  collectionId?: string | null;
}
