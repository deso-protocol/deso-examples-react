import { AppShell, useMantineTheme, MediaQuery, Aside } from "@mantine/core";
import { MantineNavBar } from "./MantineNavBar";
import { MantineHeader } from "./MantineHeader";
import { MantineFooter } from "./MantineFooter";

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

export const MantineAppShell = ({ children }) => {
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
        aside={
          <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
            <Aside
              zIndex={10}
              p="md"
              hiddenBreakpoint="sm"
              width={{ sm: 200, lg: 300 }}
            ></Aside>
          </MediaQuery>
        }
        header={<MantineHeader />}
        navbar={<MantineNavBar />}
        footer={<MantineFooter />}
      >
        {children}
      </AppShell>
    </LivepeerConfig>
  );
};
