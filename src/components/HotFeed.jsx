import { getHotFeed } from "deso-protocol";
import { useEffect, useState } from "react";
import {
  Text,
  Avatar,
  Group,
  createStyles,
  Paper,
  TypographyStylesProvider,
  Center,
  Space,
  ActionIcon,
  Tooltip,
  Image,
} from "@mantine/core";
import {
  IconHeart,
  IconDiamond,
  IconRecycle,
  IconMessageCircle,
} from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  comment: {
    padding: `${theme.spacing.lg}px ${theme.spacing.xl}px`,
  },

  body: {
    paddingTop: theme.spacing.sm,
    fontSize: theme.fontSizes.sm,
    wordWrap: "break-word",
  },

  content: {
    "& > p:last-child": {
      marginBottom: 0,
    },
  },
}));

export const HotFeed = () => {
  const { classes } = useStyles();
  const [hotFeed, setHotFeed] = useState([]);

  useEffect(() => {
    const fetchHotFeed = async () => {
      try {
        const hotFeed = await getHotFeed({
          ResponseLimit: 30,
        });
        console.log(hotFeed.HotFeedPage);
        setHotFeed(hotFeed.HotFeedPage);
      } catch (error) {
        console.error("Error fetching user hotFeed:", error);
      }
    };

    fetchHotFeed();
  }, []);
  return (
    <>
      <div>
        {hotFeed && hotFeed.length > 0 ? (
          hotFeed.map((post) => (
            <Paper
              m="md"
              shadow="lg"
              radius="md"
              p="xl"
              withBorder
              key={post.PostHashHex}
              className={classes.comment}
            >
              <Center>
                {post.ProfileEntryResponse?.ExtraData?.LargeProfilePicURL ? (
                  <Avatar
                    size={44}
                    radius={33}
                    src={post.ProfileEntryResponse.ExtraData.LargeProfilePicURL}
                  />
                ) : (
                  <Avatar size={44} radius={33} />
                )}

                <Space w="xs" />
                <Text weight="bold" size="sm">
                  {post.ProfileEntryResponse.Username}
                </Text>
              </Center>

              <TypographyStylesProvider>
                <Space h="sm" />
                <Text align="center" size="md" className={classes.body}>
                  {post.Body}
                </Text>
              </TypographyStylesProvider>

              <Space h="md" />

              {post.ImageURLs && (
                <Group position="center">
                  <Image
                    src={post.ImageURLs[0]}
                    radius="md"
                    alt="post-image"
                    width={311}
                  />
                </Group>
              )}

              <Space h="md" />

              <Center>
                <Tooltip
                  transition="slide-down"
                  withArrow
                  position="bottom"
                  label="Like"
                  transitionDuration={11}
                >
                  <ActionIcon variant="subtle" radius="md" size={36}>
                    <IconHeart size={18} stroke={1.5} />
                  </ActionIcon>
                </Tooltip>
                <Text size="xs" color="dimmed">
                  {post.LikeCount}
                </Text>

                <Space w="sm" />

                <Tooltip
                  transition="slide-down"
                  withArrow
                  position="bottom"
                  label="Repost"
                  transitionDuration={11}
                >
                  <ActionIcon variant="subtle" radius="md" size={36}>
                    <IconRecycle size={18} stroke={1.5} />
                  </ActionIcon>
                </Tooltip>
                <Text size="xs" color="dimmed">
                  {post.RepostCount}
                </Text>

                <Space w="sm" />

                <Tooltip
                  transition="slide-down"
                  withArrow
                  position="bottom"
                  label="Diamonds"
                  transitionDuration={11}
                >
                  <ActionIcon variant="subtle" radius="md" size={36}>
                    <IconDiamond size={18} stroke={1.5} />
                  </ActionIcon>
                </Tooltip>
                <Text size="xs" color="dimmed">
                  {post.DiamondCount}
                </Text>

                <Space w="sm" />

                <Tooltip
                  transition="slide-down"
                  withArrow
                  position="bottom"
                  label="Comments"
                  transitionDuration={11}
                >
                  <ActionIcon variant="subtle" radius="md" size={36}>
                    <IconMessageCircle size={18} stroke={1.5} />
                  </ActionIcon>
                </Tooltip>
                <Text size="xs" color="dimmed">
                  {post.CommentCount}
                </Text>
              </Center>
            </Paper>
          ))
        ) : (
          <div>Loading hot feed...</div>
        )}
      </div>
    </>
  );
};
