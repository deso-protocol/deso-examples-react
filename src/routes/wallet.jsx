import { Space, Center, Paper, Text, Divider } from "@mantine/core";
export const Wallet = () => {
  return (
    <>
      <Divider
        my="xs"
        label={
          <>
            <Text fw={444} fz="xl">
              Wallet
            </Text>
          </>
        }
        labelPosition="center"
      />
      <Space h={222} />
      <Center>
        <Paper shadow="xl" radius="lg" p="xl" withBorder>
          <Text
            size="xl"
            noBreak
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan", deg: 45 }}
          >
            Coming soon
          </Text>
        </Paper>
      </Center>
      <Space h={222} />
    </>
  );
};
