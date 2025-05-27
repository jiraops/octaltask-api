import { Injectable, Inject, HttpException, HttpStatus, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

interface SubtaskGrpcService {
  getSubtask(data: any): any;
  updateSubtask(data: any): any;
  deleteSubtask(data: any): any;
}

@Injectable()
export class SubtaskService {
  private subtaskGrpcService: SubtaskGrpcService;

  constructor(@Inject('TASK_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.subtaskGrpcService = this.client.getService<SubtaskGrpcService>('TaskService');
  }

  async getSubtask(id: number, user: any) {
    try {
      const userData = {
        userId: user.userId,
        email: user.email,
        role: user.role
      };

      return await firstValueFrom(
        this.subtaskGrpcService.getSubtask({ subtaskId: id, user: userData })
      );
    } catch (error) {
      this.handleGrpcError(error);
    }
  }

  async updateSubtask(id: number, dto: any, user: any) {
    try {
      const userData = {
        userId: user.userId,
        email: user.email,
        role: user.role
      };

      return await firstValueFrom(
        this.subtaskGrpcService.updateSubtask({
          subtaskId: id,
          content: dto.content,
          isCompleted: dto.isCompleted,
          user: userData
        })
      );
    } catch (error) {
      this.handleGrpcError(error);
    }
  }

  async deleteSubtask(id: number, user: any) {
    try {
      const userData = {
        userId: user.userId,
        email: user.email,
        role: user.role
      };

      return await firstValueFrom(
        this.subtaskGrpcService.deleteSubtask({ subtaskId: id, user: userData })
      );
    } catch (error) {
      this.handleGrpcError(error);
    }
  }

  private handleGrpcError(error: any) {
    // Extract gRPC error details
    const grpcCode = error.code;
    const message = error.details || error.message || 'Unknown error';

    switch (grpcCode) {
      case 3: // INVALID_ARGUMENT
        throw new BadRequestException(message);
      case 5: // NOT_FOUND
        throw new NotFoundException(message);
      case 7: // PERMISSION_DENIED
        throw new ForbiddenException(message);
      case 2: // UNKNOWN
      default:
        throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}