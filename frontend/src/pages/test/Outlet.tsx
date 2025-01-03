import { SegmentedControl } from "@radix-ui/themes";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { PageHeading } from "src/components";

const pages: string[] = ["query", "fetch", "chat"];

function TestOutlet() {
  const navigate = useNavigate();
  const { "*": param } = useParams();
  return (
    <>
      <PageHeading title="Test" text="Self build tool for the developer." />
      <SegmentedControl.Root defaultValue={param || "query"} className="m-4">
        {pages.map((page) => (
          <SegmentedControl.Item
            value={page}
            key={page}
            onClick={() =>
              navigate(page == "query" ? `/test` : `/test/${page}`)
            }
          >
            {page}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl.Root>
      <Outlet />
    </>
  );
}

export default TestOutlet;
