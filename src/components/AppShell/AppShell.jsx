import { AppShell, useMantineTheme } from "@mantine/core";
import { MantineNavBar } from "./MantineNavBar";
import { MantineHeader } from "./MantineHeader";
import { MantineFooter } from "./MantineFooter";
import { ReactNode } from "react";
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from "@livepeer/react";

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: "306f0789-aff0-4ac5-890f-eac0dccf3bcc",
  }),
});

export const MantineAppShell = ({ children }: { children: ReactNode }) => {
  const theme = useMantineTheme();

  return (
    <LivepeerConfig client={livepeerClient}>
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
    </LivepeerConfig>
  );
};
