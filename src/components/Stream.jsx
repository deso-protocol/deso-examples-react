import { Player, useCreateStream, useEndStream } from "@livepeer/react";
import { useMemo, useState, useEffect, useContext } from "react";
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
} from "@mantine/core";
import { IconCopy, IconCheck } from "@tabler/icons-react";
import { updateProfile } from "deso-protocol";
import { DeSoIdentityContext } from "react-deso-protocol";

export const Stream = () => {
  const { currentUser } = useContext(DeSoIdentityContext);
  const [streamName, setStreamName] = useState("");
  
  const {
    mutate: createStream,
    data: stream,
    status,
  } = useCreateStream(streamName ? { name: streamName } : null);

  useEffect(() => {
    if (stream?.playbackId && stream?.name) {
      updateProfile({
        UpdaterPublicKeyBase58Check: currentUser.PublicKeyBase58Check,
        ProfilePublicKeyBase58Check: "",
        NewUsername: currentUser,
        MinFeeRateNanosPerKB: 1000,
        NewCreatorBasisPoints: 100,
        NewStakeMultipleBasisPoints: 12500,
        ExtraData: {
          WavesStreamId: stream.playbackId,
          WavesStreamTitle: stream.name,
        },
      });
    }
  }, [stream, currentUser]);

  const isLoading = useMemo(() => status === "loading", [status]);

  

  return (
    <Paper shadow="sm" p="lg" withBorder>
      <Textarea
        placeholder="Enter Stream Title"
        variant="filled"
        radius="md"
        onChange={(e) => setStreamName(e.target.value)}
      />
      <Space h="xl" />
      {stream &&
        stream.rtmpIngestUrl &&
        (!stream?.playbackUrl || !stream.isActive) && (
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

              <Group position="center">
                <Badge radius="sm" size="xl">
                  {streamName}
                </Badge>
              </Group>
              <Space h="md" />
            </Card>
          </Center>
        )}
      <Space h="xl" />
      {stream?.playbackId && (
        <Group position="center">
          <Player
            title={stream?.name}
            playbackId={stream?.playbackId}
            autoPlay
            muted
          />
        </Group>
      )}

      <Space h="md" />
      {!stream && (
        <Group position="center">
          <Button
            radius="xl"
            onClick={() => {
              createStream?.();
              
            }}
            disabled={isLoading || !createStream}
          >
            {isLoading}
            Create Stream
          </Button>
        </Group>
      )}
    </Paper>
  );
};
