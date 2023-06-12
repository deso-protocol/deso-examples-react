import { getFollowersForUser } from "deso-protocol";
import { useEffect, useState } from "react";
import { Player } from "@livepeer/react";
import {
  Text,
  Avatar,
  Group,
  Badge,
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
import { useNavigate } from "react-router";

const useStyles = createStyles((theme) => ({
  comment: {
    padding: `${theme.spacing.lg}px ${theme.spacing.xl}px`,
  },

  
}));
//Waves Tab Feed Component thats displays all current livestreams
export const WavesFeed = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [wavesFeed, setWavesFeed] = useState([]);
  
useEffect(() => {
    const fetchWavesFeed = async () => {
      try {
          
        //Getting Profiles that are following the Waves_Streams Account
        const result = await getFollowersForUser({
          Username: "Waves_Streams",
          GetEntriesFollowingUsername: true, 
          //Will have to increase as the followers increase
          NumToFetch: 20,
        });
       
        
        setWavesFeed(Object.values(result.PublicKeyToProfileEntry))
      } catch (error) {
        console.log("Something went wrong:", error);
      }
    };

    fetchWavesFeed();
  }, []);
  
  // Filter the posts that have non-empty WavesStreamPlaybackId and WavesStreamTitle
  const filteredPosts = wavesFeed.filter(
    (post) =>
      post.ExtraData?.WavesStreamPlaybackId &&
      post.ExtraData?.WavesStreamPlaybackId !== "" &&
      post.ExtraData?.WavesStreamTitle &&
      post.ExtraData?.WavesStreamTitle !== ""
  );

//Map through the filteredPosts to display the current livestreams 
   // Render the filtered posts or the "No Waves" message
  return (
    <div>
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <>
            <Paper
              m="md"
              shadow="lg"
              radius="md"
              p="xl"
              withBorder
              key={post.PublicKeyBase58Check}
              className={classes.comment}
            >
              <Center>
                <ActionIcon
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
                  }}
                  variant="transparent"
                >
                  <Avatar
                    radius="xl"
                    size="lg"
                    src={
                      post.ExtraData?.LargeProfilePicURL ||
                      `https://node.deso.org/api/v0/get-single-profile-picture/${post.PublicKeyBase58Check}` ||
                      null
                    }
                  />
                  <Space w="xs" />
                  <Text weight="bold" size="sm">
                    {post.Username}
                  </Text>
                </ActionIcon>
              </Center>
              <Space h="xl" />
              <Player
                playbackId={post.ExtraData.WavesStreamPlaybackId}
                title={post.ExtraData.WavesStreamTitle}
                automute
              />
            </Paper>
          </>
        ))
      ) : (
        <Center>
              
        <Badge
                  size="md"
                  radius="sm"
                  variant="gradient"
                  gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                >
            No Waves Right Now.
         
        </Badge>
        <Space h={222} />
            </Center>
      )}
    </div>
  );
};
