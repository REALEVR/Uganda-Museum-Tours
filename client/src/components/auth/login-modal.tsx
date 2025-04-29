import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

const LoginModal = () => {
  const { loginModalOpen, closeLoginModal, openRegisterModal, login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.username, data.password);
      toast({
        title: "Login successful",
        description: "You have been logged in successfully.",
      });
      closeLoginModal();
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpClick = () => {
    closeLoginModal();
    openRegisterModal();
  };

  return (
    <Dialog open={loginModalOpen} onOpenChange={closeLoginModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading font-bold text-xl">Sign In</DialogTitle>
          <DialogDescription>
            Enter your credentials to access your account
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Your username"
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a 
                  href="#" 
                  className="text-sm text-primary hover:underline"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Your password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="rememberMe" {...register("rememberMe")} />
              <Label htmlFor="rememberMe" className="text-sm font-normal">Remember me</Label>
            </div>
          </div>
          <div className="flex flex-col space-y-4 mt-6">
            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
              {isLoading ? (
                <>
                  <span className="mr-2">Signing in</span>
                  <i className="ri-loader-4-line animate-spin"></i>
                </>
              ) : "Sign In"}
            </Button>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <button 
                type="button" 
                onClick={handleSignUpClick}
                className="text-primary hover:underline"
              >
                Sign Up
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
