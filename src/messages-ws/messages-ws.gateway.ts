import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';

@WebSocketGateway({cors: true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;
  constructor(
    private readonly messagesWsService: MessagesWsService
  ) {}

  handleConnection(client: Socket) {
    // console.log('Cliente conectado:', client.id);
    this.messagesWsService.registerclient(client);
    
    this.wss.emit('clients-update', this.messagesWsService.getConnectedClients() );
  }
  handleDisconnect(client: Socket) {
    // console.log('Cliente desconectado:',client.id);
    this.messagesWsService.removeClient(client.id);

    this.wss.emit('clients-update', this.messagesWsService.getConnectedClients() );
  }

  // message-from-client
  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto){

    //! emite unicamente al cliente. 
    // client.emit('message-from-server',{
    //   fullName: 'Soy Yo!',
    //   message: payload.message || 'no-message!!'
    // });

     //! Emitir a todos EMNOS, al clietne inicial
    //  client.broadcast.emit('message-from-server',{
    //   fullName: 'Soy Yo!',
    //   message: payload.message || 'no-message!!'
    // });

    this.wss.emit('message-from-server',{
      fullName: 'Soy Yo!',
      message: payload.message || 'no-message!!'
    });
  };

  
}
