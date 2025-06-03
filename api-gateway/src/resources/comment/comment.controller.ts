import { Controller, Get, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtGuard } from '../../guards/jwt.guard';
import { UpdateCommentDto } from './dto/update-comment.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CommentResponseDto, DeleteCommentResponseDto, ErrorResponseDto } from './dto/response.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get comment by ID', description: 'Retrieves a specific comment by its ID. User must be the comment author or admin.' })
  @ApiParam({ name: 'id', description: 'Comment ID', type: Number })
  @ApiOkResponse({ type: CommentResponseDto, description: 'Comment found and returned' })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: 'Comment not found' })
  @ApiForbiddenResponse({ type: ErrorResponseDto, description: 'User not authorized to view this comment' })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto, description: 'Unauthorized - JWT token missing or invalid' })
  async getComment(@Param('id') id: string, @Request() req) {
    return this.commentService.getComment(parseInt(id, 10), req.user);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update comment', description: 'Updates the content of a comment. User must be the comment author.' })
  @ApiParam({ name: 'id', description: 'Comment ID', type: Number })
  @ApiBody({ type: UpdateCommentDto })
  @ApiOkResponse({ type: CommentResponseDto, description: 'Comment successfully updated' })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: 'Comment not found' })
  @ApiForbiddenResponse({ type: ErrorResponseDto, description: 'User not authorized to update this comment' })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto, description: 'Unauthorized - JWT token missing or invalid' })
  async updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req
  ) {
    return this.commentService.updateComment(
      parseInt(id, 10),
      updateCommentDto,
      req.user
    );
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete comment', description: 'Deletes a comment. User must be the comment author.' })
  @ApiParam({ name: 'id', description: 'Comment ID', type: Number })
  @ApiOkResponse({ type: DeleteCommentResponseDto, description: 'Comment successfully deleted' })
  @ApiNotFoundResponse({ type: ErrorResponseDto, description: 'Comment not found' })
  @ApiForbiddenResponse({ type: ErrorResponseDto, description: 'User not authorized to delete this comment' })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto, description: 'Unauthorized - JWT token missing or invalid' })
  async deleteComment(@Param('id') id: string, @Request() req) {
    return this.commentService.deleteComment(parseInt(id, 10), req.user);
  }
}