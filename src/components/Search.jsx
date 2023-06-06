import { ActionIcon, Modal, Button, TextInput, Space } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { getSingleProfile } from "deso-protocol";
import { useNavigate } from "react-router";

export const Search = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [value, setValue] = useState("");
  const [userNotFound, setuserNotFound] = useState("");
  const navigate = useNavigate();

  const SearchUser = async () => {
    const request = {
      Username: value,
      NoErrorOnMissing: true,
    };

    const response = await getSingleProfile(request);
    console.log(response);

    if (response === null) {
      setuserNotFound("User not found");
      return;
    }

    const state = {
      userPublicKey: response.Profile.PublicKeyBase58Check,
      userName: response.Profile.Username
        ? response.Profile.Username
        : response.Profile.PublicKeyBase58Check,
      description: response.Profile.Description
        ? response.Profile.Description
        : null,
      largeProfPic: response.Profile.ExtraData.LargeProfilePicURL
        ? response.Profile.ExtraData.LargeProfilePicURL
        : null,
      featureImage: response.Profile.ExtraData.FeaturedImageURL
        ? response.Profile.ExtraData.FeaturedImageURL
        : null,
    };

    close();

    navigate(`/wave/${response.Profile.Username}`, {
      state,
    });
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Search User">
        <TextInput
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          icon={<IconSearch size="0.8rem" />}
          placeholder="Enter Username or Public Key"
          variant="filled"
          error={userNotFound ? userNotFound : null}
          withAsterisk
        />

        <Space h="sm" />
        <Button
          onClick={() => {
            SearchUser();
          }}
          variant="light"
          color="blue"
          radius="xl"
          size="xs"
        >
          Search
        </Button>
      </Modal>

      <ActionIcon onClick={open} color="blue" size="lg" variant="light">
        <IconSearch size="1.3rem" />
      </ActionIcon>
    </>
  );
};
