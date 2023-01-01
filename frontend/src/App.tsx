import { AppShell } from "@mantine/core";
import Flow from "Flow";
import { Header } from "components";

export default function App() {
  return (
    <AppShell
      padding="md"
      header={<Header />}
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <Flow />
    </AppShell>
  );
}
