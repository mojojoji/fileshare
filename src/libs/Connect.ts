import Peer, { DataConnection } from 'peerjs';
import { saveAs } from 'file-saver';
import streamSaver from 'streamsaver';

enum Mode {
  SENDER,
  RECEVIER,
}
enum MessageType {
  REMOTE_READY = 'REMOTE_READY',
  FILE_META = 'FILE_META',
  FILE_DOWNLOAD = 'FILE_DOWNLOAD_REQUEST',
  FILE_CHUNK = 'FILE_CHUNK',
  FILE_CHUNK_END = 'FILE_CHUNK_END',
}

type FileMeta = {
  name: string;
  type: string;
  size: number;
};

type RemoteReadyMessage = {
  type: MessageType.REMOTE_READY;
  remoteId: string;
};

type FileMetaMessage = {
  type: MessageType.FILE_META;
  filemeta: FileMeta;
};

type FileDownloadRequestMessage = {
  type: MessageType.FILE_DOWNLOAD;
};

type FileChunkMessage = {
  type: MessageType.FILE_CHUNK;
  buffer: Buffer;
};

type FileChunkEndMessage = {
  type: MessageType.FILE_CHUNK_END;
};

type Message =
  | RemoteReadyMessage
  | FileMetaMessage
  | FileDownloadRequestMessage
  | FileChunkMessage
  | FileChunkEndMessage;

export default class Connect {
  private mode: Mode = Mode.SENDER;
  private peer: Peer;
  public id?: string;
  private connection: DataConnection | null = null;
  public isRemoteReady: boolean = false;

  public fileMeta: FileMeta | null = null;
  private fileToSend: File | null = null;

  private fileStreamWriter: WritableStreamDefaultWriter | null = null;

  constructor() {
    this.peer = new Peer();
    this.peer.on('open', (id) => {
      this.id = id;
      this.initPeerEvents();
    });
  }

  initPeerEvents() {
    this.peer.on('connection', (connection) => {
      this.setConnection(connection);
    });
  }

  async connectToRemote(remoteId: string): Promise<void> {
    console.log('Connecting to remote', remoteId);
    const connection = this.peer.connect(remoteId, { reliable: true });
    this.setConnection(connection);
    connection.on('open', () => {
      this.sendRemoteReady();
    });
  }

  setConnection(connection: DataConnection): void {
    console.log('New connection', connection.peer);
    this.connection = connection;
    this.connection.on('data', this.handleData.bind(this));
  }

  setFileMeta(fileMeta: FileMeta) {
    this.fileMeta = fileMeta;
  }

  setFileToSend(file: File) {
    this.fileToSend = file;
    this.setFileMeta({
      name: file.name,
      type: file.type,
      size: file.size,
    });
  }

  async sendRemoteReady(): Promise<void> {
    if (!this.connection) return;

    console.log('Sending ready');
    this.connection.send({
      type: MessageType.REMOTE_READY,
      remoteId: this.connection.peer,
    });
  }

  async sendFileMeta(): Promise<void> {
    if (!this.connection || !this.fileToSend) return;

    console.log('Sending file meta');
    this.connection.send({
      type: MessageType.FILE_META,
      filemeta: {
        name: this.fileToSend.name,
        type: this.fileToSend.type,
        size: this.fileToSend.size,
      },
    });
  }

  async sendFileDownloadRequest(): Promise<void> {
    if (!this.connection) return;

    console.log('Sending file donwload request');
    this.connection.send({
      type: MessageType.FILE_DOWNLOAD,
    });
  }

  async sendFile(): Promise<void> {
    if (!this.connection || !this.fileToSend) return;

    const stream = this.fileToSend.stream();
    const reader = stream.getReader();

    let readData: ReadableStreamDefaultReadResult<any> | null;
    do {
      readData = await reader.read();
      if (readData.value) {
        const data = readData.value;
        console.log('Reader data', data);

        await this.connection.send({
          type: MessageType.FILE_CHUNK,
          buffer: data,
        });
      }
    } while (readData && !readData.done);

    setTimeout(async () => {
      if (this.connection) {
        await this.connection.send({
          type: MessageType.FILE_CHUNK_END,
        });
      }
    }, 300);
  }

  handleData(data: Message) {
    console.log('Message received', data);
    switch (data.type) {
      case MessageType.REMOTE_READY:
        this.handleRemoteReadyMessage(data);
        break;

      case MessageType.FILE_META:
        this.handleFileMetaMessage(data);
        break;

      case MessageType.FILE_DOWNLOAD:
        this.handleFileDownloadRequestMessage(data);
        break;

      case MessageType.FILE_CHUNK:
        this.handleFileChunkMessage(data);
        break;
      case MessageType.FILE_CHUNK_END:
        this.handleFileChunkEndMessage(data);
        break;
    }
  }

  handleRemoteReadyMessage(message: RemoteReadyMessage) {
    console.log('Remote ready', message);
    this.sendFileMeta();
  }

  handleFileMetaMessage(message: FileMetaMessage) {
    console.log('File meta received', message);
    const fileMeta = message.filemeta;
    this.setFileMeta(fileMeta);
  }

  handleFileDownloadRequestMessage(message: FileDownloadRequestMessage) {
    console.log('File download request received', message);
    this.sendFile();
  }

  handleFileChunkMessage(message: FileChunkMessage) {
    if (!this.fileMeta) return;

    console.log('File Chunk received', message);

    // const uInt8 = new TextEncoder().encode('StreamSaver is awesome');
    // const fileStream = streamSaver.createWriteStream('filename.txt', {
    //   size: uInt8.byteLength, // (optional filesize) Will show progress
    //   writableStrategy: undefined, // (optional)
    //   readableStrategy: undefined, // (optional)
    // });

    // const writer = fileStream.getWriter();
    // writer.write(uInt8);
    // writer.close();

    if (!this.fileStreamWriter) {
      const fileStream = streamSaver.createWriteStream(this.fileMeta.name, {
        size: this.fileMeta.size,
      });
      this.fileStreamWriter = fileStream.getWriter();
    }
    const buffer = message.buffer;
    this.fileStreamWriter.write(new Uint8Array(buffer));
  }

  handleFileChunkEndMessage(message: FileChunkEndMessage) {
    console.log('File Chunk End received', message);

    setTimeout(() => {
      if (this.fileStreamWriter) {
        this.fileStreamWriter.close();
      }
      this.fileStreamWriter = null;
    }, 1000);
  }
}
