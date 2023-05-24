import {
  Avatar,
  Paper,
  Group,
  Text,
  ThemeIcon,
  Center,
  Divider,
  List,
} from "@mantine/core";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../contexts";
import { getNotifications } from "deso-protocol";
import { GiWaveSurfer } from "react-icons/gi";

export const NotificationsPage = () => {
  const { currentUser, isLoading } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const userPublicKey = currentUser?.PublicKeyBase58Check;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificationData = await getNotifications({
          PublicKeyBase58Check: userPublicKey,
          NumToFetch: 25,
          FetchStartIndex: -1,
        });
        console.log(notificationData.Notifications);
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
          <Center>
            <List listStyleType="none" spacing="sm">
              {notifications.map((notification, index) => (
                <List.Item key={index}>
                  <Paper radius="lg" shadow="lg" p="md" withBorder>
                    <Group>
                      <Avatar
                        radius="sm"
                        size="sm"
                        src={
                          `https://node.deso.org/api/v0/get-single-profile-picture/${notification.Metadata.TransactorPublicKeyBase58Check}` ||
                          null
                        }
                      />
                      <Text
                        variant="gradient"
                        gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                        fw={500}
                      >
                        {notification.Metadata.TxnType}
                      </Text>
                    </Group>
                  </Paper>
                </List.Item>
              ))}
            </List>
          </Center>
        </>
      ) : (
        <Center>
          <Paper shadow="xl" radius="lg" p="xl" withBorder>
            <Text
              size="xl"
              noBreak
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
