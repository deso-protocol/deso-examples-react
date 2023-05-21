import { ERROR_TYPES, identity, submitPost, getHotFeed } from "deso-protocol";
import { useContext, useRef, useEffect } from "react";
import { UserContext } from "../contexts";
import { IconCheck } from "@tabler/icons-react";
import {
  Button,
  Center,
  Space,
  Paper,
  Text,
  Textarea,
  Group,
  Loader,
  Notification,
  createStyles,
  Avatar,
} from "@mantine/core";
import { getDisplayName } from "../helpers";
export const SignAndSubmitTx = () => {
  const { currentUser, isLoading } = useContext(UserContext);
  const formRef = useRef(null);

  const userPublicKey = currentUser.PublicKeyBase58Check;
  console.log(currentUser);

  if (isLoading) {
    return (
      <Center>
        <Loader variant="bars" />
      </Center>
    );
  }

  if (!currentUser || !currentUser.BalanceNanos) {
    return (
      <Center>
        <Button
          radius="xl"
          onClick={() => {
            identity
              .login({
                getFreeDeso: true,
              })
              .catch((err) => {
                if (err?.type === ERROR_TYPES.NO_MONEY) {
                  alert("You need DESO in order to post!");
                } else {
                  alert(err);
                }
              });
          }}
        >
          Login to Create
        </Button>
      </Center>
    );
  } else {
    return (
      <>
        <Paper m="md" shadow="lg" radius="sm" p="xl" withBorder>
          <form
            ref={formRef}
            onSubmit={async (e) => {
              e.preventDefault();
              const form = formRef.current;

              // check if the user can make a post
              if (
                !identity.hasPermissions({
                  TransactionCountLimitMap: {
                    SUBMIT_POST: 1,
                  },
                })
              ) {
                // if the user doesn't have permissions, request them
                // and abort the submit
                identity.requestPermissions({
                  GlobalDESOLimit: 10000000, // 0.01 DESO
                  TransactionCountLimitMap: {
                    SUBMIT_POST: 3,
                  },
                });
                return;
              }

              const body = form.elements.body.value;

              await submitPost({
                UpdaterPublicKeyBase58Check: currentUser.PublicKeyBase58Check,
                BodyObj: {
                  Body: body,
                  ImageURLs: [],
                  VideoURLs: [],
                },
              }).then((resp) => {
                console.log(resp);
                alert("Post submitted!");
                <Notification
                  icon={<IconCheck size="1.1rem" />}
                  color="teal"
                  title="Teal notification"
                >
                  This is teal notification with icon
                </Notification>;
              });

              // Reset the form after submission
              form.reset();
            }}
          >
            <Text fz="lg" fw={1000} inherit variant="gradient" component="span">
              {getDisplayName(currentUser)}
            </Text>
            <Space h="sm" />
            <Textarea
              name="body"
              radius="md"
              autosize
              placeholder="Let them hear your voice!"
              variant="filled"
              size="md"
            />
            <Space h="sm" />
            <Group postion="apart">
              <Button
                variant="gradient"
                gradient={{ from: "cyan", to: "indigo" }}
                raduis="sm"
                type="submit"
              >
                Create
              </Button>
            </Group>
          </form>
        </Paper>
      </>
    );
  }
};
