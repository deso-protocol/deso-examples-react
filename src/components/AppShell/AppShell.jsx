import { AppShell, Footer, Text, useMantineTheme } from "@mantine/core";
import { MantineNavBar } from "./MantineNavBar";
import { MantineHeader } from "./MantineHeader";
import { ReactNode } from "react";
export const MantineAppShell = ({ children }: { children: ReactNode }) => {
  const theme = useMantineTheme();

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={<MantineNavBar />}
      footer={
        <Footer height={60} p="md">
          Application footer
        </Footer>
      }
      header={<MantineHeader />}
    >
      {children}
    </AppShell>
  );
};
