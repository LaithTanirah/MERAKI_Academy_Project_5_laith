"use client";
import { useEffect, useState } from "react";

export default function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userJson = localStorage.getItem("user");

    if (!token || !userJson) {
      setIsAdmin(false);
      return;
    }

    try {
      const user = JSON.parse(userJson);
      
      if (user.email === "AvocadoAdmin@gmail.com" && user.role_id === 1) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      console.error("Auth error", err);
      setIsAdmin(false);
    } 
  }, []);

  return isAdmin;
}
