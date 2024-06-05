import { Heading, SegmentedControl } from "@radix-ui/themes";
import { Outlet, useNavigate, useParams } from "react-router-dom";

function TestOutlet() {
  const navigate = useNavigate();
  const params = useParams();

  console.log(params);
  return (
    <>
      <Heading size="7" className="mt-3 ml-3">
        Test
      </Heading>
      <SegmentedControl.Root defaultValue="query" className="m-4">
        <SegmentedControl.Item value="query" onClick={() => navigate("/test")}>
          Query
        </SegmentedControl.Item>
        <SegmentedControl.Item
          value="fetch"
          onClick={() => navigate("/test/fetch")}
        >
          Fetch
        </SegmentedControl.Item>
        <SegmentedControl.Item
          value="params"
          onClick={() => navigate("/test/params")}
        >
          Params
        </SegmentedControl.Item>
        <SegmentedControl.Item
          value="socket"
          onClick={() => navigate("/test/socketio")}
        >
          Socket Io
        </SegmentedControl.Item>
      </SegmentedControl.Root>
      <Outlet />
    </>
  );
}

export default TestOutlet;
