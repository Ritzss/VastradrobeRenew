export interface AuthUser {
  id: string;
  email: string;
  username: string;

  deliveryAddress?: {
    address?: string;
    phone?: string;
  };

  iat?: number;
  exp?: number;
}
