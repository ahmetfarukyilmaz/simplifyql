import { AppShell } from "@mantine/core";
import Flow from "Flow";
import { Header } from "components";
import { ErDiagrams } from "pages";

export default function App() {
  // if user is not logged in, redirect to login page
  // check if user is logged in by checking if there is a token in local storage
  if (!localStorage.getItem("token")) {
    window.location.href = "/login";
  }

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
      {window.location.pathname === "/canvas" && <Flow />}
      {window.location.pathname === "/er-diagrams" && <ErDiagrams />}
    </AppShell>
  );
}
