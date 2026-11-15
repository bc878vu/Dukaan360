import { Text, View } from "react-native";

// Inventory screen — ships with the P0 release (see docs/PRD.md Part 2).
export default function InventoryScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl font-bold text-navy">Inventory</Text>
    </View>
  );
}
