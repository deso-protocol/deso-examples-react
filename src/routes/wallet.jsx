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
      <Space h="xl" />
      <div>
        <iframe
          width="100%"
          style={{
            border: "none",
            margin: "0px",
            padding: "0px",
            display: "flex",
            overflow: "hidden",
            borderRadius: "22px",
            boxSizing: "border-box",
            height: "auto",
            minHeight: "100vh",
          }}
          src="https://heroswap.com/widget?affiliateAddress=BC1YLfjx3jKZeoShqr2r3QttepoYmvJGEs7vbYx1WYoNmNW9FY5VUu6"
        />
      </div>
      <Space h={222} />
    </>
  );
};
