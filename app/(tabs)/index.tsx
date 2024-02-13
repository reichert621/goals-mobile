import { Pressable, Text, TextInput, View } from "react-native";
import dayjs from "dayjs";
import React, { ReactNode } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  auth,
  id,
  transact,
  tx,
  useAuth,
  useQuery,
} from "@instantdb/react-native";

import { cn } from "@/utils";
import Debugger from "@/components/Debugger";
import { SafeScrollView } from "@/components/SafeView";

function comparator(a: any, b: any) {
  const primary = a.type.localeCompare(b.type);

  if (primary === 0) {
    return a.name.localeCompare(b.name);
  } else {
    return primary;
  }
}

function Checkbox({
  className,
  checked,
  onCheckedChange,
  children,
}: {
  className?: string;
  checked?: boolean;
  onCheckedChange: (checked: boolean) => void;
  children?: React.ReactNode;
}) {
  if (children) {
    return (
      <Pressable
        className={cn("flex flex-row items-center gap-3", className)}
        onPress={() => onCheckedChange(!checked)}
      >
        <View
          className={cn(
            "border border-zinc-700 h-6 w-6 items-center justify-center rounded",
            checked && "bg-zinc-800"
          )}
        >
          {checked && <Ionicons name="checkmark" size={16} color="white" />}
        </View>
        {children}
      </Pressable>
    );
  }

  return (
    <Pressable
      className={cn(
        "border border-zinc-700 h-6 w-6 items-center justify-center rounded",
        checked && "bg-zinc-800",
        className
      )}
      onPress={() => onCheckedChange(!checked)}
    >
      {checked && <Ionicons name="checkmark" size={16} color="white" />}
    </Pressable>
  );
}

const GoalInput = ({
  goal,
  onUpdate,
  onDelete,
}: {
  goal: any;
  onUpdate: (goal: any, value: number) => void;
  onDelete: (goal: any) => void;
}) => {
  const { logs = [], type } = goal;
  const [log] = logs;
  const label = goal.question || goal.name;
  const [value, setInputValue] = React.useState<string>(
    String(log?.value ?? "")
  );
  const v = log?.value || null;

  React.useEffect(() => {
    if (v) {
      setInputValue(String(v));
    } else {
      setInputValue("");
    }
  }, [v]);

  const handleChangeInput = (text: string) => {
    const value = text.replace(/\D/g, "");

    setInputValue(value);
  };

  if (type === "binary" || type === "aggregate") {
    const isDone = !!log && !!log.value;

    return (
      <View key={goal.id} className="mt-3">
        <Checkbox
          checked={isDone}
          onCheckedChange={(checked) => onUpdate(goal, checked ? 1 : 0)}
        >
          <Text
            className={cn(
              "text-lg font-medium",
              isDone
                ? "text-zinc-400 line-through dark:text-zinc-500"
                : "text-zinc-700 dark:text-zinc-200"
            )}
          >
            {label}
          </Text>
        </Checkbox>
      </View>
    );
  } else if (type === "number") {
    return (
      <View key={goal.id} className="mt-6">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-lg font-medium text-zinc-700 dark:text-zinc-200">
            {label}
          </Text>
          <View className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 dark:bg-blue-900 dark:border-blue-800">
            <Text className="text-sm font-medium tracking-wide text-blue-500 dark:text-blue-100">
              Target: {goal.value} {goal.unit}
            </Text>
          </View>
        </View>

        <View className="relative mt-1 flex flex-row items-center">
          <TextInput
            className="flex-1 rounded-md border border-zinc-200 dark:border-zinc-700 h-12 px-3 items-center"
            placeholder="0"
            keyboardType="numeric"
            value={value}
            onChangeText={handleChangeInput}
            onBlur={() => onUpdate(goal, Number(value))}
          />
          <View className="absolute items-center justify-center right-4 text-base text-zinc-400">
            <Text className="text-zinc-400">{goal.unit}</Text>
          </View>
        </View>
      </View>
    );
  }
};

const LogDetails = ({
  className,
  date,
}: {
  className?: string;
  date: string;
}) => {
  const { isLoading, error, data } = useQuery({
    goals: {
      logs: {
        $: {
          where: { date },
        },
      },
    },
  });

  if (isLoading) {
    return null;
  } else if (error) {
    return (
      <View>
        <Text>{error.message}</Text>
      </View>
    );
  }

  const { goals } = data;

  const handleDeleteLogs = (goal: any) => {
    const txns = goal.logs.map((log: any) => {
      return tx.logs[log.id].delete();
    });

    transact(txns);
  };

  const handleUpdateLog = (goal: any, value: number) => {
    const [log] = goal.logs;

    if (log) {
      transact(tx.logs[log.id].update({ value }));
    } else {
      const logId = id();

      transact(
        tx.logs[logId]
          .update({ goalId: goal.id, date, value })
          .link({ goals: goal.id })
      );
    }
  };

  const daily = goals
    .filter((goal) => goal.cadence === "daily")
    .sort(comparator);
  const weekly = goals
    .filter((goal) => goal.cadence === "weekly")
    .sort(comparator);
  const monthly = goals
    .filter((goal) => goal.cadence === "monthly")
    .sort(comparator);
  const eoy = goals.filter((goal) => goal.cadence === "eoy").sort(comparator);

  return (
    <View className={className}>
      <View className="mb-12">
        <View className="">
          {daily.map((goal) => {
            return (
              <GoalInput
                key={goal.id}
                goal={goal}
                onUpdate={handleUpdateLog}
                onDelete={handleDeleteLogs}
              />
            );
          })}
        </View>
      </View>
      <View className="mb-12">
        <Text className="mb-2 text-3xl font-bold text-zinc-800 dark:text-zinc-200">
          This week
        </Text>
        <View className="">
          {weekly.map((goal) => {
            return (
              <GoalInput
                key={goal.id}
                goal={goal}
                onUpdate={handleUpdateLog}
                onDelete={handleDeleteLogs}
              />
            );
          })}
        </View>
      </View>
      <View className="mb-12">
        <Text className="mb-2 text-3xl font-bold text-zinc-800 dark:text-zinc-200">
          This month
        </Text>
        <View className="">
          {monthly.map((goal) => {
            return (
              <GoalInput
                key={goal.id}
                goal={goal}
                onUpdate={handleUpdateLog}
                onDelete={handleDeleteLogs}
              />
            );
          })}
        </View>
      </View>
      <View className="mb-12">
        <Text className="mb-4 text-3xl font-bold text-zinc-800 dark:text-zinc-200">
          2024 goals
        </Text>
        <View className="">
          {eoy.map((goal) => {
            return (
              <GoalInput
                key={goal.id}
                goal={goal}
                onUpdate={handleUpdateLog}
                onDelete={handleDeleteLogs}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const today = dayjs().format("YYYY-MM-DD");

  return (
    <SafeScrollView
      className="bg-white dark:bg-zinc-950"
      automaticallyAdjustKeyboardInsets
    >
      <View className="mt-12 mb-4 px-4">
        <Text className="font-bold text-zinc-900 dark:text-zinc-100 text-5xl">
          Today
        </Text>
      </View>

      <LogDetails className="px-4" date={today} />
    </SafeScrollView>
  );
}
