import { Table } from "@radix-ui/themes";
import { useContext } from "react";
import { useAppSelector } from "src/hooks";
import { LeaderboardContext } from ".";

export const UsersTable = () => {
  const userId = useAppSelector((state) => state.user.id);

  const { data } = useContext(LeaderboardContext);

  return (
    <Table.Root size={"3"}>
      <Table.Header className="text-center dark:bg-neutral-800 bg-neutral-100">
        <Table.Row>
          <Table.ColumnHeaderCell>Rank</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Username</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Elo</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Win percentage</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Total wins</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body className="text-center">
        {data?.users?.map((user) => (
          <Table.Row
            key={user.id}
            className={user.id == userId ? "bg-cyan-100 dark:bg-cyan-950" : ""}
          >
            <Table.RowHeaderCell>{user.rank}</Table.RowHeaderCell>
            <Table.Cell>{user.username}</Table.Cell>
            <Table.Cell>{user.statistics.total_elo}</Table.Cell>
            <Table.Cell>
              {`${(user.statistics.win_percentage * 100).toPrecision(4)}%`}
            </Table.Cell>
            <Table.Cell>{user.statistics.total_wins}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};
