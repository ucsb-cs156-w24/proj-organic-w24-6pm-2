import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

export default function HomePage() {
  
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
