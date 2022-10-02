import { useEffect, useMemo } from "react";
import { Route, Switch } from "wouter";
import useWebSocket from "./hooks/useWebSocket.ts";
import HomePage from "./pages/Home.tsx";
import ThemeProvider from "./context/ThemeProvider.tsx";
import { tw } from "twind";

const WebSocketDemo = () => {
  const { lastMessage, readyState } = useWebSocket();

  useEffect(() => {
    console.log(lastMessage?.data);
  }, [lastMessage]);

  return (
    <div className={tw`fixed top-0 left-0`}>
      readyState: {readyState}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <title>Boilerplate</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="stylesheet" href="/style.css" />
        </head>
        <body>
          <WebSocketDemo />
          <Switch>
            <Route path="/">
              <HomePage />
            </Route>
            <Route>
              <div className={tw`grid w-full h-full place-items-center`}>404</div>
            </Route>
          </Switch>
        </body>
      </html>
    </ThemeProvider>
  );
}
