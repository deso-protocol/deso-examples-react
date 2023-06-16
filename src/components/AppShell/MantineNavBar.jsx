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
  Center,
  Tooltip,
  Divider,
  Collapse,
  Button,
  ActionIcon,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBellRinging,
  IconUser,
  IconHome2,
  IconDeviceDesktopAnalytics,
  IconReceipt2,
} from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";
import { DeSoIdentityContext } from "react-deso-protocol";
import { getFollowersForUser, getIsFollowing } from "deso-protocol";
import { RiArrowRightSFill, RiArrowLeftSFill } from "react-icons/ri";
import { RxDotFilled } from "react-icons/rx";
const useStyles = createStyles((theme) => ({
  wrapper: {
    display: "flex",
  },

  aside: {
    flex: `0 0 ${rem(60)}`,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRight: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
  },

  main: {
    flex: 1,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
  },

  mainLink: {
    width: rem(44),
    height: rem(44),
    borderRadius: theme.radius.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
    },
  },

  mainLinkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },

  title: {
    boxSizing: "border-box",
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    marginBottom: theme.spacing.xl,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    padding: theme.spacing.md,
    paddingTop: rem(18),
    height: rem(60),
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
  },

  link: {
    display: "flex",

    justifyContent: "center",

    textDecoration: "none",
    borderTopRightRadius: theme.radius.md,
    borderBottomRightRadius: theme.radius.md,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    fontSize: theme.fontSizes.sm,

    fontWeight: 500,
    height: rem(44),
    lineHeight: rem(44),

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  linkActive: {
    "&, &:hover": {
      borderLeftColor: theme.fn.variant({
        variant: "filled",
        color: theme.primaryColor,
      }).background,
      backgroundColor: theme.fn.variant({
        variant: "filled",
        color: theme.primaryColor,
      }).background,
      color: theme.white,
    },
  },

  innerNavBar: {
    marginLeft: "77px",
    display: "flex",
  },

  streamsWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
}));

const mainLinksMockdata = [
  { link: "/", label: "Home", icon: IconHome2 },
  { link: "/profile", label: "Profile", icon: IconUser },
  { link: "/discover", label: "Discover", icon: IconDeviceDesktopAnalytics },
  { link: "/notifications", label: "Notifications", icon: IconBellRinging },
  { link: "/wallet", label: "Wallet", icon: IconReceipt2 },
];

export function MantineNavBar() {
  const { classes, cx } = useStyles();
  const location = useLocation();
  const [active, setActive] = useState(() => {
    const currentPage = mainLinksMockdata.find(
      (item) => item.link === location.pathname
    );
    return currentPage ? currentPage.label : "Home";
  });

  const navigate = useNavigate();
  const [open] = useState(false);
  const [wavesSidebar, setWavesSidebar] = useState([]);
  const [followingWaves, setFollowingWaves] = useState([]);
  const { currentUser, isLoading } = useContext(DeSoIdentityContext);
  const [opened, { toggle }] = useDisclosure(true);
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

  const links = mainLinksMockdata.map((link) => (
    <>
      <Tooltip
        label={link.label}
        position="right"
        withArrow
        transitionProps={{ duration: 0 }}
        key={link.label}
      >
        <UnstyledButton
          onClick={() => setActive(link.label)}
          to={link.link}
          component={Link}
          className={cx(classes.mainLink, {
            [classes.mainLinkActive]: link.label === active,
          })}
        >
          <link.icon size="1.4rem" stroke={1.5} />
        </UnstyledButton>
      </Tooltip>
      <Space h="xs" />
    </>
  ));

  return (
    <>
      <Navbar
        p="md"
        hiddenBreakpoint="sm"
        hidden={!open}
        width={{ sm: 77, lg: 77 }}
      >
        <Group position="center">
          <ActionIcon onClick={toggle}>
            {opened ? <RiArrowLeftSFill /> : <RiArrowRightSFill />}
          </ActionIcon>
        </Group>
        <Space h="xs" />
        <Divider my="sm" />
        <Space h="xs" />

        <Center>
          <div className={classes.aside}>{links}</div>
        </Center>
      </Navbar>

      <Collapse in={opened} style={{ float: "right", zIndex: 10 }}>
        <Navbar
          hiddenBreakpoint="sm"
          hidden={!open}
          width={{ sm: 233, lg: 233 }}
          className={classes.innerNavBar}
        >
          <Space h="lg" />
          <Navbar.Section grow>
            <Center>
              <Text size="xs" weight={500} color="dimmed">
                Following Waves
              </Text>
            </Center>
            <Space h="sm" />
            {currentUser ? (
              followingWaves && followingWaves.length > 0 ? (
                followingWaves.map((post) => {
                  if (
                    post.PublicKeyBase58Check ===
                    currentUser.PublicKeyBase58Check
                  ) {
                    return (
                      <Center>
                        <Text fz="xs" fw={500} lineClamp={2}>
                          No Livestreams found.
                        </Text>
                      </Center>
                    ); // Exclude current user from the list
                  }

                  return (
                    <Center>
                      <div key={post.PublicKeyBase58Check}>
                        <Navbar.Section
                          className={cx(classes.link, {
                            [classes.mainLinkActive]: post === active,
                          })}
                          onClick={() => {
                            const state = {
                              userPublicKey: post.PublicKeyBase58Check,
                              userName:
                                post.Username || post.PublicKeyBase58Check,
                              description: post.Description || null,
                              largeProfPic:
                                post.ExtraData?.LargeProfilePicURL || null,
                              featureImage:
                                post.ExtraData?.FeaturedImageURL || null,
                            };

                            navigate(`/wave/${post.Username}`, {
                              state,
                            });

                            setActive(post);
                          }}
                        >
                          <Group style={{ flex: 1 }} noWrap>
                            <Space w={1} />
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
                              <Text fz="xs" fw={500} truncate lineClamp={1}>
                                {post.Username}
                              </Text>
                            </span>
                          </Group>
                        </Navbar.Section>
                      </div>
                    </Center>
                  );
                })
              ) : (
                <Center>
                  <Text fz="xs" fw={500} lineClamp={2}>
                    No Livestreams found.
                  </Text>
                </Center>
              )
            ) : (
              <Center>
                <Text fz="xs" fw={500} lineClamp={2}>
                  Login to view your followings' Waves.
                </Text>
              </Center>
            )}

            <Divider my="sm" />
            <Center>
              <Text size="xs" weight={500} color="dimmed">
                Recommended Waves
              </Text>
            </Center>
            <Space h="sm" />
            {filteredPosts && filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <Navbar.Section
                  className={cx(classes.link, {
                    [classes.mainLinkActive]: post === active,
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
                  <Group noWrap style={{ display: "flex" }}>
                    <Space w={1} />
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
                    <Space w="lg" />
                    <Group postition="right">
                      <RxDotFilled size={22} color="red" />{" "}
                    </Group>
                  </Group>
                </Navbar.Section>
              ))
            ) : (
              <Navbar.Section>
                <Center>
                  <Text fz="xs" fw={500} lineClamp={1}>
                    No Waves Right Now.
                  </Text>
                </Center>
              </Navbar.Section>
            )}
          </Navbar.Section>
        </Navbar>
      </Collapse>
    </>
  );
}
