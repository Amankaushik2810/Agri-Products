import { jwtDecode } from 'jwt-decode';

export const decodeRoleFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.role || null;
  } catch {
    return null;
  }
};


export const decodeIdFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.id || null;
  } catch {
    return null;
  }
};