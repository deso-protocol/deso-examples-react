import {
  AppShell,
  useMantineTheme,
  MediaQuery,
  Aside,
  Container,
  createStyles,
} from "@mantine/core";
import { MantineNavBar } from "./MantineNavBar";
import { MantineHeader } from "./MantineHeader";
import { MantineFooter } from "./MantineFooter";

const useStyles = createStyles((theme) => ({
  main: {
    width: "100%",
    maxWidth: "666px",
    margin: "0 auto",
    overflowX: "hidden",
  },
}));

export const MantineAppShell = ({ children }) => {
  const theme = useMantineTheme();
  const { classes } = useStyles();
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
      <Container className={classes.main}>{children}</Container>
    </AppShell>
  );
};
