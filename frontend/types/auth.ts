export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  token: string;
}
