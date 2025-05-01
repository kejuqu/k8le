import { Product } from '@/types/product';
import Link from 'next/link';

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 299.99,
    description: 'High-quality wireless headphones with noise cancellation',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
  {
    id: 2,
    name: 'Smart Watch Pro',
    price: 199.99,
    description: 'Advanced smartwatch with health tracking features',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
  {
    id: 3,
    name: 'Ultra HD Camera',
    price: 599.99,
    description: 'Professional camera with 4K video capabilities',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
  {
    id: 4,
    name: 'Gaming Laptop',
    price: 1299.99,
    description: 'High-performance gaming laptop with RTX graphics',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
  {
    id: 5,
    name: 'Wireless Earbuds',
    price: 149.99,
    description: 'Compact wireless earbuds with long battery life',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
  {
    id: 6,
    name: 'Smart Home Hub',
    price: 249.99,
    description: 'Central control for your smart home devices',
    image: 'https://images.unsplash.com/photo-1558002038-1055e5f0f8c9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
];

// 模拟从API获取数据
async function getProducts(): Promise<Product[]> {
  // 这里可以替换为实际的API调用
  return mockProducts;
}

// 配置ISR，每60秒重新生成页面
export const revalidate = 60;

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">
                  ${product.price.toFixed(2)}
                </span>
                <Link 
                  href={`/products/${product.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                  To Detail
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
