import { View, TouchableOpacity, Text, ScrollView } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { SimpleLineIcons, FontAwesome } from "@expo/vector-icons";
import PieChartComp from "@/components/PieChartComp";
import { theme } from "@/theme";
import History from "@/components/History"
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home_Screen = () => {
  const navigation = useNavigation();
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [expenses, setExpenses] = useState();
  const [incomes, setIncomes] = useState();
  const [history, setHistory] = useState({});

  // CallBack in useFocusEffect
  useFocusEffect(
    useCallback(() => {
      getAllData();
    }, [])
  );

  //  combine both income, expenses and history:
  const getAllData = async () => {
    try {
      const incomeValue = await AsyncStorage.getItem("income");
      const expenseValue = await AsyncStorage.getItem("expenses");

      const incomes = incomeValue ? JSON.parse(incomeValue) : [];
      const expenses = expenseValue ? JSON.parse(expenseValue) : [];

      setIncomes(incomes);
      setExpenses(expenses);
      // console.log(typeof incomes)

      // add total income
      const incomeTotal = incomes.reduce((sum, item) => sum + item.amount, 0);
      setTotalIncome(incomeTotal);
      const expenseTotal = expenses.reduce((sum, item) => sum + item.amount, 0);
      setTotalExpense(expenseTotal);
      const balanceTotal = incomeTotal - expenseTotal;
      setTotalBalance(balanceTotal);

      // Combine both arrays and sort by date/time if needed
      const allHistory = [...incomes, ...expenses].sort((a, b) => {
        return new Date(b.date) - new Date(a.date); // Sort newest first
      });

      setHistory(allHistory);
    } catch (e) {
      console.log("Error found :", e);
    }
  };
  console.log("total income:", totalIncome);
  // const formatCurrency = (value) => {
  //   const num = parseFloat(value) || 0;
  //   return num.toFixed(0);
  // };

  return (
    <View className="flex-1 bg-black">
      {/* header  */}
      <SafeAreaView>
        <View className="flex-row justify-between mx-4 items-center mb-4">
          <TouchableOpacity className="">
            <SimpleLineIcons name="menu" color="#fff" size={28} />
          </TouchableOpacity>
          <Text className="text-xl font-extrabold text-white">
            Expense Tracker
          </Text>
          <TouchableOpacity>
            <FontAwesome name="calendar" color="#fff" size={28} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <ScrollView>
        {/* balance card */}
        <View
          className=" mx-4 rounded-2xl mb-5"
          style={{ backgroundColor: theme.bgWhite(0.2) }}>
          <Text
            className="text-lg font-semibold mx-4 my-4 text-slate-400"
            allowFontScaling={false}>
            Total Balance :
          </Text>
          <Text
            className="text-4xl font-bold mx-4 text-slate-300"
            allowFontScaling={false}>{`₹ ${totalBalance.toFixed(2)}`}</Text>
          <View className="mt-8 flex-row justify-between mx-4 mb-5">
            <View>
              <Text className="text-slate-400 text-lg" allowFontScaling={false}>
                Income{" "}
              </Text>
              <Text
                className=" text-green-400 text-base"
                allowFontScaling={false}>
                {`₹ ${totalIncome.toFixed(2)}`}{" "}
              </Text>
            </View>
            <View
              style={{
                height: 30,
                backgroundColor: "#ccc",
                width: 2,
                marginVertical: 10,
              }}
            />
            <View>
              <Text className="text-slate-400 text-lg" allowFontScaling={false}>
                Expense{" "}
              </Text>
              <Text
                className=" text-red-700 text-base"
                allowFontScaling={false}>
                {`₹ ${totalExpense.toFixed(2)}`}{" "}
              </Text>
            </View>
          </View>
        </View>
        {/* adding balance btn & expence */}
        <View className="flex-row justify-between mx-10">
          <TouchableOpacity
            className="w-40 h-14 rounded-xl justify-center items-center"
            style={{ backgroundColor: theme.bgWhite(0.2) }}
            activeOpacity={0.7}
            onPress={() => {
              navigation.navigate("Balance");
            }}>
            <Text className="text-green-400 text-xl" allowFontScaling={false}>
              Add Balance{" "}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-40 h-14 rounded-xl justify-center items-center"
            style={{ backgroundColor: theme.bgWhite(0.2) }}
            activeOpacity={0.7}
            onPress={() => {
              navigation.navigate("Expence");
            }}>
            <Text className="text-red-700 text-xl" allowFontScaling={false}>
              Add Expence{" "}
            </Text>
          </TouchableOpacity>
        </View>
        {/* adding graph  */}
        <PieChartComp
          data={{
            income: totalIncome,
            expense: totalExpense,
            balance: totalBalance,
          }}
        />
        {/* History */}
        <History data={history}/>
        {/* {console.log( history)} */}
      </ScrollView>
    </View>
  );
};

export default Home_Screen;
