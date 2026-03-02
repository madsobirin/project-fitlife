import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

function RegisterPage() {
  return (
    <div className="flex min-h-screen justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Register to your account</CardTitle>
          <CardDescription>
            Enter your email below to register to your account
          </CardDescription>
          <CardAction>
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" placeholder="John Doe" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full cursor-pointer">
            Login
          </Button>
          <Button variant="outline" className="w-full cursor-pointer">
            Login with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
export default RegisterPage;
