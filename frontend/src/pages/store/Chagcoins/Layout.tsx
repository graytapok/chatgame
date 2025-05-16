import { ResetIcon } from "@radix-ui/react-icons";
import { IconButton, Tooltip } from "@radix-ui/themes";
import { Outlet, useNavigate, useParams } from "react-router";
import { Balance, PageHeading } from "src/components";

export const Layout = () => {
  const navigate = useNavigate();

  const path = useParams();

  return (
    <>
      <PageHeading
        title={"Chagcoins"}
        text={"Buy chagcoins and fill your balance!"}
      >
        {path["*"] !== "success" && (
          <Tooltip content="Back to the item store">
            <IconButton
              className="absolute left-40 top-12 rounded-full"
              onClick={() => navigate("/store")}
            >
              <ResetIcon />
            </IconButton>
          </Tooltip>
        )}

        {path["*"] === "cancel" && (
          <Tooltip content="Back to the chagcoin store">
            <IconButton
              className="absolute left-40 top-12 rounded-full"
              onClick={() => navigate("/store/chagcoins")}
            >
              <ResetIcon />
            </IconButton>
          </Tooltip>
        )}

        {path["*"] === "success" ? (
          <Balance className="absolute right-40 top-10" link />
        ) : (
          <Balance className="absolute right-40 top-10" />
        )}
      </PageHeading>

      <Outlet />
    </>
  );
};
