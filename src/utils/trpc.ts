import { createTRPCReact } from "@trpc/react-query";
// TODO バックエンドのパスを指定。
import type { AppRouter } from "../../../trcp-back/src/router";

// バックエンドで作成したAppRouterを付与
export const trpc = createTRPCReact<AppRouter>();
