
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
      if (user.id !== 18) {
        setIsAdmin(false);
        return;
      }

      setIsAdmin(true);
    } catch {
      setIsAdmin(false);
    }
  }, []);

  return isAdmin;
}
      /* 
    /* 
    Admin =18
    {
    "email": "AvocadoTeam@gmail.com",
  "password": "Avo"
} */