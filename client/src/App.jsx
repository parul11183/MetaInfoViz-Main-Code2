import './App.css'
import { Button } from './components/ui/button';
import { SignedIn, SignedOut, SignInButton, UserButton, SignIn } from "@clerk/clerk-react";
import AppRoutes from './Routes';
import { ThemeProvider } from "@/providers/theme-provider"
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="app-theme">
        <AppRoutes />
        {/* <UserButton /> */}
      </ThemeProvider>
      <Toaster />
    </>
  )
}

export default App;