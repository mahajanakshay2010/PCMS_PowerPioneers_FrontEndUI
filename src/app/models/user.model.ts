export interface User {
  userId: number;
  fullName: string;
  mailId: string;
  phoneNumber: string;
  ssn: string;
  addressLine1: string;
  addressLine2: string;
  password: string;
  confirmPassword: string;
  status: string;
  rejectionComment: string;
  role: string;
}

export interface JwtRequest {
  userName: string;
  password: string;
}

export interface JwtResponse {
  userNameString: string;
  responseMessage: string;
  role: string;
  tokenString: string;
  userId: number;

}

