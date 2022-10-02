import { Link, Route, Switch } from "wouter";
import HomePage from "./pages/Home.tsx";
import ThemeProvider from "./context/ThemeProvider.tsx";

export default function App() {
  return (
    <ThemeProvider>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <title>with-wouter</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="stylesheet" href="/style.css" />
        </head>
        <body>
          <Switch>
            <Route path="/">
              <HomePage />
            </Route>
            <Route>
              404
            </Route>
          </Switch>
        </body>
      </html>
    </ThemeProvider>
  );
}
