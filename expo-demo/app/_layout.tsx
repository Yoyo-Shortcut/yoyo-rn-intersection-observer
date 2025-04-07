import { IntersectionObserverProvider } from "@/components/IntersectionObserver/IntersectionObserverProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <IntersectionObserverProvider>
      <Stack />
    </IntersectionObserverProvider>
  );
}
