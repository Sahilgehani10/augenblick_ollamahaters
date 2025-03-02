import { SignUp } from "@clerk/clerk-react";

export const SignUpPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <SignUp 
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          appearance={{
            elements: {
              formButtonPrimary: "bg-green-600 hover:bg-green-700",
              footerActionLink: "text-green-600 hover:text-green-700"
            }
          }}
        />
      </div>
    </div>
  );
};