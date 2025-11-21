import { Service } from "../types/service";

/**
 * Simple email validation
 */
export const isValidEmail = (email: string): boolean => {
  return email.includes("@");
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

export const filterServicesByName = (
  services: Service[],
  query: string
): Service[] => {
  const q = query.toLowerCase();
  return services.filter((s) => s.name.toLowerCase().includes(q));
};

export const formatDate = (date: string): string => {
  const d = new Date(date);
  return d.toDateString();
};
