import { Heading, SegmentedControl } from "@radix-ui/themes";
import { Outlet, useNavigate, useParams } from "react-router-dom";

const pages: string[] = ["query", "fetch", "chat"];

function TestOutlet() {
  const navigate = useNavigate();
  const { "*": param } = useParams();
  return (
    <>
      <Heading size="7" className="mt-3 ml-3">
        Test
      </Heading>
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
