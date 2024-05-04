import { useParams, useSearchParams } from "react-router-dom";

function TestParams() {
  const { id } = useParams();
  const [serchParams, setSearchParams] = useSearchParams();
  const number: string | null = serchParams.get("n");

  return (
    <>
      <div>Test Id: {id}</div>
      <label key="number">
        Search Number:{" "}
        <input
          className="
          bg-gray-800 text-white rounded-lg p-2
        "
          type="number"
          value={number || ""}
          id="number"
          onChange={(e) => {
            setSearchParams({ n: e.target.value });
          }}
        />
      </label>
    </>
  );
}

export default TestParams;
