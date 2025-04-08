import { ViewKey } from "@/components/IntersectionObserver/IntersectionObserverProvider";
import { ScrollViewObserver } from "@/components/IntersectionObserver/ScrollViewObserver";
import { ViewObserver } from "@/components/IntersectionObserver/ViewObserver";
import { TestItem } from "@/components/TestItem";
import { useMemo } from "react";

export default function Index() {
  // === Artifacts

  const scrollViewKey = "index-scroll-view";

  const viewKeys = useMemo<ViewKey[]>(() => {
    const result = new Array(200).fill(0);

    for (let i = 0; i < result.length; i++) {
      result[i] = `index-view-${i}`;
    }

    return result;
  }, []);

  // === Renderers

  return (
    <ScrollViewObserver
      scrollViewKey={scrollViewKey}
      contentContainerStyle={{ gap: 10 }}
    >
      {viewKeys.map((viewKey) => (
        <ViewObserver
          key={viewKey}
          viewKey={viewKey}
          scrollViewKey={scrollViewKey}
          style={{
            alignItems: "center",
          }}
        >
          <TestItem viewKey={viewKey} />
        </ViewObserver>
      ))}
    </ScrollViewObserver>
  );
}
