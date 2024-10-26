import { useNavigate } from "react-router-dom";
import { useAuth, useTest } from "src/api/auth";
import PageHeading from "src/components/PageHeading";

import Button from "src/components/ui/Button";

function Home() {
  const navigate = useNavigate();

  const test = useTest();
  const auth = useAuth();

  console.log(test, auth);

  return (
    <PageHeading
      title="Welcome to Chatgame!"
      text="Game and have fun while sozializing!"
    >
      <Button onClick={() => navigate("/game")} size="3" className="w-20">
        Game
      </Button>
    </PageHeading>
  );
}

export default Home;
