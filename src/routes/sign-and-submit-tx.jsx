import { ERROR_TYPES, identity, submitPost } from "deso-protocol";
import { useContext, useRef } from "react";
import { UserContext } from "../contexts";
import { IconCheck } from "@tabler/icons-react";
import {
  Button,
  Center,
  Space,
  Paper,
  Textarea,
  Group,
  Loader,
  Notification,
} from "@mantine/core";

export const SignAndSubmitTx = () => {
  const { currentUser, isLoading } = useContext(UserContext);
  const formRef = useRef(null);

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
        <Paper m="md" shadow="lg" radius="xl" p="xl" withBorder>
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
            <Textarea
              name="body"
              radius="xl"
              autosize
              placeholder="Let them hear your voice!"
              variant="filled"
              size="md"
            />
            <Space h="sm" />
            <Group align="right">
              <Button type="submit" radius="xl">
                Create
              </Button>
            </Group>
          </form>
        </Paper>
      </>
    );
  }
};
