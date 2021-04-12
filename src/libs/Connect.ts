import Peer, { DataConnection } from 'peerjs';
import { saveAs } from 'file-saver';

enum MessageType {
  FILE = 'FILE',
  REMOTE_READY = 'REMOTE_READY',
}

type FilePayload = {
  name: string;
  type: string;
  size: number;
  data: Blob;
};

type FileMessage = {
  type: MessageType.FILE;
  payload: FilePayload;
};
type RemoteReadyMessage = {
  type: MessageType.REMOTE_READY;
};

type Message = FileMessage | RemoteReadyMessage;

export default class Connect {
  private peer: Peer;
  public id?: string;
  private connections: DataConnection[] = [];
  public isRemoteReady: boolean = false;

  constructor() {
    this.peer = new Peer();
    this.peer.on('open', (id) => {
      this.setId(id);
      this.peer.on('connection', (connection) =>
        this.addConnection(connection)
      );
    });
  }

  setId(id: string) {
    this.id = id;
  }

  connect(remoteId: string) {
    const connection = this.peer.connect(remoteId, { reliable: true });
    this.addConnection(connection);
    connection.on('open', () => {
      this.sendReady();
    });
  }

  sendReady() {
    console.log('Sending ready', this.connections.length);
    this.connections.forEach((connection) =>
      connection.send({ type: MessageType.REMOTE_READY })
    );
  }

  sendFile(file: File) {
    console.log('Sending file');
    this.connections.forEach((connection) => {
      connection.send({
        type: MessageType.FILE,
        payload: {
          name: file.name,
          type: file.type,
          size: file.size,
          data: new Blob([file], { type: file.type }),
        },
      });
    });
  }

  private addConnection(connection: DataConnection) {
    console.log('New Connection', connection);

    let isConnectionExists = false;
    this.connections = this.connections.map((connectionInArray) => {
      if (connectionInArray.peer === connection.peer) {
        isConnectionExists = true;
        return connection;
      }
      return connectionInArray;
    });

    if (!isConnectionExists) {
      this.connections.push(connection);
    }

    connection.on('data', this.handleData.bind(this));
  }

  handleRemoteReady() {
    console.log('Remote ready');
    this.isRemoteReady = true;
  }

  handleFile(file: FilePayload) {
    console.log('File received', file);
    saveAs(new Blob([file.data]), file.name);
  }

  handleData(data: Message) {
    console.log('Message received', data);
    switch (data.type) {
      case MessageType.FILE:
        this.handleFile(data.payload);
        break;
      case MessageType.REMOTE_READY:
        this.handleRemoteReady();
        break;
    }
  }
}
