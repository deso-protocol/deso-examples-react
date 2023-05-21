import {
  createStyles,
  Footer,
  rem,
  MediaQuery,
  ActionIcon,
  Group,
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
}));

export const MantineFooter = () => {
  const navigate = useNavigate();

  const { classes } = useStyles();

  return (
    <Footer p="md" className={classes.footer}>
      <Group position="center" spacing="xl" grow noWrap>
        <ActionIcon size="lg" radius="xs" onClick={() => navigate("/")}>
          <IconHome2 size="1.4rem" />
        </ActionIcon>
        <ActionIcon size="lg" radius="xs" onClick={() => navigate("/discover")}>
          <IconDeviceDesktopAnalytics size="1.4rem" />
        </ActionIcon>
        <ActionIcon size="lg" radius="xs" onClick={() => navigate("/profile")}>
          <IconUser size="1.4rem" />
        </ActionIcon>
        <ActionIcon size="lg" radius="xs" onClick={() => navigate("/wallet")}>
          <IconReceipt2 size="1.4rem" />
        </ActionIcon>
        <ActionIcon
          size="lg"
          radius="xs"
          onClick={() => navigate("/notifications")}
        >
          <IconBellRinging size="1.4rem" />
        </ActionIcon>
        <ActionIcon size="lg" radius="xs" onClick={() => navigate("/settings")}>
          <IconSettings size="1.4rem" />
        </ActionIcon>
      </Group>
    </Footer>
  );
};
