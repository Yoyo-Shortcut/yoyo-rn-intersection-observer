import { View, Text } from "react-native";
import {
  useIntersectionObserver,
  ViewKey,
} from "./IntersectionObserver/IntersectionObserverProvider";
import React from "react";
import { runOnJS, useAnimatedReaction } from "react-native-reanimated";

export const TestItem: React.FC<{ viewKey: ViewKey }> = ({ viewKey }) => {
  // === Artifacts

  const { viewableMap } = useIntersectionObserver();
  const [isFullyViewable, setIsFullyViewable] = React.useState(false);

  // === Effects

  useAnimatedReaction(
    () => {
      "worklet";
      return viewableMap.value[viewKey]?.isFullyViewable ?? false;
    },
    (current) => {
      "worklet";
      runOnJS(setIsFullyViewable)(current);
    }
  );

  // === Renderers

  return (
    <View
      style={{
        width: 150,
        height: 150,
        padding: 10,

        justifyContent: "center",
        alignItems: "center",

        backgroundColor: isFullyViewable ? "green" : "red",
      }}
    >
      <Text
        selectable={true}
        style={{
          fontSize: 20,
          color: "white",
        }}
      >
        {viewKey}
      </Text>
    </View>
  );
};
