export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
};

export type Shop = {
  id: string;
  name: string;
  platform: string;
  tenant_id: string;
  address?: string;
  description?: string;

  created_at: string;
  updated_at: string;
  effective_time: string;
  expiration_time: string;
};
