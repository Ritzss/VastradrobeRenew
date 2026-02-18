export interface AuthUser {
  id: string;
  email: string;
  username: string;

  avatar?: string;   // 👈 ADD THIS

  deliveryAddress?: {
    address?: string;
    phone?: string;
  };

  iat?: number;
  exp?: number;
}
