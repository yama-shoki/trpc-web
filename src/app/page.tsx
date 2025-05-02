"use client";
import { trpc } from "@/utils/trpc";
import { useState } from "react";

export default function Home() {
  const [newUserName, setNewUserName] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [searchUserId, setSearchUserId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [searchProductId, setSearchProductId] = useState("");

  // 共通のエラーハンドリング
  const handleError = (message: string, err: unknown) => {
    console.error(message, err);
    setError(message);
  };

  // ユーザー取得
  const users = trpc.userList.useQuery(undefined, {
    onError: (err) => handleError("ユーザーの取得に失敗しました", err),
  });

  // 商品取得
  const products = trpc.productList.useQuery(undefined, {
    onError: (err) => handleError("製品の取得に失敗しました", err),
  });

  // ユーザー検索
  const userSearch = trpc.userById.useQuery(searchUserId, {
    enabled: false,
    onError: (err) => handleError("ユーザーの検索に失敗しました", err),
  });

  // ユーザー作成
  const createUser = trpc.userCreate.useMutation({
    onSuccess: async () => {
      try {
        await users.refetch();
        setNewUserName("");
        setError(null);
      } catch (err) {
        handleError("ユーザーリストの更新に失敗しました", err);
      }
    },
    onError: (err) => handleError("ユーザーの作成に失敗しました", err),
  });

  // 製品作成
  const createProduct = trpc.productCreate.useMutation({
    onSuccess: async () => {
      try {
        await products.refetch();
        setNewProductName("");
        setNewProductPrice("");
        setError(null);
      } catch (err) {
        handleError("製品リストの更新に失敗しました", err);
      }
    },
    onError: (err) => handleError("製品の作成に失敗しました", err),
  });

  // ユーザー検索処理
  const handleUserSearch = async () => {
    if (!searchUserId.trim()) return;
    await userSearch.refetch();
  };

  // TODOユーザー作成処理
  const handleCreateUser = async () => {
    if (!newUserName.trim()) return;
    try {
      await createUser.mutateAsync({ label: newUserName });
    } catch (err) {
      console.error("ユーザー作成処理エラー:", err);
    }
  };

  // TODO製品作成処理
  const handleCreateProduct = async () => {
    if (!newProductName.trim() || Number(newProductPrice) <= 0) return;
    try {
      await createProduct.mutateAsync({
        name: newProductName.trim(),
        price: Number(newProductPrice),
      });
    } catch (err) {
      console.error("製品作成処理エラー:", err);
    }
  };

  // 商品検索
  const productSearch = trpc.productById.useQuery(searchProductId, {
    enabled: false,
    onError: (err) => handleError("製品の検索に失敗しました", err),
  });
  // 商品検索処理
  const handleProductSearch = async () => {
    if (!searchProductId.trim()) return;
    await productSearch.refetch();
  };

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">tRPC Web デモ</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* ユーザーリスト */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              ユーザー
            </h2>

            {users.isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <ul className="space-y-2 mb-4">
                {users.data?.map((user) => (
                  <li
                    key={user.id}
                    className="p-3 bg-blue-50 rounded-md shadow-sm hover:shadow-md transition-shadow text-black"
                  >
                    {user.name}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="flex-1 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black placeholder-gray-400"
                placeholder="新しいユーザー名"
              />
              <button
                onClick={handleCreateUser}
                disabled={createUser.isLoading || !newUserName.trim()}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {createUser.isLoading ? "追加中..." : "ユーザー追加"}
              </button>
            </div>

            {/* ユーザー検索 */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">
                ユーザー検索
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchUserId}
                  onChange={(e) => setSearchUserId(e.target.value)}
                  className="flex-1 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black placeholder-gray-400"
                  placeholder="ユーザーID"
                />
                <button
                  onClick={handleUserSearch}
                  disabled={userSearch.isFetching || !searchUserId.trim()}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  検索
                </button>
              </div>
              {userSearch.data && (
                <div className="mt-2 p-3 bg-blue-50 rounded-md">
                  <p className="text-black">
                    検索結果: {userSearch.data.name} (ID: {userSearch.data.id})
                  </p>
                </div>
              )}
              {userSearch.isError && (
                <p className="mt-2 text-red-600">
                  ユーザーが見つかりませんでした。
                </p>
              )}
            </div>
          </div>

          {/* 製品リスト */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">製品</h2>

            {products.isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <ul className="space-y-2 mb-4">
                {products.data?.map((product) => (
                  <li
                    key={product.id}
                    className="p-3 bg-green-50 rounded-md shadow-sm hover:shadow-md transition-shadow flex justify-between items-center text-black"
                  >
                    <span className="font-medium">{product.name}</span>
                    <span className="font-semibold text-green-700">
                      ¥{product.price.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="space-y-2">
              <input
                type="text"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-black placeholder-gray-400"
                placeholder="新しい製品名"
              />
              <input
                type="number"
                value={newProductPrice}
                onChange={(e) => setNewProductPrice(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-black placeholder-gray-400"
                placeholder="製品価格"
              />
              <button
                onClick={handleCreateProduct}
                disabled={
                  createProduct.isLoading ||
                  !newProductName.trim() ||
                  !newProductPrice
                }
                className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {createProduct.isLoading ? "追加中..." : "製品追加"}
              </button>
            </div>

            {/* 商品検索 */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">
                商品検索
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchProductId}
                  onChange={(e) => setSearchProductId(e.target.value)}
                  className="flex-1 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-black placeholder-gray-400"
                  placeholder="商品ID"
                />
                <button
                  onClick={handleProductSearch}
                  disabled={productSearch.isFetching || !searchProductId.trim()}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  検索
                </button>
              </div>
              {productSearch.data && (
                <div className="mt-2 p-3 bg-green-50 rounded-md">
                  <p className="text-black">
                    検索結果: {productSearch.data.name} (ID:{" "}
                    {productSearch.data.id})
                  </p>
                </div>
              )}
              {productSearch.isError && (
                <p className="mt-2 text-red-600">
                  商品が見つかりませんでした。
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
