import { Handler } from "hono";
import state from "$server/state.ts";

const handler: Handler = (context) => {
  return context.json(state.books);
};

export default handler;
