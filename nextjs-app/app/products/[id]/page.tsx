import { Product } from "@/types/product";
import { Suspense } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

// 加载状态组件
function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          {/* 标题加载状态 */}
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>

          {/* 内容区域加载状态 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 图片加载状态 */}
            <div className="aspect-square bg-gray-200 rounded-lg"></div>

            {/* 右侧信息加载状态 */}
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-1/3 mt-6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 获取商品数据
async function getProduct(id: string): Promise<Product> {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const products: Product[] = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: 299.99,
      description: "High-quality wireless headphones with noise cancellation",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 2,
      name: "Smart Watch Pro",
      price: 199.99,
      description: "Advanced smartwatch with health tracking features",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 3,
      name: "Ultra HD Camera",
      price: 599.99,
      description: "Professional camera with 4K video capabilities",
      image:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 4,
      name: "Gaming Laptop",
      price: 1299.99,
      description: "High-performance gaming laptop with RTX graphics",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 5,
      name: "Wireless Earbuds",
      price: 149.99,
      description: "Compact wireless earbuds with long battery life",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: 6,
      name: "Smart Home Hub",
      price: 249.99,
      description: "Central control for your smart home devices",
      image:
        "https://images.unsplash.com/photo-1558002038-1055e5f0f8c9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
  ];

  const product = products.find((p) => p.id === Number(id));
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
}

// 商品详情组件
async function ProductDetail({ id }: { id: string }) {
  const product = await getProduct(id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-2xl font-bold text-blue-600 mb-4">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">Add to Cart click to me</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}

// 页面组件
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<Loading />}>
      <ProductDetail id={id} />
    </Suspense>
  );
}
