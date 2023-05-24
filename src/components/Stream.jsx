import {
  Player,
  useCreateStream,
  useUpdateStream,
  TimeDisplay,
} from "@livepeer/react";
import { useMemo, useState, useCallback } from "react";
import {
  Text,
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

export const Stream = () => {
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
              <Group>
                <h4>Stream Server:</h4>
                <Text>rtmp://rtmp.livepeer.com/live</Text>

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
                <Badge size="xl">{streamName}</Badge>
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