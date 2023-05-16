import { identity } from "deso-protocol";
import { useContext } from "react";

import { UserContext } from "../../contexts";

import {
  createStyles,
  Header,
  Group,
  Button,
  UnstyledButton,
  Text,
  ThemeIcon,
  Divider,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconNotification,
  IconCode,
  IconBook,
  IconChartPie3,
  IconFingerprint,
  IconCoin,
} from "@tabler/icons-react";
import { GiWaveCrest } from "react-icons/gi";

const useStyles = createStyles((theme) => ({
  link: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan("sm")]: {
      height: rem(42),
      display: "flex",
      alignItems: "center",
      width: "100%",
    },

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    }),
  },

  subLink: {
    width: "100%",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.radius.md,

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
    }),

    "&:active": theme.activeStyles,
  },

  dropdownFooter: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
    margin: `calc(${theme.spacing.md} * -1)`,
    marginTop: theme.spacing.sm,
    padding: `${theme.spacing.md} calc(${theme.spacing.md} * 2)`,
    paddingBottom: theme.spacing.xl,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  hiddenMobile: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
}));

const mockdata = [
  {
    icon: IconCode,
    title: "Open source",
    description: "This Pokémon’s cry is very loud and distracting",
  },
  {
    icon: IconCoin,
    title: "Free for everyone",
    description: "The fluid of Smeargle’s tail secretions changes",
  },
  {
    icon: IconBook,
    title: "Documentation",
    description: "Yanma is capable of seeing 360 degrees without",
  },
  {
    icon: IconFingerprint,
    title: "Security",
    description: "The shell’s rounded shape and the grooves on its.",
  },
  {
    icon: IconChartPie3,
    title: "Analytics",
    description: "This Pokémon uses its flying ability to quickly chase",
  },
  {
    icon: IconNotification,
    title: "Notifications",
    description: "Combusken battles with the intensely hot flames it spews",
  },
];

export const MantineHeader = () => {
  const { currentUser, isLoading } = useContext(UserContext);
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const { classes, theme } = useStyles();

  return (
    <nav className="main-nav">
      <div className="main-nav__user-actions">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <Box pb={5}>
              <Header height={60} px="md">
                <Group position="apart" sx={{ height: "100%" }}>
                  <Text
                    fz="lg"
                    fw={1000}
                    inherit
                    variant="gradient"
                    component="span"
                  >
                    Waves
                  </Text>

                  <Group
                    sx={{ height: "100%" }}
                    spacing={0}
                    className={classes.hiddenMobile}
                  ></Group>

                  <Group className={classes.hiddenMobile}>
                    <Button variant="default">Log in</Button>
                    <Button
                      leftIcon={<GiWaveCrest size="1rem" />}
                      variant="gradient"
                      gradient={{ from: "cyan", to: "indigo" }}
                    >
                      Sign up
                    </Button>
                  </Group>

                  <Burger
                    opened={drawerOpened}
                    onClick={toggleDrawer}
                    className={classes.hiddenDesktop}
                  />
                </Group>
              </Header>

              <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                title={
                  <Text
                    fz="lg"
                    fw={1000}
                    inherit
                    variant="gradient"
                    component="span"
                  >
                    Waves
                  </Text>
                }
                className={classes.hiddenDesktop}
                zIndex={1000000}
              >
                <ScrollArea h={`calc(100vh - ${rem(60)})`} mx="-md">
                  <Divider
                    my="sm"
                    color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
                  />

                  <Divider
                    my="sm"
                    color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
                  />

                  <Group position="center" grow pb="xl" px="md">
                    <Button onClick={() => identity.login()} variant="default">
                      Log in
                    </Button>
                    <Button
                      leftIcon={<GiWaveCrest size="1rem" />}
                      variant="gradient"
                      gradient={{ from: "cyan", to: "indigo" }}
                    >
                      Sign up
                    </Button>
                  </Group>
                </ScrollArea>
              </Drawer>
            </Box>
          </>
        )}
      </div>
    </nav>
  );
};
