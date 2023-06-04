import { Player, useCreateStream, useUpdateStream } from "@livepeer/react";
import { useMemo, useState, useContext } from "react";
import { useDisclosure } from "@mantine/hooks";
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
} from "@mantine/core";
import { IconCopy, IconCheck } from "@tabler/icons-react";
import { updateProfile } from "deso-protocol";
import { DeSoIdentityContext } from "react-deso-protocol";

export const Stream = () => {
  const { currentUser } = useContext(DeSoIdentityContext);
  const [streamName, setStreamName] = useState("");
  const [disable, { toggle }] = useDisclosure(false);
  const {
    mutate: createStream,
    data: stream,
    status,
  } = useCreateStream(streamName ? { name: streamName } : null);

  const isLoading = useMemo(() => status === "loading", [status]);

  const streamId = stream?.id;
  const { mutate: updateStream } = useUpdateStream({
    streamId,
    suspend: true,
  });

  const handleEndStream = () => {
    updateStream?.();
    setStreamName("");
  };

  const handleCreateStream = () => {
    createStream?.();
    toggle();

    const request = {
      UpdaterPublicKeyBase58Check: currentUser.PublicKeyBase58Check,
      MinFeeRateNanosPerKB: 1000,
      NewCreatorBasisPoints: 100,
      NewStakeMultipleBasisPoints: 12500,
      ExtraData: {
        WavesPlaybackId: stream.playbackId,
        WavesStreamName: stream.name,
      },
    };

    try {
      const response = updateProfile(request);
      console.log(response);
    } catch (error) {
      console.log(error);
    }

    console.log(currentUser);
  };

  return (
    <Paper shadow="sm" p="lg" withBorder>
      <>
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
                  <Group position="center">
                    <h4 lineClamp={1}>Stream Server:</h4>
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
                <Button radius="xl" onClick={handleEndStream}>
                  End Stream
                </Button>
              </Group>
            </>
          ) : (
            <Group position="center">
              <p>Stream suspended. Refresh to create a new stream.</p>
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
          <p>Error occurred while creating the stream.</p>
        </Group>
      )}

      <Space h="md" />
      {!stream && (
        <Group position="center">
          <Button radius="xl" onClick={handleCreateStream}>
            Create Stream
          </Button>
        </Group>
      )}
    </Paper>
  );
};
