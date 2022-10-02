// deno-lint-ignore-file no-explicit-any
export type SocketId = string;

type MessageHandler = (data: any) => void;

export default class Socket {
  pingTimeout?: number;

  constructor(public readonly id: SocketId, readonly raw: WebSocket) {
    raw.onopen = () => {
      this.#openListeners.forEach((listener) => listener());
    };
    raw.onclose = (e) => {
      this.#closeListeners.forEach((listener) => listener(e));
    };
    raw.onerror = (e) => {
      this.#errorListeners.forEach((listener) => listener(e));
    };
    raw.onmessage = (e) => {
      if (typeof e.data === "string" && !e.data) {
        // ping
        this.raw.send(""); // pong
        clearTimeout(this.pingTimeout);
        this.pingTimeout = setTimeout(() => {
          this.close(0, "Unstable ping");
        }, 16000);
      }

      if (typeof e.data === "string" && e.data) {
        const [tag, data] = JSON.parse(e.data);
        this.#messageListeners.forEach(([t, handler]) => {
          if (t === tag) {
            handler(data);
          }
        });
      }
    };
  }

  #openListeners: (() => void)[] = [];
  #closeListeners: ((e: CloseEvent) => void)[] = [];
  #errorListeners: ((e: Event) => void)[] = [];
  #messageListeners: [string, MessageHandler][] = [];

  addEventListener(type: "open", handler: () => void): void;
  addEventListener(type: "close", handler: (e: CloseEvent) => void): void;
  addEventListener(type: "error", handler: (e: Event) => void): void;
  addEventListener(
    type: "message",
    tag: string,
    handler: (e: Event) => void,
  ): void;
  addEventListener(
    type: "open" | "close" | "error" | "message",
    tagOrHandler: any,
    ...rest: any
  ) {
    switch (type) {
      case "open":
        this.#openListeners.push(tagOrHandler);
        break;
      case "close":
        this.#closeListeners.push(tagOrHandler);
        break;
      case "error":
        this.#errorListeners.push(tagOrHandler);
        break;
      case "message":
        this.#messageListeners.push(
          [tagOrHandler, ...rest] as [string, MessageHandler],
        );
        break;
    }
  }

  removeEventListener(type: "open", handler: () => void): void;
  removeEventListener(type: "close", handler: (e: CloseEvent) => void): void;
  removeEventListener(type: "error", handler: (e: Event) => void): void;
  removeEventListener(
    type: "message",
    tag: string,
    handler: (e: Event) => void,
  ): void;
  removeEventListener(
    type: "open" | "close" | "error" | "message",
    tagOrHandler: any,
    ...rest: any
  ) {
    switch (type) {
      case "open":
        this.#openListeners.splice(
          this.#openListeners.indexOf(tagOrHandler),
          1,
        );
        break;
      case "close":
        this.#openListeners.splice(
          this.#openListeners.indexOf(tagOrHandler),
          1,
        );
        break;
      case "error":
        this.#openListeners.splice(
          this.#openListeners.indexOf(tagOrHandler),
          1,
        );
        break;
      case "message":
        this.#messageListeners.splice(
          this.#messageListeners.findIndex(([tag, handler]) =>
            tag === tagOrHandler && handler === rest[0]
          ),
          1,
        );
        break;
    }
  }

  send<T extends string, M>(tag: T, message: M) {
    this.raw.send(JSON.stringify([tag, message]));
  }

  close(code?: number, reason?: string) {
    this.#openListeners = [];
    this.#closeListeners = [];
    this.#errorListeners = [];
    this.#messageListeners = [];

    this.raw.close(code, reason);
  }
}
