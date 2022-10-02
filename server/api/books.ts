import { Handler } from "hono";
import global from "$server/global.ts";

const handler: Handler = (context) => {
  return context.json(global.state.books);
};

export default handler;
