import { useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Player } from "@livepeer/react";
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
  getSingleProfile,
  updateFollowingStatus,
  getIsFollowing,
  identity,
} from "deso-protocol";
import {
  Avatar,
  Paper,
  Group,
  Text,
  Card,
  Space,
  rem,
  Menu,
  Center,
  Divider,
  Image,
  Tabs,
  Badge,
  TypographyStylesProvider,
  createStyles,
  ActionIcon,
  Tooltip,
  Button,
} from "@mantine/core";
import { DeSoIdentityContext } from "react-deso-protocol";
import { RiUserUnfollowLine } from "react-icons/ri";
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

  menuControl: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    border: 0,
    borderLeft: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white
    }`,
  },

  button: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
}));

export const Wave = () => {
  const { classes } = useStyles();
  const location = useLocation();
  const { userPublicKey, userName, description, largeProfPic, featureImage } =
    location.state;
  const [posts, setPosts] = useState([]);
  const [NFTs, setNFTs] = useState([]);
  const [profile, setProfile] = useState([]);
  const [followerInfo, setFollowers] = useState({ followers: 0, following: 0 });
  const [activeTab, setActiveTab] = useState("first");
  const { currentUser } = useContext(DeSoIdentityContext);
  const [isFollowingUser, setisFollowingUser] = useState(false);

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
        const profileData = await getSingleProfile({
          Username: userName,
        });

        setProfile(profileData.Profile);
        setNFTs(nftData.NFTsMap);
        setPosts(postData.Posts);
        setFollowers({ following, followers });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchProfile();
  }, [userPublicKey]);

  useEffect(() => {
    if (currentUser) {
      const getIsFollowingData = async () => {
        try {
          const result = await getIsFollowing({
            PublicKeyBase58Check: currentUser.PublicKeyBase58Check,
            IsFollowingPublicKeyBase58Check: userPublicKey,
          });
          console.log("Is Following:", result.IsFollowing);
          setisFollowingUser(result.IsFollowing);
        } catch (error) {
          console.error("Error checking if following:", error);
        }
      };

      getIsFollowingData();
    }
  }, [currentUser, isFollowingUser]);

  const getIsFollowingData = async () => {
    try {
      const result = await getIsFollowing({
        PublicKeyBase58Check: currentUser.PublicKeyBase58Check,
        IsFollowingPublicKeyBase58Check: userPublicKey,
      });
      console.log("Is Following:", result.IsFollowing);
      setisFollowingUser(result.IsFollowing);
    } catch (error) {
      console.error("Error checking if following:", error);
    }
  };

  const followUser = async () => {
    await updateFollowingStatus({
      MinFeeRateNanosPerKB: 1000,
      IsUnfollow: false,
      FollowedPublicKeyBase58Check: userPublicKey,
      FollowerPublicKeyBase58Check: currentUser.PublicKeyBase58Check,
    });
    getIsFollowingData();
  };

  const unfollowUser = async () => {
    await updateFollowingStatus({
      MinFeeRateNanosPerKB: 1000,
      IsUnfollow: true,
      FollowedPublicKeyBase58Check: userPublicKey,
      FollowerPublicKeyBase58Check: currentUser.PublicKeyBase58Check,
    });
    getIsFollowingData();
  };

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
            radius="xl"
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
            {userName}'s Wave
          </Text>
        </Center>

        <Space h="md" />
        <Card.Section>
          {profile &&
          profile.ExtraData &&
          profile.ExtraData.WavesStreamPlaybackId &&
          profile.ExtraData.WavesStreamTitle ? (
            <Player
              playbackId={profile.ExtraData?.WavesStreamPlaybackId}
              title={profile.ExtraData?.WavesStreamTitle}
              autoPlay
              muted
            />
          ) : (
            <Divider
              my="xs"
              label={
                <>
                  <Badge
                    size="md"
                    radius="sm"
                    variant="gradient"
                    gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                  >
                    Not live right now
                  </Badge>
                </>
              }
              labelPosition="center"
            />
          )}
        </Card.Section>
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
        <Space h="md" />
        <Space h="md" />
        {currentUser ? (
          isFollowingUser ? (
            <Group noWrap spacing={0}>
              <Button
                fullWidth
                variant="gradient"
                gradient={{ from: "cyan", to: "indigo" }}
                className={classes.button}
              >
                Following
              </Button>
              <Tooltip
                label="Unfollow User"
                color="gray"
                withArrow
                arrowPosition="center"
              >
                <ActionIcon
                  variant="filled"
                  color="indigo"
                  size={36}
                  className={classes.menuControl}
                  onClick={unfollowUser}
                >
                  <RiUserUnfollowLine size="1rem" stroke={1.5} />
                </ActionIcon>
              </Tooltip>
            </Group>
          ) : (
            <Button
              fullWidth
              variant="gradient"
              gradient={{ from: "cyan", to: "indigo" }}
              radius="md"
              onClick={followUser}
            >
              Follow
            </Button>
          )
        ) : (
          <Button
            fullWidth
            variant="gradient"
            gradient={{ from: "cyan", to: "indigo" }}
            radius="md"
            onClick={() => identity.login()}
          >
            Login to Follow
          </Button>
        )}
      </Card>

      <Space h="xl" />

      <Tabs radius="sm" value={activeTab} onTabChange={setActiveTab}>
        <Tabs.List grow position="center">
          <Tabs.Tab value="first">
            <Text fz="sm">Posts</Text>
          </Tabs.Tab>

          <Tabs.Tab value="second">
            <Text fz="sm">NFTs</Text>
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="first">
          {posts && posts.length > 0 ? (
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
                      radius="xl"
                      size="lg"
                      src={
                        post.ProfileEntryResponse.ExtraData?.LargeProfilePicURL
                      }
                    />
                  ) : (
                    <Avatar
                      radius="xl"
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
                        radius="xl"
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
                      title={post.PostHashHex}
                      src={post.VideoURLs}
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
              <Space h="md" />

              <Badge
                size="md"
                radius="sm"
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan", deg: 45 }}
              >
                Post something to view them here!
              </Badge>

              <Space h={222} />
            </Center>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="second">
          {NFTs && Object.keys(NFTs).length > 0 ? (
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
                      radius="xl"
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
                        src={nft.VideoURLs}
                        title={nft.PostHashHex}
                      />
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

              <Badge
                size="md"
                radius="sm"
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan", deg: 45 }}
              >
                Mint/Buy some NFTs to view them here!
              </Badge>

              <Space h={222} />
            </Center>
          )}
        </Tabs.Panel>
      </Tabs>
    </>
  );
};
