export interface LoginResponse {
  statusCode: number;
  message: string;
  data: {
    userData: {
      name: string;
      email: string;
      username: string;
    };
    accessToken: string;
  };
}

export interface ErrorResponse {
  statusCode: number;
  error: string;
}

export interface MessageResponse {
  statusCode: number;
  message: string;
}
