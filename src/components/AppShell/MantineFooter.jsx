import {
  createStyles,
  Footer,
  rem,
  MediaQuery,
  ActionIcon,
  Group,
  getStylesRef,
} from "@mantine/core";
import { useState } from "react";
import {
  IconBellRinging,
  IconUser,
  IconSettings,
  IconHome2,
  IconDeviceDesktopAnalytics,
  IconReceipt2,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: rem(120),
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",

    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[7],
    padding: `${theme.spacing.sm} ${theme.spacing.sm}`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,

      [`& .${getStylesRef("icon")}`]: {
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
      },
    },
  },

  linkIcon: {
    ref: getStylesRef("icon"),
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
      [`& .${getStylesRef("icon")}`]: {
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
      },
    },
  },
}));

export const MantineFooter = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("Home");
  const { classes, cx } = useStyles();

  return (
    <Footer p="md" className={classes.footer}>
      <Group position="center" spacing="lg" grow noWrap>
        <ActionIcon
          size="xl"
          radius="xs"
          className={cx(classes.link, {
            [classes.linkActive]: active === "/",
          })}
          onClick={() => {
            setActive("/");
            navigate("/");
          }}
        >
          <IconHome2 size="1.4rem" className={classes.actionIcon} />
        </ActionIcon>

        <ActionIcon
          size="xl"
          radius="xs"
          className={cx(classes.link, {
            [classes.linkActive]: active === "/discover",
          })}
          onClick={() => {
            setActive("/discover");
            navigate("/discover");
          }}
        >
          <IconDeviceDesktopAnalytics
            size="1.4rem"
            className={classes.actionIcon}
          />
        </ActionIcon>

        <ActionIcon
          size="xl"
          radius="xs"
          className={cx(classes.link, {
            [classes.linkActive]: active === "/profile",
          })}
          onClick={() => {
            setActive("/profile");
            navigate("/profile");
          }}
        >
          <IconUser size="1.4rem" className={classes.actionIcon} />
        </ActionIcon>

        <ActionIcon
          size="xl"
          radius="xs"
          className={cx(classes.link, {
            [classes.linkActive]: active === "/wallet",
          })}
          onClick={() => {
            setActive("/wallet");
            navigate("/wallet");
          }}
        >
          <IconReceipt2 size="1.4rem" className={classes.actionIcon} />
        </ActionIcon>

        <ActionIcon
          size="xl"
          radius="xs"
          className={cx(classes.link, {
            [classes.linkActive]: active === "/notifications",
          })}
          onClick={() => {
            setActive("/notifications");
            navigate("/notifications");
          }}
        >
          <IconBellRinging size="1.4rem" className={classes.actionIcon} />
        </ActionIcon>

        <ActionIcon
          size="xl"
          radius="xs"
          className={cx(classes.link, {
            [classes.linkActive]: active === "/settings",
          })}
          onClick={() => {
            setActive("/settings");
            navigate("/settings");
          }}
        >
          <IconSettings size="1.4rem" className={classes.actionIcon} />
        </ActionIcon>
      </Group>
    </Footer>
  );
};