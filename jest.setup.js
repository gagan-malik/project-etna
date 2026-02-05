// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return "/";
  },
}));

// Mock Clerk
jest.mock("@clerk/nextjs", () => ({
  useAuth: () => ({ isSignedIn: false, isLoaded: true }),
  useUser: () => ({ user: null, isLoaded: true }),
  useClerk: () => ({ signOut: jest.fn() }),
  ClerkProvider: ({ children }) => children,
  SignIn: () => null,
  SignUp: () => null,
  auth: () => Promise.resolve({ userId: null }),
  currentUser: () => Promise.resolve(null),
}));

