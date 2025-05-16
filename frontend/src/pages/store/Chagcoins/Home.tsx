import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { Button, Card, Spinner, Text } from "@radix-ui/themes";

import { Product, useCreateSession } from "src/hooks/api/store";

const data: Product[] = [
  {
    id: "prod_SCBNuz7jf9cukq",
    name: "1000 Chagcoins",
    price: 999,
    currency: "usd",
    price_id: "price_1RHn0kJKhMWrJRZIG8gAq1lF",
    images: ["/1000_chagcoins.png"],
    createdAt: 1745590429,
    type: "service",
  },
  {
    id: "prod_SCBNPkVwOZd4ld",
    name: "2500 Chagcoins",
    price: 1999,
    currency: "usd",
    price_id: "price_1RHn1DJKhMWrJRZIDJCSiSxH",
    images: ["/2500_chagcoins.png"],
    createdAt: 1745590458,
    type: "service",
  },
  {
    id: "prod_SCBOTncKl1MsDD",
    name: "6000 Chagcoins",
    price: 4999,
    currency: "usd",
    price_id: "price_1RHn1RJKhMWrJRZITsqUVyGa",
    images: ["/6000_chagcoins.png"],
    createdAt: 1745590473,
    type: "service",
  },
  {
    id: "prod_SCBPBz8KAqevWR",
    name: "13000 Chagcoins",
    price: 9999,
    currency: "usd",
    price_id: "price_1RHn2YJKhMWrJRZI85rLShwe",
    images: ["/13000_chagcoins.png"],
    createdAt: 1745590541,
    type: "service",
  },
];

export const Home = () => {
  return (
    <>
      <div className="flex flex-row justify-center align-middle gap-4">
        {data?.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </>
  );
};

export const ProductCard = (product: Product) => {
  const { mutate, isPending } = useCreateSession();

  return (
    <Card className="flex flex-col p-5 w-60 text-center">
      <img src={product.images[0]} className="w-full" />
      <Text size={"6"} className="mb-1">
        {product.name.split(" ")[0]}
      </Text>
      <Text size={"3"} className="mb-2">
        {product.name.split(" ")[1]}
      </Text>
      <Text size={"3"} className="mb-2" color="red">
        ${product.price / 100}
      </Text>
      <Button
        disabled={isPending}
        onClick={() => mutate(product.price_id)}
        className="cursor-pointer"
      >
        {isPending ? (
          <Spinner />
        ) : (
          <>
            Buy <ExternalLinkIcon className="mt-[2px]" />
          </>
        )}
      </Button>
    </Card>
  );
};
