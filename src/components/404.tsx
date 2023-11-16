import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NoRoute = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center gap-2 pb-[65px]">
      <span>Page not Found</span>
      <Link to={"/"}>
        <Button variant={"outline"}>Back to first page</Button>
      </Link>
    </div>
  );
};

export default NoRoute;
