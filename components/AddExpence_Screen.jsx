import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Octicons } from "@expo/vector-icons";
import { theme } from "@/theme";

const AddExpence_Screen = ({ navigation }) => {
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mode,setMode]=useState("")
  const expense_category = [
    { id: 1, category: "Breakfast" },
    { id: 2, category: "Lunch" },
    { id: 3, category: "Dinner" },
    { id: 4, category: "Snacks" },
    { id: 5, category: "Groceries" },
    { id: 6, category: "Transportation" },
    { id: 7, category: "Shopping" },
    { id: 8, category: "Entertainment" },
    { id: 9, category: "Bills" },
    { id: 10, category: "Health" },
    { id: 11, category: "Education" },
    { id: 12, category: "Others" },
  ];

  const mode_ofExpense = [
    { id: 1, mode: "Cash" },
    { id: 2, mode: "UPI" },
    { id: 3, mode: "Debit Card" },
    { id: 4, mode: "Credit Card" },
    { id: 5, mode: "Wallet" },
    { id: 6, mode: "Bank Transfer" },
  ];

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-GB");
    const today_time = new Date().toLocaleTimeString("en-US");
    setDate(today);
    setTime(today_time);
  }, []);

  const saveExpense = async () => {
    const newExpense = {
      id: Date.now().toString(),
      type: "Expense",
      amount: parseFloat(amount),
      category: category,
      mode_Expense:mode,
      date: date,
      time: time,
      Note: note,
    };
    const existingData = await AsyncStorage.getItem("expenses");
    const expenses = existingData ? JSON.parse(existingData) : [];
    expenses.push(newExpense);
    await AsyncStorage.setItem("expenses", JSON.stringify(expenses));
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-black">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}>
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          <View className="flex-row items-center mx-4 ">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Octicons name="chevron-left" color="#fff" size={34} />
            </TouchableOpacity>
            <Text className="text-2xl text-white ml-5" allowFontScaling={false}>
              Expense </Text>
          </View>

          <ScrollView
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View className="mt-4">
              <View
                style={{ backgroundColor: theme.bgWhite(0.3) }}
                className="mx-4 rounded-2xl">
                {/* Amount */}
                <View className="mx-4 my-4">
                  <Text
                    className="text-lg font-semibold mx-4 my-2 text-slate-400"
                    allowFontScaling={false}>
                    Amount :
                  </Text>
                  <TextInput
                    className="bg-blue-100 rounded-full px-4 mx-4 text-lg text-black font-medium"
                    allowFontScaling={false}
                    onChangeText={setAmount}
                    value={amount}
                    keyboardType="numeric"
                    placeholder="Add your Expense"
                    placeholderTextColor="#888"
                    returnKeyType="done"
                  />
                </View>

                {/* Category */}
                <View className="mt-4 mx-4">
                  <Text
                    className="text-lg font-semibold px-4 py-2 text-slate-400"
                    allowFontScaling={false}>
                    Category :
                  </Text>
                  <View className="flex-row flex-wrap justify-center">
                    {expense_category.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        activeOpacity={0.7}
                        className="bg-blue-100 px-4 py-2 m-2 rounded-full border border-b-slate-900"
                        onPress={()=>setCategory(item.category)}
                        style={{
                          backgroundColor: category === item.category ? '#3b82f6' : '#dbeafe',
                          borderColor: category === item.category ? '#1e40af' : '#0f172a',
                        }}>
                        <Text
                          className="text-black font-medium"
                          allowFontScaling={false}>
                          {item.category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Mode of Expense */}
                <View className="mt-4 mx-4">
                  <Text
                    className="text-lg font-semibold px-4 py-2 text-slate-400"
                    allowFontScaling={false}>
                    Mode of Expense :
                  </Text>
                  <View className="flex-row flex-wrap justify-center">
                    {mode_ofExpense.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        activeOpacity={0.7}
                        className="bg-blue-100 px-4 py-2 m-2 rounded-full border border-b-slate-900"
                        onPress={()=>setMode(item.mode)}
                        style={{
                          backgroundColor: mode === item.mode ? '#3b82f6' : '#dbeafe',
                          borderColor: mode === item.mode ? '#1e40af' : '#0f172a',
                        }}
                        >
                        <Text
                          className="text-black font-medium"
                          allowFontScaling={false}>
                          {item.mode}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Date & Time */}
                <View className="mt-4 mx-4 flex-row justify-between">
                  {/* Date */}
                  <View>
                    <Text
                      className="text-lg font-semibold px-4 py-2 text-slate-400"
                      allowFontScaling={false}>
                      Date :
                    </Text>
                    <View className="items-start">
                      <View className="bg-blue-100 px-4 py-2 mx-4 rounded-full border border-b-slate-900">
                        <Text
                          className="text-black font-medium"
                          allowFontScaling={false}>
                          📅 {date}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Time */}
                  <View>
                    <Text
                      className="text-lg font-semibold px-4 py-2 text-slate-400"
                      allowFontScaling={false}>
                      Time :
                    </Text>
                    <View className="items-start">
                      <View className="bg-blue-100 px-4 py-2 mx-4 rounded-full border border-b-slate-900">
                        <Text
                          className="text-black font-medium"
                          allowFontScaling={false}>
                          ⏰ {time}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Note */}
                <View className="mx-4 my-4 mb-10">
                  <Text
                    className="text-lg font-semibold mx-4 my-2 text-slate-400"
                    allowFontScaling={false}>
                    Note :
                  </Text>
                  <TextInput
                    className="bg-blue-100 rounded-full px-4 mx-4 text-lg text-black font-medium"
                    allowFontScaling={false}
                    onChangeText={setNote}
                    value={note}
                    keyboardType="default"
                    placeholder="Note..."
                    placeholderTextColor="#888"
                    returnKeyType="done"
                  />
                </View>
              </View>
              {/* btn to save  */}
              <View className=" justify-center items-center mt-4">
                <TouchableOpacity className="bg-white px-16 py-5 rounded-full"
                activeOpacity={0.7}
                onPress={()=>saveExpense()}>
                  <Text className="text-black text-lg font-bold" allowFontScaling={false}>Add Expense </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AddExpence_Screen;
