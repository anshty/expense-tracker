import { View, Text, FlatList } from "react-native";
import React, { useMemo } from "react";
import { theme } from "@/theme";

const History = ({ data = [] }) => {
//   console.log('===== DEBUG START =====');
//   console.log('data type:', typeof data);
//   console.log('Is Array:', Array.isArray(data));
//   console.log('data value:', data);
//   console.log('===== DEBUG END =====');

  // Sort data by date and time (newest first) with safety checks
  const sortedData = useMemo(() => {
    // Safety check - ensure data is an array
    if (!data || !Array.isArray(data)) {
      console.warn('Data is not an array, returning empty array');
      return [];
    }

    // If empty array, return it
    if (data.length === 0) {
      return [];
    }

    try {
      // Create a shallow copy before sorting
      const dataCopy = data.slice();
      
      return dataCopy.sort((a, b) => {
        try {
          // Parse date and time
          const dateA = parseDateTime(a.date, a.time);
          const dateB = parseDateTime(b.date, b.time);
          
          // Sort descending (newest first)
          return dateB - dateA;
        } catch (sortError) {
          console.error('Error sorting item:', sortError);
          return 0;
        }
      });
    } catch (error) {
      console.error('Error in sort:', error);
      return data;
    }
  }, [data]);

  // If no data, show empty state
  if (!sortedData || sortedData.length === 0) {
    return (
      <View className="mx-4 rounded-2xl mt-4 p-6" style={{ backgroundColor: theme.bgWhite(0.2) }}>
        <Text className="text-center text-gray-500 text-base">
          No transactions yet
        </Text>
        <Text className="text-center text-gray-400 text-sm mt-2">
          Start adding your income and expenses
        </Text>
      </View>
    );
  }

  const renderItem = ({ item, index }) => {
    const isIncome = item.type === "Income";
    const isFirstItem = index === 0;
    const isLastItem = index === sortedData.length - 1;

    return (
      <View
        className={`mx-4 p-4 ${
          isFirstItem ? "rounded-t-2xl mt-2" : ""
        } ${isLastItem ? "rounded-b-2xl mb-2" : ""}`}
        style={{
          borderBottomWidth: isLastItem ? 0 : 1,
          borderBottomColor: "#f3f4f6",
          backgroundColor: isFirstItem ? "#f0fdf4" : "#ffffff",
        }}
      >
        <View className="flex-row justify-between items-center">
          {/* Left Side - Icon and Details */}
          <View className="flex-row items-center flex-1">
            {/* Icon Circle */}
            <View
              className={`w-12 h-12 rounded-full items-center justify-center ${
                isIncome ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <Text className="text-2xl">
                {isIncome ? "💰" : getCategoryIcon(item.category)}
              </Text>
            </View>

            {/* Transaction Details */}
            <View className="ml-3 flex-1">
              <View className="flex-row items-center justify-between">
                <Text className="text-slate-900 font-semibold text-base" allowFontScaling={false}>
                  {item.Note || item.category || "Transaction"}
                </Text>
                {isFirstItem && (
                  <View className="bg-green-500 px-2 py-1 rounded-full ml-2">
                    <Text className="text-white text-xs font-bold" allowFontScaling={false}>NEW</Text>
                  </View>
                )}
              </View>
              
              <View className="flex-row items-center mt-1">
                <Text className="text-slate-500 text-xs" allowFontScaling={false}>
                  {formatDate(item.date)}  </Text>
                {item.time && (
                  <>
                    <Text className="text-slate-400 text-xs mx-1" allowFontScaling={false}>•</Text>
                    <Text className="text-slate-500 text-xs"allowFontScaling={false}>{formatTime(item.time)} </Text>
                  </>
                )}
              </View>
              
              {(item.mode_Income || item.mode_Expense) && (
                <View className="flex-row items-center mt-1">
                  <View
                    className={`px-2 py-0.5 rounded ${
                      isIncome ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    <Text
                      className={`text-xs ${
                        isIncome ? "text-green-700" : "text-red-700"
                      }`}
                      allowFontScaling={false}
                    >
                      {item.mode_Income || item.mode_Expense} </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Right Side - Amount */}
          <View className="items-end">
            <Text
              className={`font-bold text-lg ${
                isIncome ? "text-green-600" : "text-red-600"
              }`}
              allowFontScaling={false}
            >
              {isIncome ? "+" : "-"}₹{item.amount ? item.amount.toLocaleString("en-IN") : "0"}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="mt-4 mb-10">
      {/* Header */}
      <View className="mx-4 mb-2">
        <Text className="text-white font-bold text-xl">
          Transaction History
        </Text>
        <Text className="text-white/70 text-sm mt-1">
          {sortedData.length === 1 
            ? `${sortedData.length} transaction` 
            : `${sortedData.length} transactions`} • Newest first
        </Text>
      </View>

      {/* List */}
      <View
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: theme.bgWhite(0.2) }}
      >
        <FlatList
          data={sortedData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </View>
    </View>
  );
};

// Helper function to parse date and time into timestamp
const parseDateTime = (dateString, timeString) => {
  try {
    if (!dateString) return 0;
    
    let dateStr = dateString;
    
    // Convert DD/MM/YYYY to YYYY-MM-DD
    if (dateString.includes("/")) {
      const parts = dateString.split("/");
      if (parts.length === 3) {
        const [day, month, year] = parts;
        dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }

    // Create date object
    const date = new Date(dateStr);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateString);
      return 0;
    }
    
    // If time is provided, parse and add it
    if (timeString) {
      const timeParts = timeString.match(/(\d+):(\d+):(\d+)\s*(AM|PM)?/i);
      if (timeParts) {
        let hours = parseInt(timeParts[1]);
        const minutes = parseInt(timeParts[2]);
        const seconds = parseInt(timeParts[3]);
        const meridiem = timeParts[4];

        // Convert to 24-hour format
        if (meridiem) {
          if (meridiem.toUpperCase() === 'PM' && hours !== 12) {
            hours += 12;
          } else if (meridiem.toUpperCase() === 'AM' && hours === 12) {
            hours = 0;
          }
        }

        date.setHours(hours, minutes, seconds);
      }
    }

    return date.getTime();
  } catch (e) {
    console.error("Error parsing date/time:", e);
    return 0;
  }
};

// Helper function to get category icon
const getCategoryIcon = (category) => {
  const icons = {
    Breakfast: "🍳",
    Lunch: "🍱",
    Dinner: "🍽️",
    Transportation: "🚗",
    Shopping: "🛍️",
    Entertainment: "🎬",
    Healthcare: "🏥",
    Education: "📚",
    Bills: "📄",
    Groceries: "🛒",
    General: "💳",
  };
  return icons[category] || "💸";
};

// Format date to "Today", "Yesterday", or full date
const formatDate = (dateString) => {
  try {
    if (!dateString) return "Invalid Date";
    
    if (dateString.includes("/")) {
      const [day, month, year] = dateString.split("/");
      dateString = `${year}-${month}-${day}`;
    }

    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    date.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return "Today";
    } else if (date.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Invalid Date";
  }
};

// Format time to 12-hour format
const formatTime = (timeString) => {
  try {
    if (!timeString) return "";
    
    const timeParts = timeString.match(/(\d+):(\d+):(\d+)\s*(AM|PM)?/i);
    if (timeParts) {
      let hours = parseInt(timeParts[1]);
      const minutes = timeParts[2];
      let meridiem = timeParts[4] || '';

      // If no meridiem, determine from hours
      if (!meridiem) {
        meridiem = hours >= 12 ? 'PM' : 'AM';
        if (hours > 12) hours -= 12;
        if (hours === 0) hours = 12;
      }

      return `${hours}:${minutes} ${meridiem}`;
    }
    return timeString;
  } catch (e) {
    return timeString;
  }
};

export default History;