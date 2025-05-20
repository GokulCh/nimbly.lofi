import { AuthProvider } from "./auth/AuthProvider";
import { BackgroundProvider } from "./background/BackgroundProvider";
import { NotificationsProvider } from "./notifications/NotificationsProvider";
import { SettingsProvider } from "./settings/SettingsProvider";
import { StorageProvider } from "./storage/StorageProvider";
import { ThemeProvider } from "./theme/ThemeProvider";
import { UserProvider } from "./user/UserProvider";

export default function CoreProvider({ children }) {
  return (
    <AuthProvider>
      <UserProvider>
        <StorageProvider>
          <SettingsProvider>
            <ThemeProvider>
              <BackgroundProvider>
                <NotificationsProvider>{children}</NotificationsProvider>
              </BackgroundProvider>
            </ThemeProvider>
          </SettingsProvider>
        </StorageProvider>
      </UserProvider>
    </AuthProvider>
  );
}
