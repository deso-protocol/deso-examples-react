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
  Loader,
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

      {stream?.isLoading && (
        <Group position="center">
          <Loader size="sm" />
        </Group>
      )}

      {stream?.isIdle && (
        <Group position="center">
          <p>Stream is idle.</p>
        </Group>
      )}

      {stream?.isError && (
        <Group position="center">
          <p>Error occurred while creating the stream.</p>
        </Group>
      )}

      <Space h="md" />
      {!stream && (
        <Group position="center">
          <Button
            radius="xl"
            disabled={status === "loading" || !createStream}
            onClick={() => createStream?.()}
          >
            Create Stream
          </Button>
        </Group>
      )}
    </Paper>
  );
};
