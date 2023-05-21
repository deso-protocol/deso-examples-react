import { AppShell, useMantineTheme } from "@mantine/core";
import { MantineNavBar } from "./MantineNavBar";
import { MantineHeader } from "./MantineHeader";
import { MantineFooter } from "./MantineFooter";
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
      header={<MantineHeader />}
      footer={<MantineFooter />}
    >
      {children}
    </AppShell>
  );
};
