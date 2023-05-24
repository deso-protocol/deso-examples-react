import { Space, Center, Paper, Text, Divider } from "@mantine/core";
export const Discover = () => {
  return (
    <>
      <Divider
        my="xs"
        label={
          <>
            <Text fw={444} fz="xl">
              Discover
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
            lineClamp={4}
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