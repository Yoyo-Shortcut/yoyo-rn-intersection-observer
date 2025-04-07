import { IntersectionObserverProvider } from "@/components/IntersectionObserver/IntersectionObserverProvider";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <IntersectionObserverProvider>
        <Stack />
      </IntersectionObserverProvider>
    </GestureHandlerRootView>
  );
}
