import { Tabs } from "@radix-ui/themes";
import { PageHeading } from "src/components";

import { AddFriend } from "./AddFriend";
import { FriendsList } from "./FriendsList";
import { PendingRequests } from "./PendingRequests";

export default function Friends() {
  return (
    <>
      <PageHeading title="Friends" text="Here are all your friends!" />

      <Tabs.Root defaultValue="online">
        <Tabs.List className="mb-2">
          <Tabs.Trigger value="online">Online</Tabs.Trigger>
          <Tabs.Trigger value="all">All</Tabs.Trigger>
          <Tabs.Trigger value="pending">Pending</Tabs.Trigger>
          <Tabs.Trigger value="add" className="text-green-500">
            Add Friend
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="online">
          <FriendsList onlyOnline />
        </Tabs.Content>

        <Tabs.Content value="all">
          <FriendsList />
        </Tabs.Content>

        <Tabs.Content value="pending">
          <PendingRequests />
        </Tabs.Content>

        <Tabs.Content value="add">
          <AddFriend />
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}
