import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TextEditor } from "./components/TextEditor";
import { LandingPage } from "./components/LandingPage";
import NewLandingPage from "./components/NewLandingPage";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { SignInPage } from "./components/SignInPage";
import { SignUpPage } from "./components/SignUpPage";

function App() {
  return (
    
      <div className="app">
        <Router>
          <Routes>
            {/* Public route */}
            <Route path="/" element={<NewLandingPage />} />

            {/* Protected routes */}
            <Route
              path="/home"
              element={
                <>
                  <SignedIn>
                    <LandingPage />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/documents/:id"
              element={
                <>
                  <SignedIn>
                    <TextEditor />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />

            {/* Clerk authentication routes */}
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
          </Routes>
        </Router>
      </div>
    
  );
}

export default App;