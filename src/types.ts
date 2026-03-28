export interface User {
  email: string;
  password: string;
  name: string;
}

export type Phase = "intro" | "auth" | "home";
export type CardSide = "login" | "register";

export const getUsers = (): User[] =>
  JSON.parse(localStorage.getItem("newran_users") || "[]");

export const saveUsers = (users: User[]) =>
  localStorage.setItem("newran_users", JSON.stringify(users));