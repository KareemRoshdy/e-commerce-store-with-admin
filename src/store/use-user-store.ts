import { create } from "zustand";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";
import { User } from "@prisma/client";

interface UserState {
  user: User | null;
  loading: boolean;
  checkingAuth: boolean;
  signup: (
    email: string,
    password: string,
    name: string,
    confirmPassword: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  // refreshToken: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      toast.error("Passwords do not match");
    }

    try {
      const res = await axios.post("/auth/signup", { name, email, password });
      set({ user: res.data.user, loading: false });

      toast.success("Account created");
    } catch {
      set({ loading: false });
      toast.error("An error occurred");
    }
  },

  login: async (email: string, password: string) => {
    set({ loading: true });

    try {
      const res = await axios.post("/auth/login", { email, password });
      set({ user: res.data.user, loading: false });

      toast.success("Welcome Back 👋");
    } catch {
      set({ loading: false });
      toast.error("An error occurred");
    }
  },

  logout: async () => {
    set({ loading: true });

    try {
      await axios.post("/auth/logout");
      set({ user: null, loading: false, checkingAuth: false });

      toast.success("Logged out", { id: "logout" });
    } catch {
      set({ loading: false });
      toast.error("An error occurred");
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });

    try {
      const res = await axios.get("/auth/profile");

      set({ user: res.data.user, checkingAuth: false });
    } catch {
      set({ user: null, checkingAuth: false });
    }
  },

  // refreshToken: async () => {
  //   if (get().checkingAuth) return;

  //   set({ checkingAuth: true });
  //   try {
  //     const res = await axios.post("/auth/refresh-token");
  //     set({ checkingAuth: false });
  //     return res.data;
  //   } catch (error) {
  //     set({ user: null, checkingAuth: false });
  //     throw error;
  //   }
  // },
}));

// let refreshPromise = null;

// axios.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         if (refreshPromise!) {
//           await refreshPromise;
//           return axios(originalRequest);
//         }

//         refreshPromise = useUserStore.getState().refreshToken();
//         await refreshPromise;
//         refreshPromise = null;

//         return axios(originalRequest);
//       } catch (refreshError) {
//         useUserStore.getState().logout();
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );
