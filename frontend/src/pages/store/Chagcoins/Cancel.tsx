import { Card, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router";

import { useCancelPaymentsHash } from "src/hooks/api/store";

export const Cancel = () => {
  const [args] = useSearchParams();
  const navigate = useNavigate();

  const [paymentHash, setPaymentHash] = useState<string>("");

  useEffect(() => {
    const p = args.get("p");
    if (p === null) {
      navigate("/store/chagcoins");
    } else {
      setPaymentHash(p);
    }
  }, [args]);

  const { status } = useCancelPaymentsHash(paymentHash);

  useEffect(() => {
    if (status == "error") {
      navigate("/store/chagcoins");
    }
  }, [status]);

  return (
    <div className="flex justify-center">
      <Card className="flex flex-col text-center w-[380px]">
        <div className="flex flex-col p-10 pt-8 items-center">
          <MdErrorOutline size={"40"} className="mb-4" />
          <Text size="5" weight="medium" className="mb-8">
            Payment {status == "success" ? "canceled" : "loading"}
            <br />
            <Text size="1" weight={"regular"} className="opacity-60">
              Nothing was bought or charged!
            </Text>
          </Text>
        </div>
      </Card>
    </div>
  );
};
