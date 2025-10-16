import { View, Text } from "react-native";
import React from "react";
import { PieChart } from "react-native-gifted-charts";
import { theme } from "@/theme/index";

const PieChartComp = ({ data }) => {
  const pieData = [
    { value: data.income, color: "#00BFA6", text: `₹ ${data.income}`, label: "Income" }, // Teal
    { value: data.expense, color: "#FF5C5C", text: `₹ ${data.expense}`, label: "Expense" }, // Rich red
    { value: data.balance, color: "#FFD460", text: `₹ ${data.balance}`, label: "Balance" }, // Gold yellow
  ];

  return (
    <View
      className="items-center justify-center mx-4 rounded-2xl p-4 mt-4"
      style={{ backgroundColor: theme.bgWhite(0.2) }}>
      <PieChart
        donut
        semiCircle
        // showText
        textColor="black"
        radius={80}
        textSize={10}
        // showTextBackground
        // textBackgroundRadius={26}
        data={pieData}
      />
      <Text
        className="text-lg font-semibold text-gray-50 mt-4 mb-2"
        allowFontScaling={false}>
        Current Month Data
      </Text>

      {/* Improved Legend */}
      <View className="flex-row flex-wrap justify-center w-full mt-4 gap-2">
        {pieData.map((item, index) => (
          <View
            key={index}
            className="flex-row items-center space-x-2 bg-gray-800/30 rounded-xl px-3 py-2 gap-2"
            style={{ minWidth: 100 }}>
            {/* Color Indicator */}
            <View
              style={{
                width: 15,
                height: 15,
                borderRadius: 7.5,
                backgroundColor: item.color,
              }}
            />
            {/* Label and Value */}
            <View>
              <Text className="text-white font-medium" allowFontScaling={false}>
                {item.label}
              </Text>
              <Text className="text-gray-200 text-sm" allowFontScaling={false}>
                {item.text}  </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default PieChartComp;
