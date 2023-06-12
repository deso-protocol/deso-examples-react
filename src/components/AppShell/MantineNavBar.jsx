import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  createStyles,
  Navbar,
  getStylesRef,
  rem,
  Paper,
  Group,
  Avatar,
  Space,
  Text,
  Badge,
  Divider,
} from "@mantine/core";
import {
  IconBellRinging,
  IconUser,
  IconHome2,
  IconDeviceDesktopAnalytics,
  IconReceipt2,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { DeSoIdentityContext } from "react-deso-protocol";
import { getFollowersForUser, getIsFollowing } from "deso-protocol";
const useStyles = createStyles((theme) => ({
  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[7],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

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

const data = [
  { link: "/", label: "Home", icon: IconHome2 },
  { link: "/profile", label: "Profile", icon: IconUser },
  { link: "/discover", label: "Discover", icon: IconDeviceDesktopAnalytics },
  { link: "/notifications", label: "Notifications", icon: IconBellRinging },
];

export function MantineNavBar() {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState("Home");
  const navigate = useNavigate();
  const [opened] = useState(false);
  const [wavesSidebar, setWavesSidebar] = useState([]);
  const [followingWaves, setFollowingWaves] = useState([]);
  const { currentUser, isLoading } = useContext(DeSoIdentityContext);
  useEffect(() => {
    const fetchWavesSidebar = async () => {
      try {
        //Getting Profiles that are following the Waves_Streams Account
        const result = await getFollowersForUser({
          Username: "Waves_Streams",
          GetEntriesFollowingUsername: true,
          //Will have to increase as the followers increase
          NumToFetch: 20,
        });

        setWavesSidebar(Object.values(result.PublicKeyToProfileEntry));
      } catch (error) {
        console.log("Something went wrong:", error);
      }
    };

    fetchWavesSidebar();
  }, []);

  //Filter the posts that have non-empty WavesStreamPlaybackId and WavesStreamTitle to get livestreams
  //For the Recommended Waves section
  const filteredPosts = wavesSidebar.filter(
    (post) =>
      post.ExtraData?.WavesStreamPlaybackId &&
      post.ExtraData?.WavesStreamPlaybackId !== "" &&
      post.ExtraData?.WavesStreamTitle &&
      post.ExtraData?.WavesStreamTitle !== ""
  );

  // Check if the current user is following the profiles in filteredPosts
  const fetchFollowingPosts = async () => {
    const followingPosts = [];
    for (const post of filteredPosts) {
      const request = {
        PublicKeyBase58Check: currentUser.PublicKeyBase58Check,
        IsFollowingPublicKeyBase58Check: post.PublicKeyBase58Check,
      };
      const response = await getIsFollowing(request);
      if (response.IsFollowing === true) {
        followingPosts.push(post);
      }
    }
    setFollowingWaves(followingPosts);
  };

  // Fetch the followingPosts when the currentUser changes
  useEffect(() => {
    if (currentUser) {
      fetchFollowingPosts();
    }
  }, [currentUser]);

  const links = data.map((item) => (
    <Link
      to={item.link}
      className={cx(classes.link, {
        [classes.linkActive]: item.label === active,
      })}
      key={item.label}
      onClick={() => setActive(item.label)}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 200, lg: 300 }}
    >
      <Text size="xs" weight={500} color="dimmed">
        Follower Waves
      </Text>
      {currentUser ? (
        followingWaves.length > 0 ? (
          followingWaves.map((post) => (
            <div key={post.PublicKeyBase58Check}>
              <Navbar.Section
                className={cx(classes.link, {
                  [classes.linkActive]: post === active,
                })}
                onClick={() => {
                  const state = {
                    userPublicKey: post.PublicKeyBase58Check,
                    userName: post.Username || post.PublicKeyBase58Check,
                    description: post.Description || null,
                    largeProfPic: post.ExtraData?.LargeProfilePicURL || null,
                    featureImage: post.ExtraData?.FeaturedImageURL || null,
                  };

                  navigate(`/wave/${post.Username}`, {
                    state,
                  });

                  setActive(post);
                }}
              >
                <Group className={classes.linkIcon}>
                  <Avatar
                    radius="xl"
                    size="sm"
                    src={
                      post.ExtraData?.LargeProfilePicURL ||
                      `https://node.deso.org/api/v0/get-single-profile-picture/${post.PublicKeyBase58Check}` ||
                      null
                    }
                  />

                  <span>
                    <Text fz="xs" fw={500} lineClamp={1}>
                      {post.Username}
                    </Text>
                  </span>
                </Group>
              </Navbar.Section>
            </div>
          ))
        ) : (
          <Text fz="xs" fw={500} lineClamp={2}>
            None of your followers are live.
          </Text>
        )
      ) : (
        <Text fz="xs" fw={500} lineClamp={2}>
          Login to view your followers livestreams.
        </Text>
      )}

      <Divider my="sm" />
      <Text size="xs" weight={500} color="dimmed">
        Recommended Waves
      </Text>
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <Navbar.Section
            className={cx(classes.link, {
              [classes.linkActive]: post === active,
            })}
            onClick={() => {
              const state = {
                userPublicKey: post.PublicKeyBase58Check,
                userName: post.Username || post.PublicKeyBase58Check,
                description: post.Description || null,
                largeProfPic: post.ExtraData?.LargeProfilePicURL || null,
                featureImage: post.ExtraData?.FeaturedImageURL || null,
              };

              navigate(`/wave/${post.Username}`, {
                state,
              });

              setActive(post);
            }}
          >
            <Group className={classes.linkIcon}>
              <Avatar
                radius="xl"
                size="sm"
                src={
                  post.ExtraData?.LargeProfilePicURL ||
                  `https://node.deso.org/api/v0/get-single-profile-picture/${post.PublicKeyBase58Check}` ||
                  null
                }
              />

              <span>
                <Text fz="xs" fw={500} lineClamp={1}>
                  {post.Username}
                </Text>
              </span>
            </Group>
          </Navbar.Section>
        ))
      ) : (
        <Navbar.Section>
          <Text fz="xs" fw={500} lineClamp={1}>
            No Waves Right Now.
          </Text>
        </Navbar.Section>
      )}
      <Divider my="sm" />
      <Navbar.Section grow>{links}</Navbar.Section>
    </Navbar>
  );
}
