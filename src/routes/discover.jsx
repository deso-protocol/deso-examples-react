import { Space, Center, Paper, Text, Divider, Badge } from "@mantine/core";
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
      <Space h="xl" />
      <Center>
        
          <Badge
             size="md"
               radius="sm"
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan", deg: 45 }}
          >
            Coming soon
          </Badge>
      
      </Center>
      <Space h={222} />
    </>
  );
};
