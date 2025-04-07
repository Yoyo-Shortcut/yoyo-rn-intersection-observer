import React, { PropsWithChildren, useRef } from "react";
import { measure, runOnUI, useAnimatedRef } from "react-native-reanimated";
import {
  ScrollViewKey,
  Signals,
  useIntersectionObserver,
} from "./IntersectionObserverProvider";
import { ScrollView } from "react-native-gesture-handler";
import { ScrollViewProps } from "react-native";
import { useDebouncedCallback } from "@/utils/delayCallback/useDebouncedCallback";

export const ScrollViewObserver: React.FC<
  PropsWithChildren &
    ScrollViewProps & { scrollViewKey: ScrollViewKey; debounceMs?: number }
> = ({ children, scrollViewKey, debounceMs: propsDebounceMs, ...rest }) => {
  // === Artifacts

  const debounceMs = propsDebounceMs ?? 100;

  const { reportSignal, reportScrollViewMeasure } = useIntersectionObserver();
  const ref = useAnimatedRef<ScrollView>();
  const manualScrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const measureScrollView = useDebouncedCallback((key: keyof Signals) => {
    runOnUI(() => {
      "worklet";

      const scrollViewMeasure = measure(ref);
      reportScrollViewMeasure(scrollViewKey, scrollViewMeasure);
      reportSignal(key);
    })();
  }, debounceMs);

  // === Renderers

  return (
    <ScrollView
      {...rest}
      ref={ref}
      onLayout={() => {
        measureScrollView("onLayoutTimestamp");
      }}
      onScroll={() => {
        // For all scrolling and web scrolling
        measureScrollView("onScrollTimestamp");
      }}
      scrollEventThrottle={50}
      onScrollAnimationEnd={() => {
        // For programmatic scrolling
        measureScrollView("onScrollAnimationEndTimestamp");
      }}
      onScrollEndDrag={() => {
        // For user manually scrolls and forces stop
        manualScrollTimeout.current = setTimeout(() => {
          measureScrollView("onScrollEndDragTimestamp");
        }, 200);
      }}
      onMomentumScrollBegin={() => {
        // For user scrolls and lets glide (BEGIN)
        if (manualScrollTimeout.current) {
          clearTimeout(manualScrollTimeout.current);
        }
      }}
      onMomentumScrollEnd={() => {
        // For user scrolls and lets glide (END)
        measureScrollView("onMomentumScrollEndTimestamp");
      }}
    >
      {children}
    </ScrollView>
  );
};
