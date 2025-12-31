"use client";

import type { AuthProvider } from "@refinedev/core";
import { userStore } from "@/store/memory-store";
import type { AuthUser } from "@/types/user";

export const memoryAuthProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const user = userStore.findByEmail(email);

    if (!user) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: "Usuario no encontrado",
        },
      };
    }

    if (user.password !== password) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: "Contraseña incorrecta",
        },
      };
    }

    // Set current user
    userStore.setCurrentUser(user.id);

    return {
      success: true,
      redirectTo: "/dashboard",
    };
  },

  logout: async () => {
    userStore.setCurrentUser(null);

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  register: async ({ email, password, name }) => {
    // Check if user already exists
    const existingUser = userStore.findByEmail(email);
    if (existingUser) {
      return {
        success: false,
        error: {
          name: "RegisterError",
          message: "El correo electrónico ya está registrado",
        },
      };
    }

    // Create new user
    const newUser = userStore.create({
      email,
      password,
      name: name || email.split("@")[0],
    });

    // Automatically log in the new user
    userStore.setCurrentUser(newUser.id);

    return {
      success: true,
      redirectTo: "/dashboard",
    };
  },

  check: async () => {
    const currentUser = userStore.getCurrentUser();

    if (currentUser) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
      logout: true,
    };
  },

  getIdentity: async () => {
    const currentUser = userStore.getCurrentUser();

    if (!currentUser) {
      return null;
    }

    const authUser: AuthUser = {
      id: currentUser.id,
      email: currentUser.email,
      name: currentUser.name,
    };

    return authUser;
  },

  onError: async (error) => {
    if (error?.status === 401 || error?.statusCode === 401) {
      return {
        logout: true,
        redirectTo: "/login",
        error,
      };
    }

    return { error };
  },

  getPermissions: async () => {
    return null;
  },
};
