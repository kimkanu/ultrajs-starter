// deno-lint-ignore-file no-explicit-any
import { useEffect, useMemo, useRef, useState } from "react";
import useSocket from "react-use-websocket";

export default function useWebSocket() {
  const url = useMemo(() => {
    if (!window.location) return "";
    const url = new URL(window.location.href);
    url.protocol = url.protocol === "https" ? "wss" : "ws";
    return url;
  }, []);

  const [lastMessage, setLastMessage] = useState<
    { tag: string; data: any } | null
  >(null);
  const pongTimeout = useRef<number | null>(null);

  const { sendMessage, lastMessage: last, readyState, getWebSocket } =
    useSocket(
      url.toString(),
      {
        shouldReconnect: () => true,
        share: true,
      },
    );

  useEffect(() => {
    if (last !== null && typeof last.data === "string") {
      if (last.data === "") {
        clearTimeout(pongTimeout.current ?? undefined);
        pongTimeout.current = setTimeout(() => {
          getWebSocket()?.close(0, "Unstable pong");
        }, 16000);
      } else {
        const [tag, data] = JSON.parse(last.data);
        setLastMessage({ tag, data });
      }
    }
  }, [last]);

  // ping
  useEffect(() => {
    const interval = setInterval(() => {
      sendMessage("");
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const send = (tag: string, data: any) => {
    sendMessage(JSON.stringify([tag, data]));
  };

  return {
    send,
    lastMessage,
    readyState,
    getWebSocket,
  };
}
