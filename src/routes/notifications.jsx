import {
  Avatar,
  Paper,
  Group,
  Text,
  Space,
  Center,
  Divider,
} from "@mantine/core";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../contexts";
import { getNotifications } from "deso-protocol";
export const NotificationsPage = () => {
  const { currentUser, isLoading } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const userPublicKey = currentUser?.PublicKeyBase58Check;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificationData = await getNotifications({
          PublicKeyBase58Check: userPublicKey,
          NumToFetch: 50,
          FetchStartIndex: -1,
        });

        setNotifications(notificationData.Notifications);
      } catch (error) {
        console.error("Error fetching user hotFeed:", error);
      }
    };

    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser, userPublicKey]);

  return (
    <div>
      <Divider
        my="xs"
        label={
          <>
            <Text fw={444} fz="xl">
              Notifications
            </Text>
          </>
        }
        labelPosition="center"
      />

      {currentUser ? (
        <>
          {notifications.map((notification, index) => (
            <div key={index}>
              <Space h="sm" />
              <Center>
                <Paper shadow="lg" p="md" withBorder>
                  <Group>
                    <Text>{notification.Metadata.TxnType}</Text>
                  </Group>
                </Paper>
              </Center>
              <Space h="sm" />
            </div>
          ))}
        </>
      ) : (
        <Center>
          <Paper shadow="xl" radius="lg" p="xl" withBorder>
            <Text
              size="xl"
              lineClamp={4}
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan", deg: 45 }}
            >
              Please login to view your Notifications.
            </Text>
          </Paper>
        </Center>
      )}
    </div>
  );
};
