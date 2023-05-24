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
} from "@mantine/core";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../contexts";
import { getSingleProfile, getFollowersForUser } from "deso-protocol";
import { Stream } from "../components/Stream";
import { getDisplayName } from "../helpers";

export const Profile = () => {
  const { currentUser, isLoading } = useContext(UserContext);
  const [profile, setProfile] = useState([]);
  const [followerInfo, setFollowers] = useState({ followers: 0, following: 0 });
  const userPublicKey = currentUser?.PublicKeyBase58Check;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getSingleProfile({
          PublicKeyBase58Check: userPublicKey,
        });
        const following = await getFollowersForUser({
          PublicKeyBase58Check: userPublicKey,
        });
        const followers = await getFollowersForUser({
          PublicKeyBase58Check: userPublicKey,
          GetEntriesFollowingUsername: true,
        });
        console.log(profileData);
        setFollowers({ following, followers });
        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser, userPublicKey]);

  return (
    <>
      {currentUser ? (
        <>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <Image
                src={profile?.Profile?.ExtraData?.FeaturedImageURL || null}
                height={160}
                withPlaceholder
              />
            </Card.Section>
            <Space h="sm" />
            <Center>
              <Avatar
                size="lg"
                radius="lg"
                src={`https://node.deso.org/api/v0/get-single-profile-picture/${currentUser?.PublicKeyBase58Check}`}
                alt="Profile Picture"
              />
            </Center>
            <Center>
              <Text fz="lg" fw={777} variant="gradient" truncate>
                {getDisplayName(currentUser)}
              </Text>
            </Center>
            <Space h="md" />
            <Group>
              <Text fz="sm">
                {profile?.Profile?.Description && profile?.Profile?.Description}
              </Text>
            </Group>
            <Space h="sm" />
            <Center>
              <Text fz="sm">
                {followerInfo.followers &&
                  `Followers: ${followerInfo.followers.NumFollowers}`}
              </Text>
              <Space w="sm" />
              <Divider size="sm" orientation="vertical" />
              <Space w="sm" />
              <Text fz="sm">
                {followerInfo.following &&
                  `Following: ${followerInfo.following.NumFollowers}`}
              </Text>
            </Center>
          </Card>
          <Space h={77} />
          <Divider
            my="xs"
            label={
              <>
                <Text fw={444} fz="xl">
                  Go Live
                </Text>
              </>
            }
            labelPosition="center"
          />
          <Space h="md" />
          <Stream />
        </>
      ) : (
        <>
          <Divider
            my="xs"
            label={
              <>
                <Text fw={444} fz="xl">
                  Profile
                </Text>
              </>
            }
            labelPosition="center"
          />
          <Space h="xl" />
          <Center>
            <Paper shadow="xl" radius="lg" p="xl" withBorder>
              <Text
                size="xl"
                noBreak
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan", deg: 45 }}
              >
                Please login to view your Profile.
              </Text>
            </Paper>
          </Center>
        </>
      )}
    </>
  );
};
