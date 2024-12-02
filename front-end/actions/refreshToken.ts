export interface DecodedToken {
     sub: string; // User ID
     exp: number; // Expiration timestamp
     // Add any other claims if needed
}
import { jwtDecode } from "jwt-decode";
// Function to decode token and get expiration
const getTokenExpiration = (token: string): number | null => {
  if (!token) return null;
  const decoded = jwtDecode<DecodedToken>(token);
  return decoded.exp * 1000; // Convert to milliseconds
};

// Function to check if token is expired
const isTokenExpired = (token: string): boolean => {
  const expirationTime = getTokenExpiration(token);
  return !expirationTime || Date.now() >= expirationTime;
};
export default isTokenExpired
export {getTokenExpiration}
