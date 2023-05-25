import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  IconHeart,
  IconDiamond,
  IconRecycle,
  IconMessageCircle,
} from "@tabler/icons-react";
import {
  getFollowersForUser,
  getPostsForUser,
  getNFTsForUser,
} from "deso-protocol";
import {
  Avatar,
  Paper,
  Group,
  Text,
  Card,
  Space,
  Center,
  Divider,
  Image,
  Tabs,
  TypographyStylesProvider,
  createStyles,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { Player } from "@livepeer/react";

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
export const Wave = () => {
  const { classes } = useStyles();
  const location = useLocation();
  const { userPublicKey, userName, description, largeProfPic, featureImage } =
    location.state;
  const [posts, setPosts] = useState([]);
  const [NFTs, setNFTs] = useState([]);
  const [followerInfo, setFollowers] = useState({ followers: 0, following: 0 });
  const [activeTab, setActiveTab] = useState("first");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const following = await getFollowersForUser({
          PublicKeyBase58Check: userPublicKey,
        });
        const followers = await getFollowersForUser({
          PublicKeyBase58Check: userPublicKey,
          GetEntriesFollowingUsername: true,
        });
        const postData = await getPostsForUser({
          PublicKeyBase58Check: userPublicKey,
          NumToFetch: 25,
        });
        const nftData = await getNFTsForUser({
          UserPublicKeyBase58Check: userPublicKey,
        });

        setNFTs(nftData.NFTsMap);
        setPosts(postData.Posts);
        setFollowers({ following, followers });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchProfile();
  }, []);
  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          <Image src={featureImage} height={160} withPlaceholder />
        </Card.Section>
        <Space h="sm" />
        <Center>
          <Avatar
            size="lg"
            radius="lg"
            src={
              `https://node.deso.org/api/v0/get-single-profile-picture/${userPublicKey}` || {
                largeProfPic,
              }
            }
            alt="Profile Picture"
          />
        </Center>
        <Center>
          <Text fz="lg" fw={777} variant="gradient" truncate>
            {userName}
          </Text>
        </Center>
        <Space h="md" />
        <Paper shadow="xl" radius="md" p="xl">
          <Text
            fz="sm"
            style={{
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "wrap",
            }}
          >
            {description}
          </Text>
        </Paper>
        <Space h="sm" />
        <Center>
          {followerInfo.followers && followerInfo.followers.NumFollowers ? (
            <Text fz="sm">
              Followers: {followerInfo.followers.NumFollowers}
            </Text>
          ) : (
            <Text fz="sm">Followers: 0</Text>
          )}

          <Space w="sm" />
          <Divider size="sm" orientation="vertical" />
          <Space w="sm" />
          {followerInfo.following && followerInfo.following.NumFollowers ? (
            <Text fz="sm">
              Following: {followerInfo.following.NumFollowers}
            </Text>
          ) : (
            <Text fz="sm">Following: 0</Text>
          )}
        </Center>
      </Card>
      <Space h="xl" />

      <Tabs
        variant="pills"
        radius="sm"
        value={activeTab}
        onTabChange={setActiveTab}
      >
        <Tabs.List grow position="center">
          <Tabs.Tab value="first">
            <Text fz="sm">{userName}'s Wave</Text>
          </Tabs.Tab>

          <Tabs.Tab value="second">
            <Text fz="sm">Posts</Text>
          </Tabs.Tab>

          <Tabs.Tab value="third">
            <Text fz="sm">NFTs</Text>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="first">
          <Center>
            <Space h="md" />
            <Paper shadow="xl" radius="lg" p="xl" withBorder>
              <Text
                size="md"
                lineClamp={1}
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan", deg: 45 }}
              >
                Coming Soon
              </Text>
            </Paper>
            <Space h={222} />
          </Center>
        </Tabs.Panel>
        <Tabs.Panel value="second">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <Paper
                m="md"
                shadow="lg"
                radius="md"
                p="xl"
                withBorder
                key={index}
                className={classes.comment}
              >
                <Center>
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
                      src={`https://node.deso.org/api/v0/get-single-profile-picture/${userPublicKey}`}
                    />
                  )}

                  <Space w="xs" />
                  <Text weight="bold" size="sm">
                    {userName}
                  </Text>
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
                  <Group position="center">
                    <Player src={post.VideoURLs} />
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
              <Space h="md" />
              <Paper shadow="xl" radius="lg" p="xl" withBorder>
                <Text
                  size="md"
                  lineClamp={1}
                  variant="gradient"
                  gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                >
                  Post something to view them here!
                </Text>
              </Paper>
              <Space h={222} />
            </Center>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="third">
          {Object.keys(NFTs).length > 0 ? (
            Object.keys(NFTs).map((key, index) => {
              const nft = NFTs[key];
              return (
                <Paper
                  m="md"
                  shadow="lg"
                  radius="md"
                  p="xl"
                  withBorder
                  key={index}
                  className={classes.comment}
                >
                  <Center>
                    <Avatar
                      size="lg"
                      radius="lg"
                      src={
                        `https://node.deso.org/api/v0/get-single-profile-picture/${userPublicKey}` ||
                        null
                      }
                      alt="Profile Picture"
                    />
                    <Space w="xs" />
                    <Text weight="bold" size="sm">
                      {userName}
                    </Text>
                  </Center>
                  <Space h="sm" />
                  <TypographyStylesProvider>
                    <Text align="center" size="md" className={classes.body}>
                      {nft.PostEntryResponse.Body}
                    </Text>
                  </TypographyStylesProvider>
                  <Space h="md" />
                  {nft.PostEntryResponse.VideoURLs && (
                    <Group position="center">
                      <Player src={nft.VideoURLs} />
                    </Group>
                  )}
                  {nft.PostEntryResponse.ImageURLs && (
                    <Group position="center">
                      <Image
                        src={nft.PostEntryResponse.ImageURLs[0]}
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
                      {nft.PostEntryResponse.LikeCount}
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
                      {nft.PostEntryResponse.RepostCount}
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
                      {nft.PostEntryResponse.DiamondCount}
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
                      {nft.PostEntryResponse.CommentCount}
                    </Text>
                  </Center>
                </Paper>
              );
            })
          ) : (
            <Center>
              <Space h="md" />
              <Paper shadow="xl" radius="lg" p="xl" withBorder>
                <Text
                  size="md"
                  lineClamp={1}
                  variant="gradient"
                  gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                >
                  Mint/Buy some NFTs to view them here!
                </Text>
              </Paper>
              <Space h={222} />
            </Center>
          )}
        </Tabs.Panel>
      </Tabs>
    </>
  );
};
