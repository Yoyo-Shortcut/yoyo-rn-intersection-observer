import React, { PropsWithChildren } from "react";
import { View, ViewProps } from "react-native";
import {
  MeasuredItem,
  ScrollViewKey,
  useIntersectionObserver,
  ViewableMap,
  ViewKey,
} from "./IntersectionObserverProvider";
import {
  measure,
  useAnimatedReaction,
  useAnimatedRef,
} from "react-native-reanimated";
import {
  isFloatLargerEqualWorklet,
  isFloatSmallerEqualWorklet,
} from "@/utils/floats/compare";

export const ViewObserver: React.FC<
  PropsWithChildren &
    ViewProps & {
      viewKey: ViewKey;
      scrollViewKey: ScrollViewKey;
      epsilon?: number;
    }
> = ({ children, viewKey, scrollViewKey, epsilon: propsEpsilon, ...rest }) => {
  // === Artifacts

  // NOTE:
  // The `epsilon` value is used to determine the threshold for considering two floating-point numbers as equal.
  // This is important in scenarios where floating-point precision errors can occur, such as in measuring positions on a screen.
  // You can play and console.log measures out to see what epsilon value works best for your use case.
  const epsilon = propsEpsilon ?? 0.2;

  const { signals, scrollViewsMeasureMap, reportViewMeasure, reportViewable } =
    useIntersectionObserver();
  const ref = useAnimatedRef<View>();

  const checkViewable = (viewMeasure: MeasuredItem) => {
    "worklet";

    const scrollViewMeasure = scrollViewsMeasureMap.value[scrollViewKey];

    if (!scrollViewMeasure || !viewMeasure) {
      return;
    }

    const { height: scrollViewHeight, pageY: scrollViewPageY } =
      scrollViewMeasure;

    const { height: viewHeight, pageY: viewPageY } = viewMeasure;

    const isTopAboveScrollView = viewPageY < scrollViewPageY;

    const isTopInScrollView =
      //
      isFloatLargerEqualWorklet(viewPageY, scrollViewPageY, epsilon) &&
      //
      isFloatSmallerEqualWorklet(
        viewPageY,
        scrollViewPageY + scrollViewHeight,
        epsilon
      );

    const isBottomInScrollView =
      //
      isFloatLargerEqualWorklet(
        viewPageY + viewHeight,
        scrollViewPageY,
        epsilon
      ) &&
      //
      isFloatSmallerEqualWorklet(
        viewPageY + viewHeight,
        scrollViewPageY + scrollViewHeight,
        epsilon
      );

    const isBottomBelowScrollView =
      viewPageY + viewHeight > scrollViewPageY + scrollViewHeight;

    const result: ViewableMap = {
      isFullyViewable: isTopInScrollView && isBottomInScrollView,
      isPartiallyViewable:
        (isTopInScrollView && isBottomInScrollView) ||
        (isTopAboveScrollView && isBottomBelowScrollView) ||
        (isTopAboveScrollView && isBottomInScrollView) ||
        (isTopInScrollView && isBottomBelowScrollView),
    };

    reportViewable(viewKey, result);
  };

  const measureView = () => {
    "worklet";

    const viewMeasure = measure(ref);
    reportViewMeasure(viewKey, viewMeasure);
    checkViewable(viewMeasure);
  };

  // === Effects

  useAnimatedReaction(
    () => {
      "worklet";

      return signals.value;
    },
    (current, prev) => {
      "worklet";

      if (current.onLayoutTimestamp !== prev?.onLayoutTimestamp) {
        measureView();
      }

      if (current.onScrollTimestamp !== prev?.onScrollTimestamp) {
        measureView();
      }

      if (
        current.onScrollAnimationEndTimestamp !==
        prev?.onScrollAnimationEndTimestamp
      ) {
        measureView();
      }

      if (current.onScrollEndDragTimestamp !== prev?.onScrollEndDragTimestamp) {
        measureView();
      }

      if (
        current.onMomentumScrollEndTimestamp !==
        prev?.onMomentumScrollEndTimestamp
      ) {
        measureView();
      }
    }
  );

  // === Renderers

  return (
    <View {...rest} ref={ref}>
      {children}
    </View>
  );
};
