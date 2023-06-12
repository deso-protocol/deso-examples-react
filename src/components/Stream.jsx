import { Player, useCreateStream, useUpdateStream } from "@livepeer/react";
import { useMemo, useState, useContext, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  updateProfile,
  getIsFollowing,
  updateFollowingStatus,
} from "deso-protocol";
import {
  Paper,
  Textarea,
  Group,
  Button,
  Space,
  Center,
  CopyButton,
  ActionIcon,
  Tooltip,
  Card,
  Badge,
  Loader,
  Text,
} from "@mantine/core";
import { IconCopy, IconCheck } from "@tabler/icons-react";

import { DeSoIdentityContext } from "react-deso-protocol";

export const Stream = () => {
  const { currentUser } = useContext(DeSoIdentityContext);
  const [streamName, setStreamName] = useState("");
  const [isFollowingWaves, setisFollowingWaves] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [disable, { toggle }] = useDisclosure(false);

  // Allowing user to create streams via livepeers useCreateStream hook
  const {
    mutate: createStream,
    data: stream,
    status,
  } = useCreateStream(streamName ? { name: streamName } : null);

  const isLoading = useMemo(() => status === "loading", [status]);

  const streamId = stream?.id;

  //Allowing user to stop streaming via livepeers useUpdateStream hook to change suspend to true
  const { mutate: updateStream } = useUpdateStream({
    streamId,
    suspend: true,
  });

  const handleEndStream = async () => {
    updateStream?.();
    setStreamName("");
    try {
      await updateProfile({
        UpdaterPublicKeyBase58Check: currentUser.PublicKeyBase58Check,
        ProfilePublicKeyBase58Check: "",
        NewUsername: "",
        MinFeeRateNanosPerKB: 1000,
        NewCreatorBasisPoints: 100,
        NewDescription: "",
        NewStakeMultipleBasisPoints: 12500,
        ExtraData: {
          WavesStreamPlaybackId: "",
          WavesStreamTitle: "",
        },
      });
    } catch (error) {
      console.log("something happened: " + error);
    }
  };

  //On the instance where a user clicks off their profile while streaming or the 'end wave' doesnt work
  //Users can clear the playbackid and title
  const clearWave = async () => {
    try {
      await updateProfile({
        UpdaterPublicKeyBase58Check: currentUser.PublicKeyBase58Check,
        ProfilePublicKeyBase58Check: "",
        NewUsername: "",
        MinFeeRateNanosPerKB: 1000,
        NewCreatorBasisPoints: 100,
        NewDescription: "",
        NewStakeMultipleBasisPoints: 12500,
        ExtraData: {
          WavesStreamPlaybackId: "",
          WavesStreamTitle: "",
        },
      });
    } catch (error) {
      console.log("something happened: " + error);
    }
  };

  useEffect(() => {
    const isFollowingPublicKey = async () => {
      try {
        const result = await getIsFollowing({
          PublicKeyBase58Check: currentUser?.PublicKeyBase58Check,
          IsFollowingPublicKeyBase58Check:
            "BC1YLfjx3jKZeoShqr2r3QttepoYmvJGEs7vbYx1WYoNmNW9FY5VUu6",
        });
        console.log("Is Following:", result.IsFollowing);
        setisFollowingWaves(result.IsFollowing);
      } catch (error) {
        console.log("Something went wrong:", error);
      }
    };

    isFollowingPublicKey();
  }, [currentUser]);

  const attachStreamToDesoProfile = async () => {
    try {
      setIsButtonDisabled(true);

      if (isFollowingWaves === false) {
        await updateFollowingStatus({
          MinFeeRateNanosPerKB: 1000,
          IsUnfollow: false,
          FollowedPublicKeyBase58Check:
            "BC1YLfjx3jKZeoShqr2r3QttepoYmvJGEs7vbYx1WYoNmNW9FY5VUu6",
          FollowerPublicKeyBase58Check: currentUser.PublicKeyBase58Check,
        });
      }
      await updateProfile({
        UpdaterPublicKeyBase58Check: currentUser.PublicKeyBase58Check,
        ProfilePublicKeyBase58Check: "",
        NewUsername: "",
        MinFeeRateNanosPerKB: 1000,
        NewCreatorBasisPoints: 100,
        NewDescription: "",
        NewStakeMultipleBasisPoints: 12500,
        ExtraData: {
          WavesStreamPlaybackId: stream?.playbackId,
          WavesStreamTitle: stream?.name,
        },
      });
    } catch (error) {
      console.log("something happened: " + error);
      setIsButtonDisabled(false);
    }
  };

  return (
    <Paper shadow="sm" p="lg" withBorder>
      <>
        <Tooltip label="Clear Idle Wave from your profile">
          <Button size="xs" color="red" radius="xl" onClick={clearWave}>
            Clear Wave
          </Button>
        </Tooltip>
        <Space h="md" />
        <Center>
          <Text fz="lg" fw={777} c="dimmed" truncate>
            Start Streaming
          </Text>
        </Center>
        <Space h="md" />
        <Textarea
          placeholder="Enter Stream Title"
          variant="filled"
          radius="md"
          disabled={disable}
          onChange={(e) => setStreamName(e.target.value)}
        />
        <Space h="xl" />
      </>

      {status === "success" && (
        <>
          {streamName ? (
            <>
              <Center>
                <Card shadow="sm" p="lg" radius="md" withBorder>
                  <Button
                    disabled={isButtonDisabled}
                    onClick={attachStreamToDesoProfile}
                  >
                    Launch Wave to DeSo Profile
                  </Button>

                  <Group position="center">
                    <h4>Stream Server:</h4>
                    <CopyButton
                      value="rtmp://rtmp.livepeer.com/live"
                      timeout={2000}
                    >
                      {({ copied, copy }) => (
                        <Tooltip
                          position="top"
                          label={copied ? "Copied" : "Stream Server"}
                          withArrow
                        >
                          <ActionIcon
                            color={copied ? "teal" : "gray"}
                            onClick={copy}
                          >
                            {copied ? (
                              <IconCheck size={16} />
                            ) : (
                              <IconCopy size={16} />
                            )}
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </CopyButton>
                  </Group>

                  <Group position="center">
                    <h4>Stream Key:</h4>
                    <CopyButton value={stream.streamKey} timeout={2000}>
                      {({ copied, copy }) => (
                        <Tooltip
                          position="top"
                          label={copied ? "Copied" : "Stream Key"}
                          withArrow
                        >
                          <ActionIcon
                            color={copied ? "teal" : "gray"}
                            onClick={copy}
                          >
                            {copied ? (
                              <IconCheck size={16} />
                            ) : (
                              <IconCopy size={16} />
                            )}
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </CopyButton>
                  </Group>
                  <Space h="md" />
                  <Group position="center">
                    <Badge radius="sm" size="xl">
                      {streamName}
                    </Badge>
                  </Group>
                  <Space h="md" />
                </Card>
                <Space h="xl" />
              </Center>
              <Space h="md" />
              <Group position="center">
                <Player
                  title={stream?.name}
                  playbackId={stream?.playbackId}
                  autoPlay
                  muted
                />
              </Group>

              <Space h="md" />
              <Group position="center">
                <Button
                  fullWidth
                  color="red"
                  radius="xl"
                  onClick={handleEndStream}
                >
                  End Wave
                </Button>
              </Group>
            </>
          ) : (
            <Group position="center">
              <p>Wave suspended. Refresh to create a new Wave.</p>
            </Group>
          )}
        </>
      )}

      {status === "loading" && (
        <Group position="center">
          <Loader size="sm" />
        </Group>
      )}

      {status === "error" && (
        <Group position="center">
          <p>Error occurred while creating your wave.</p>
        </Group>
      )}

      <Space h="md" />
      {!stream && (
        <Group position="center">
          <Button
            radius="xl"
            onClick={() => {
              toggle();

              createStream?.(); // Create the stream and store the result
            }}
            disabled={isLoading || !createStream}
          >
            Create Wave
          </Button>
        </Group>
      )}
    </Paper>
  );
};
