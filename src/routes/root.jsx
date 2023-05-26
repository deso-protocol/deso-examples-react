import { configure } from "deso-protocol";
import { DeSoIdentityContext } from "react-deso-protocol";
import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { MantineAppShell } from "../components/AppShell/AppShell";
import { Loader, Center } from "@mantine/core";

configure({
  spendingLimitOptions: {
    GlobalDESOLimit: 10000000, // 0.01 DESO
    TransactionCountLimitMap: {
      SUBMIT_POST: "UNLIMITED",
      UPDATE_PROFILE: "UNLIMITED",
    },
  },

  appName: "Your Mom's House.",
});

export const Root = () => {
  const { isLoading } = useContext(DeSoIdentityContext);

  return (
    <MantineAppShell>
      <div role="main" className="main-content">
        {isLoading ? (
          <Center>
            <Loader variant="bars" />
          </Center>
        ) : (
          <Outlet />
        )}
      </div>
    </MantineAppShell>
  );
};
