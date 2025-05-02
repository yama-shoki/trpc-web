"use client";
import { trpc } from "@/utils/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useMemo } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  // React Queryクライアントの初期化
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false, // ウィンドウフォーカス時の自動再取得を無効化
            retry: 1, // エラー時の再試行回数を1回に設定
          },
        },
      }),
    []
  );

  // tRPCクライアントの初期化
  const trpcClient = useMemo(
    () =>
      trpc.createClient({
        links: [
          httpBatchLink({
            url: "http://localhost:3005/trpc",
            // 必要に応じてheadersやその他の設定を追加可能
          }),
        ],
      }),
    []
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
