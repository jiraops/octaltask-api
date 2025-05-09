import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateTaskDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    isCompleted?: boolean;

    @IsOptional()
    @IsString()
    dueDate?: string;
}