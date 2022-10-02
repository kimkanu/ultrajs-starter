import { Handler } from "hono";
import global from "$server/global.ts";
import { assert } from "$std/_util/assert.ts";

const handler: Handler = async (context) => {
  assert(context.req.headers.get("content-type")?.includes("application/json"));

  const body = ((bytes?: Uint8Array) => {
    if (!bytes) return {};
    return JSON.parse(new TextDecoder().decode(bytes));
  })((await context.req.body?.getReader()?.read())?.value);

  const book = {
    id: global.state.books.length + 1,
    title: body.title as string ?? "Untitled",
  };
  global.state.books.push(book);

  return context.json(book, 201);
};

export default handler;
