import { identity } from "deso-protocol";
import { useContext } from "react";
import { UserContext } from "../../contexts";
import { getDisplayName } from "../../helpers";

import {
  createStyles,
  Menu,
  Header,
  Group,
  Button,
  Text,
  Divider,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

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

                  <Group className={classes.hiddenMobile}>
                    {isLoading ? (
                      <div>Loading...</div>
                    ) : (
                      <>
                        {!currentUser && (
                          <>
                            <Button
                              leftIcon={<GiWaveCrest size="1rem" />}
                              variant="gradient"
                              gradient={{ from: "cyan", to: "indigo" }}
                              onClick={() => identity.login()}
                            >
                              Sign Up
                            </Button>
                          </>
                        )}

                        {!!currentUser && (
                          <Menu
                            trigger="hover"
                            openDelay={100}
                            closeDelay={400}
                            shadow="md"
                            width={200}
                          >
                            <Menu.Target>
                              <Button
                                leftIcon={<GiWaveCrest size="1rem" />}
                                variant="gradient"
                                gradient={{ from: "cyan", to: "indigo" }}
                              >
                                {getDisplayName(currentUser)}
                              </Button>
                            </Menu.Target>

                            <Menu.Dropdown>
                              <Menu.Label>Account</Menu.Label>
                              <Menu.Item onClick={() => identity.logout()}>
                                Logout
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        )}
                      </>
                    )}
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
