import Socket, { SocketId } from "$server/socket.ts";

type Book = {
  id: number;
  title: string;
};

interface State {
  books: Book[];
}

const state: State = {
  books: [],
};

const sockets = new Map<SocketId, Socket>();

const global = {
  sockets,
  state,
};

export default global;
