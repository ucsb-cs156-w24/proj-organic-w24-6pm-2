import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useCurrentUser } from "main/utils/currentUser";

export default function HomePage() {
  // Stryker disable all: it is acceptable to exclude useState calls from mutation testing
  const { data: currentUser } = useCurrentUser();
  // Stryker restore all

  
  // Stryker disable all : TODO: restructure this code to avoid the need for this disable
  return (
    <div data-testid={"HomePage-main-div"}>
      <BasicLayout>
        <h1 data-testid="homePage-title" style={{ fontSize: "75px", borderRadius: "7px", backgroundColor: "white", opacity: ".9" }} className="text-center border-0 my-3">Welcome</h1>
      </BasicLayout>
    </div>
  )
  // Stryker restore all
}
