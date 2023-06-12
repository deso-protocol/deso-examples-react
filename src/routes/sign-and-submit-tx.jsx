import {
  updateProfile,
  identity,
  submitPost,
  getSingleProfile,
} from "deso-protocol";
import { useContext, useRef, useState } from "react";

import {
  Button,
  Center,
  Space,
  Paper,
  Text,
  Textarea,
  Group,
  Loader,
  Avatar,
  Container,
  Tooltip,
  Badge,
  TextInput,
} from "@mantine/core";
import { getDisplayName } from "../helpers";
import { DeSoIdentityContext } from "react-deso-protocol";
import { Welcome } from "../components/Welcome";
import { SetUsername } from "../components/SetUsername";

export const SignAndSubmitTx = () => {
  const { currentUser, isLoading } = useContext(DeSoIdentityContext);
  const [newUsername, setNewUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const handleUpdateUsername = async () => {
    try {
      await updateProfile({
        UpdaterPublicKeyBase58Check: currentUser.PublicKeyBase58Check,
        ProfilePublicKeyBase58Check: "",
        NewUsername: newUsername,
        MinFeeRateNanosPerKB: 1000,
        NewCreatorBasisPoints: 100,
        NewDescription: "",
        NewStakeMultipleBasisPoints: 12500,
      });
    } catch (error) {
      console.log("something happened: " + error);
    }

    window.location.reload();
  };
  console.log(currentUser);

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
      <>
        <Container size="30rem" px={0}>
          <Paper m="md" shadow="lg" radius="sm" p="xl" withBorder>
            <Group>
              <Avatar size="md" radius="xl" alt="Profile Picture" />
              <Text fz="lg" fw={777} variant="gradient" truncate></Text>
            </Group>
            <Space h="sm" />
            <Textarea
              disabled
              name="body"
              radius="md"
              autosize
              placeholder="Login or Sign Up to Create!"
              variant="filled"
              size="md"
            />
            <Space h="sm" />
            <Group postion="apart">
              <Tooltip label="Login or Sign Up to Create!">
                <Button
                  raduis="sm"
                  data-disabled
                  sx={{ "&[data-disabled]": { pointerEvents: "all" } }}
                  onClick={(event) => event.preventDefault()}
                >
                  Create
                </Button>
              </Tooltip>
            </Group>
          </Paper>
        </Container>
        <Space h="md" />
        <Welcome />
      </>
    );
  } else {
    if (currentUser.ProfileEntryResponse === null) {
      return (
        <>
          <Paper m="md" shadow="lg" radius="sm" p="xl" withBorder>
            <Center>
              <Badge
                size="md"
                radius="sm"
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan", deg: 45 }}
              >
                Enter Username
              </Badge>

              <Space h="xs" />
            </Center>
            <Group position="center" grow>
              <TextInput
                type="text"
                label="Username"
                value={newUsername}
                placeholder="New username"
                onChange={async (e) => {
                  setNewUsername(e.target.value);
                  e.preventDefault();

                  let regex = /^[a-zA-Z0-9_]*$/;
                  if (!regex.test(e.target.value)) {
                    setErrorMessage(
                      "Username cannot contain special characters"
                    );
                    setIsButtonDisabled(true);
                  } else {
                    setErrorMessage("");

                    try {
                      const request = {
                        PublicKeyBase58Check: "",
                        Username: e.target.value,
                        NoErrorOnMissing: true,
                      };

                      try {
                        const userFound = await getSingleProfile(request);

                        if (userFound === null) {
                          setErrorMessage("");
                          setIsButtonDisabled(false);
                        } else {
                          setErrorMessage("Username is not available");
                          setIsButtonDisabled(true);
                        }
                      } catch (error) {
                        setIsButtonDisabled(true);
                        setErrorMessage("");
                      }
                    } catch (error) {
                      console.log(error);
                    }
                  }
                }}
                error={errorMessage}
              />
            </Group>

            <Space h="sm" />

            <Group position="right">
              <Button
                disabled={isButtonDisabled}
                onClick={handleUpdateUsername}
              >
                Update
              </Button>
            </Group>
          </Paper>
        </>
      );
    } else {
      return (
        <>
          <Container size="30rem" px={0}>
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
                    UpdaterPublicKeyBase58Check:
                      currentUser.PublicKeyBase58Check,
                    BodyObj: {
                      Body: body,
                      ImageURLs: [],
                      VideoURLs: [],
                    },
                  }).then((resp) => {
                    alert("Post submitted!");
                  });

                  // Reset the form after submission
                  form.reset();
                }}
              >
                <Group>
                  <Avatar
                    size="lg"
                    radius="xl"
                    src={`https://node.deso.org/api/v0/get-single-profile-picture/${currentUser?.PublicKeyBase58Check}`}
                    alt="Profile Picture"
                  />
                  <Text fz="lg" fw={777} variant="gradient" truncate>
                    {getDisplayName(currentUser)}
                  </Text>
                </Group>
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
          </Container>
        </>
      );
    }
  }
};
