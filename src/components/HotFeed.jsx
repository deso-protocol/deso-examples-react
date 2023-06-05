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
  Loader,
} from "@mantine/core";
import {
  IconHeart,
  IconDiamond,
  IconRecycle,
  IconMessageCircle,
} from "@tabler/icons-react";
import { useNavigate } from "react-router";

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
  const navigate = useNavigate();
  useEffect(() => {
    const fetchHotFeed = async () => {
      try {
        const hotFeed = await getHotFeed({
          ResponseLimit: 30,
        });

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
        <Space h="md" />
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
                <ActionIcon
                  onClick={() => {
                    const state = {
                      userPublicKey: post.PosterPublicKeyBase58Check,
                      userName: post.ProfileEntryResponse.Username
                        ? post.ProfileEntryResponse.Username
                        : post.PosterPublicKeyBase58Check,
                      description: post.ProfileEntryResponse.Description
                        ? post.ProfileEntryResponse.Description
                        : null,
                      largeProfPic: post.ProfileEntryResponse.ExtraData
                        .LargeProfilePicURL
                        ? post.ProfileEntryResponse.ExtraData.LargeProfilePicURL
                        : null,
                      featureImage: post.ProfileEntryResponse.ExtraData
                        .FeaturedImageURL
                        ? post.ProfileEntryResponse.ExtraData.FeaturedImageURL
                        : null,
                    };

                    navigate(`/wave/${post.ProfileEntryResponse.Username}`, {
                      state,
                    });
                  }}
                  variant="transparent"
                >
                  {post.ProfileEntryResponse &&
                  post.ProfileEntryResponse.ExtraData?.LargeProfilePicURL ? (
                    <Avatar
                      radius="lg"
                      size="lg"
                      src={
                        post.ProfileEntryResponse.ExtraData?.LargeProfilePicURL
                      }
                    />
                  ) : (
                    <Avatar
                      radius="lg"
                      size="lg"
                      src={`https://node.deso.org/api/v0/get-single-profile-picture/${post.ProfileEntryResponse.PublicKeyBase58Check}`}
                    />
                  )}

                  <Space w="xs" />
                  <Text weight="bold" size="sm">
                    {post.ProfileEntryResponse.Username}
                  </Text>
                </ActionIcon>
              </Center>

              <TypographyStylesProvider>
                <Space h="sm" />
                <Text align="center" size="md" className={classes.body}>
                  {post.Body}
                </Text>
              </TypographyStylesProvider>

              <Space h="md" />

              {post.RepostedPostEntryResponse && (
                <Paper
                  m="md"
                  shadow="lg"
                  radius="md"
                  p="xl"
                  withBorder
                  key={post.RepostedPostEntryResponse.PostHashHex}
                  className={classes.comment}
                >
                  <Center>
                    <Avatar
                      radius="lg"
                      size="lg"
                      src={
                        post.RepostedPostEntryResponse?.ProfileEntryResponse
                          ?.ExtraData?.LargeProfilePicURL ||
                        `https://node.deso.org/api/v0/get-single-profile-picture/${post.RepostedPostEntryResponse?.ProfileEntryResponse?.PublicKeyBase58Check}`
                      }
                    />

                    <Space w="xs" />
                    <Text weight="bold" size="sm">
                      {
                        post.RepostedPostEntryResponse.ProfileEntryResponse
                          ?.Username
                      }
                    </Text>
                  </Center>
                  <TypographyStylesProvider>
                    <Space h="sm" />
                    <Text align="center" size="md" className={classes.body}>
                      {post.RepostedPostEntryResponse.Body}
                    </Text>
                  </TypographyStylesProvider>
                  <Space h="md" />
                  {post.RepostedPostEntryResponse.VideoURLs && (
                    <Group
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                      }}
                      position="center"
                    >
                      <iframe
                        style={{ width: "100%", height: "100%" }}
                        src={post.RepostedPostEntryResponse.VideoURLs}
                        title={post.RepostedPostEntryResponse.PostHashHex}
                      />
                    </Group>
                  )}
                  {post.RepostedPostEntryResponse.ImageURLs &&
                    post.RepostedPostEntryResponse.ImageURLs.length > 0 && (
                      <Group position="center">
                        <Image
                          src={post.RepostedPostEntryResponse.ImageURLs[0]}
                          radius="md"
                          alt="repost-image"
                          fit="contain"
                        />
                      </Group>
                    )}
                </Paper>
              )}

              {post.VideoURLs && (
                <Group
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  }}
                  position="center"
                >
                  <iframe
                    style={{ width: "100%", height: "100%" }}
                    src={post.VideoURLs}
                    title={post.PostHashHex}
                  />
                </Group>
              )}
              {post.ImageURLs && (
                <Group position="center">
                  <Image
                    src={post.ImageURLs[0]}
                    radius="md"
                    alt="post-image"
                    fit="contain"
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
          <Center>
            <Loader variant="bars" />
          </Center>
        )}
        <Space h={222} />
      </div>
    </>
  );
};
