export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  city?: string;
  nearestUnitId?: number;
  userType: "visitante" | "intercambista" | "admin";
  // Campos específicos para admin
  internalRole?: string;
  // Campos específicos para intercambista
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    userType: "visitante" | "intercambista" | "admin";
  };
  token: string;
}

export interface JwtPayload {
  userId: number;
  email: string;
  userType: "visitante" | "intercambista" | "admin";
}
