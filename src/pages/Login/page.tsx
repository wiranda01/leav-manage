import { LoginForm } from "./form";

const Login = () => {
  return (
    <div className="my-20 space-y-4">
      <div className="flex justify-center text-3xl">Login</div>
      <div className="flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
