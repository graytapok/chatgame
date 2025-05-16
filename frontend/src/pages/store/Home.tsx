import { Balance, PageHeading } from "src/components";
import { useAppSelector } from "src/hooks";

export const Home = () => {
  const user = useAppSelector((s) => s.user);

  return (
    <>
      <PageHeading title={"Store"} text={"Store for accessoires and more!"}>
        {user.id && <Balance className="absolute right-40 top-10" link />}
      </PageHeading>
    </>
  );
};
