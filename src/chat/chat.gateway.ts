import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from '../messages/messages.service';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private messagesService: MessagesService,
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const decoded = await this.authService.validateFirebaseToken(token);
      const user = await this.usersService.findOneByFirebaseUid(decoded.uid);

      if (!user) {
        client.disconnect();
        return;
      }

      client.data.userId = user.id;
      client.join(`user_${user.id}`);
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    client: Socket,
    payload: { receiverId: number; content: string },
  ) {
    const senderId = client.data.userId;
    const message = await this.messagesService.createMessage(
      senderId,
      payload.receiverId,
      payload.content,
    );

    this.server
      .to(`user_${payload.receiverId}`)
      .emit('receive_message', message);
    return { status: 'delivered', message };
  }

  @SubscribeMessage('mark_as_read')
  async handleMarkAsRead(client: Socket, senderId: number) {
    const receiverId = client.data.userId;
    await this.messagesService.markMessagesAsRead(receiverId, senderId);
    this.server.to(`user_${senderId}`).emit('messages_read', { receiverId });
  }
}
