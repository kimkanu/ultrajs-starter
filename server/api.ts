import { join } from "$std/path/mod.ts";
import { Environment, Handler } from "hono";
import { createRouter } from "ultra/server.ts";

export default async function createApiRouter() {
  const router = createRouter();

  async function recursiveReaddir(path: string) {
    const files: string[] = [];
    const getFiles = async (_path: string) => {
      const path = _path.replace(/^file:\/\//, "");
      for await (
        const dirEntry of Deno.readDir(path)
      ) {
        if (dirEntry.isDirectory) await getFiles(join(path, dirEntry.name));
        else if (dirEntry.isFile) files.push(join(path, dirEntry.name));
      }
    };
    await getFiles(path);
    return files;
  }

  const routes = await Promise.all(
    (await recursiveReaddir(
      import.meta.resolve("./api"),
    )).map(
      (route) =>
        import(route).then((module) => {
          const filename = route.replace(/\.tsx?/g, "");
          const method = !filename.includes(".") ? "get" : (() => {
            switch (filename.split(".").at(-1)!) {
              case "get":
                return "get";
              case "post":
                return "post";
              case "put":
                return "put";
              case "patch":
                return "patch";
              case "delete":
                return "delete";
              case "options":
                return "options";
              case "head":
                return "head";
              case "all":
                return "all";
              default:
                return "get";
            }
          })();
          return [
            route
              .replace(
                `${import.meta.resolve("./").replace(/^file:\/\//, "")}api`,
                "",
              )
              .replace(/\.tsx?/g, "")
              .replace(new RegExp(`\\.${method}$`), "")
              .replace(
                /\/index$/,
                "",
              ) || "/",
            method,
            module.default,
          ] as [string, typeof method, Handler<string, Environment>];
        }),
    ),
  ).then((routes) =>
    routes.sort(([r], [s]) => {
      const divide = (p: string) => p.split("/").filter((x) => x);
      const rDivided = divide(r);
      const sDivided = divide(s);

      const pathLengthDiff = rDivided.length - sDivided.length;
      if (pathLengthDiff !== 0) return pathLengthDiff;

      const getWildcardIndex = (dividedString: string[]) => {
        const index = dividedString.findIndex((x) => x.startsWith(":"));
        if (index === -1) return dividedString.length;
        return index;
      };
      return getWildcardIndex(sDivided) - getWildcardIndex(rDivided);
    })
  );
  console.log(routes, import.meta.resolve("./"));

  routes.forEach(([route, method, handler]) => {
    router[method](route, handler);
  });

  return router;
}
