import { Handler } from "hono";
import state from "$server/state.ts";
import { assert } from "$std/_util/assert.ts";

const handler: Handler = async (context) => {
  assert(context.req.headers.get("content-type")?.includes("application/json"));

  const body = ((bytes?: Uint8Array) => {
    if (!bytes) return {};
    return JSON.parse(new TextDecoder().decode(bytes));
  })((await context.req.body?.getReader()?.read())?.value);

  const book = {
    id: state.books.length + 1,
    title: body.title as string ?? "Untitled",
  };
  state.books.push(book);

  return context.json(book, 201);
};

export default handler;
