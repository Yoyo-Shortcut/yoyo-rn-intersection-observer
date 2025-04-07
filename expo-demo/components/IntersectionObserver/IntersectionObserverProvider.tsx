import React, { createContext, PropsWithChildren, useContext } from "react";
import {
  MeasuredDimensions,
  SharedValue,
  useSharedValue,
} from "react-native-reanimated";

export type ScrollViewKey = string | number;
export type ViewKey = string | number;

export type Signals = {
  onLayoutTimestamp: number; // timestamp in ms
  onScrollTimestamp: number; // timestamp in ms
  onScrollAnimationEndTimestamp: number; // timestamp in ms
  onScrollEndDragTimestamp: number; // timestamp in ms
  onMomentumScrollEndTimestamp: number; // timestamp in ms
};

export type MeasuredItem = MeasuredDimensions | null;

export type ViewableMap = {
  isFullyViewable: boolean;
  isPartiallyViewable: boolean;
};

export type IntersectionObserverContextType = {
  signals: SharedValue<Signals>;
  reportSignal: (key: keyof Signals) => void;

  scrollViewsMeasureMap: SharedValue<Record<ScrollViewKey, MeasuredItem>>;
  reportScrollViewMeasure: (key: ScrollViewKey, value: MeasuredItem) => void;

  viewsMeasureMap: SharedValue<Record<ViewKey, MeasuredItem>>;
  reportViewMeasure: (key: ViewKey, value: MeasuredItem) => void;

  viewableMap: SharedValue<Record<ViewKey, ViewableMap>>;
  reportViewable: (key: ViewKey, value: ViewableMap) => void;
};

const IntersectionObserverContext =
  createContext<IntersectionObserverContextType | null>(null);

export const IntersectionObserverProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  // === Artifacts

  const signals = useSharedValue<Signals>({
    onLayoutTimestamp: 0,
    onScrollTimestamp: 0,
    onScrollAnimationEndTimestamp: 0,
    onScrollEndDragTimestamp: 0,
    onMomentumScrollEndTimestamp: 0,
  });

  const reportSignal = (key: keyof Signals) => {
    "worklet";

    signals.value = {
      ...signals.value,
      [key]: Date.now(),
    };
  };

  const scrollViewsMeasureMap = useSharedValue<
    Record<ScrollViewKey, MeasuredItem>
  >({});

  const reportScrollViewMeasure = (key: ScrollViewKey, value: MeasuredItem) => {
    "worklet";

    scrollViewsMeasureMap.value = {
      ...scrollViewsMeasureMap.value,
      [key]: value,
    };
  };

  const viewsMeasureMap = useSharedValue<Record<ViewKey, MeasuredItem>>({});

  const reportViewMeasure = (key: ViewKey, value: MeasuredItem) => {
    "worklet";

    viewsMeasureMap.value = {
      ...viewsMeasureMap.value,
      [key]: value,
    };
  };

  const viewableMap = useSharedValue<Record<ViewKey, ViewableMap>>({});

  const reportViewable = (key: ViewKey, value: ViewableMap) => {
    "worklet";

    viewableMap.value = {
      ...viewableMap.value,
      [key]: value,
    };
  };

  // === Renderers

  return (
    <IntersectionObserverContext.Provider
      value={{
        signals: signals,
        reportSignal: reportSignal,

        scrollViewsMeasureMap: scrollViewsMeasureMap,
        reportScrollViewMeasure: reportScrollViewMeasure,

        viewsMeasureMap: viewsMeasureMap,
        reportViewMeasure: reportViewMeasure,

        viewableMap: viewableMap,
        reportViewable: reportViewable,
      }}
    >
      {children}
    </IntersectionObserverContext.Provider>
  );
};

export const useIntersectionObserver = () => {
  const context = useContext(IntersectionObserverContext);
  if (!context) {
    throw new Error(
      "useIntersectionObserver must be used within a IntersectionObserverProvider"
    );
  }
  return context;
};
