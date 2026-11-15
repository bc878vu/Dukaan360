import { Text, View } from "react-native";

// Settings screen — ships with the P0 release (see docs/PRD.md Part 2).
export default function SettingsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl font-bold text-navy">Settings</Text>
    </View>
  );
}
