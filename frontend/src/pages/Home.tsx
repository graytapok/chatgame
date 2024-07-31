import { Heading, Text } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";

import Button from "src/components/ui/Button";

function Home() {
  const navigate = useNavigate();
  return (
    <>
      <div className="mt-16 flex justify-center">
        <div className="flex justify-center flex-col gap-4 items-center">
          <Heading as="h1" size="9">
            Welcome to Chatgame!
          </Heading>
          <Text size="4">Game and have fun while sozializing!</Text>
          <Button onClick={() => navigate("/game")} size="3" className="w-20">
            Game
          </Button>
        </div>
      </div>
    </>
  );
}

export default Home;
