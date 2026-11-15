import { Text, View } from "react-native";

// Dashboard tab — business overview once P0 modules land.
export default function DashboardTab() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl font-bold text-navy">Dashboard</Text>
      <Text className="mt-2 text-slate-600">Sales, stock, khata &amp; reports.</Text>
    </View>
  );
}
