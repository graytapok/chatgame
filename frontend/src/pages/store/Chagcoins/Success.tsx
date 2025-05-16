import { FileIcon } from "@radix-ui/react-icons";
import {
  Button,
  Card,
  Separator,
  Skeleton,
  Spinner,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { FaCheckToSlot } from "react-icons/fa6";
import { useNavigate, useSearchParams } from "react-router";

import { usePaymentsHash } from "src/hooks/api/store";

export const Success = () => {
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

  const { data, isError } = usePaymentsHash(paymentHash);

  const [dateTime, setDateTime] = useState<Date>();

  useEffect(() => {
    if (data?.fulfilled) {
      setDateTime(new Date(data?.created_at));
    }

    if (isError) {
      navigate(`/store/chagcoins/cancel?p=${paymentHash}`);
    }
  }, [data, isError]);

  const handleReceipt = () => {
    if (data?.receipt_url) {
      window.open(data?.receipt_url);
    }
  };

  return (
    <div className="flex justify-center">
      <Card className="flex flex-col text-center w-[380px]">
        <div className="flex flex-col p-10 pt-8 items-center">
          <FaCheckToSlot size={"40"} className="mb-4" />
          <Text size="5" weight="medium" className="mb-8">
            Payment {data?.fulfilled ? "successful" : "loading"}
            <br />
            <Text size="1" weight={"regular"} className="opacity-60">
              Thank you for your purchase!
            </Text>
          </Text>
          <Tooltip content="Get the receipt">
            <Button
              onClick={handleReceipt}
              disabled={!data?.fulfilled}
              variant="outline"
              size="1"
              className="w-min cursor-pointer"
            >
              {!data?.fulfilled ? (
                <Spinner size={"1"} />
              ) : (
                <FileIcon className="mt-[1px]" />
              )}
              Receipt
            </Button>
          </Tooltip>
        </div>

        <Separator size="4" />

        <div className="flex flex-col p-4 gap-2">
          <div className="flex justify-between">
            <Text size="1">Time / Date</Text>
            {data?.fulfilled ? (
              <Text size="1">
                {dateTime?.getHours()}:{dateTime?.getMinutes()}{" "}
                {dateTime?.getDate()}/{dateTime?.getMonth()}/
                {dateTime?.getFullYear()}
              </Text>
            ) : (
              <Skeleton>13:50 12/12/2000</Skeleton>
            )}
          </div>
          <div className="flex justify-between">
            <Text size="1">Payment method</Text>
            {data?.fulfilled ? (
              <Text size="1">{data?.payment_method}</Text>
            ) : (
              <Skeleton>card</Skeleton>
            )}
          </div>
          <div className="flex justify-between">
            <Text size="1">Full name</Text>
            {data?.fulfilled ? (
              <Text size="1">{data?.full_name}</Text>
            ) : (
              <Skeleton>Wadim Trupp</Skeleton>
            )}
          </div>
          <div className="flex justify-between">
            <Text size="1">Email</Text>
            {data?.fulfilled ? (
              <Text size="1">{data?.billing_email}</Text>
            ) : (
              <Skeleton>wvtrupp@gmail.com</Skeleton>
            )}
          </div>
        </div>

        <Separator size="4" />

        <div className="flex flex-col p-4 gap-2">
          <div className="flex justify-between">
            <Text size="1">Total Amount</Text>
            {data?.fulfilled ? (
              <Text size="1">
                $ {data?.total_amount && data?.total_amount / 100}
              </Text>
            ) : (
              <Skeleton>$ 100.00</Skeleton>
            )}
          </div>
        </div>

        <div className="flex justify-end m-2">
          <Button
            size={"1"}
            className="cursor-pointer"
            onClick={() => navigate("/store")}
          >
            Back to the item store
          </Button>
        </div>
      </Card>
    </div>
  );
};
