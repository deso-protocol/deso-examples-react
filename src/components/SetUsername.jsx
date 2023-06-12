import { updateProfile, getSingleProfile } from "deso-protocol";
import { useContext, useState } from "react";
import {
  Paper,
  Group,
  Text,
  Space,
  Center,
  Badge,
  Button,
  TextInput,
} from "@mantine/core";
import { DeSoIdentityContext } from "react-deso-protocol";

export const SetUsername = () => {
  const { currentUser } = useContext(DeSoIdentityContext);
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
                setErrorMessage("Username cannot contain special characters");
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
          <Button disabled={isButtonDisabled} onClick={handleUpdateUsername}>
            Update
          </Button>
        </Group>
      </Paper>
    </>
  );
};
