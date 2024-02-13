import { Pressable, Text, TextInput, View } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "tailwindcss/colors";
import { auth, useAuth } from "@instantdb/react-native";

import Debugger from "@/components/Debugger";
import { SafeScrollView, SafeView } from "@/components/SafeView";

export default function SettingsScreen() {
  const [email, setUserEmail] = React.useState("");
  const [hasSentCode, setHasSentCode] = React.useState(false);
  const [code, setMagicCode] = React.useState("");
  const [isPending, setPendingState] = React.useState(false);
  const [error, setErrorMessage] = React.useState<string | null>(null);

  const handleSendMagicCode = async () => {
    if (!email) {
      return;
    }

    try {
      setPendingState(true);
      const result = await auth.sendMagicCode({ email });
      console.log("Success!", result);
      setHasSentCode(true);
    } catch (err: any) {
      console.error("Failed to send magic code:", err);
      alert("Something went wrong:" + err.body?.message);
    } finally {
      setPendingState(false);
    }
  };

  const handleVerifyMagicCode = async () => {
    if (!code) {
      return;
    }

    try {
      setPendingState(true);
      const result = await auth.signInWithMagicCode({ email, code });
      console.log("Success!", result);
    } catch (err: any) {
      console.error("Failed to verify magic code:", err);
      alert("Something went wrong:" + err.body?.message);
    } finally {
      setPendingState(false);
    }
  };

  return (
    <SafeView className="bg-white items-center justify-center dark:bg-zinc-950">
      {hasSentCode ? (
        <View className="p-8 gap-2 w-full">
          <View className="mb-2">
            <Text className="text-2xl text-zinc-900 dark:text-zinc-100 font-bold mb-1">
              Enter verification code
            </Text>
            <Text className="text-base text-zinc-700 dark:text-zinc-300">
              A login code was sent to {email}
            </Text>
          </View>
          <TextInput
            className="rounded-md border border-zinc-200 dark:border-zinc-700 h-12 px-3 items-center dark:text-zinc-100"
            placeholder="000000"
            autoCapitalize="none"
            value={code}
            onChangeText={(text) => setMagicCode(text)}
          />
          <Pressable
            className="bg-zinc-900 border justify-center items-center border-zinc-800 rounded p-3 dark:border-zinc-200 dark:bg-zinc-100"
            disabled={!code}
            onPress={handleVerifyMagicCode}
          >
            <Text className="text-white font-medium dark:text-zinc-900">
              Verify code
            </Text>
          </Pressable>
        </View>
      ) : (
        <View className="p-8 gap-2 w-full">
          <View className="mb-2">
            <Text className="text-2xl text-zinc-900 dark:text-zinc-100 font-bold mb-1">
              Log in
            </Text>
            <Text className="text-base text-zinc-700 dark:text-zinc-300">
              Enter your email to receive a login code.
            </Text>
          </View>
          <TextInput
            className="rounded-md border border-zinc-200 dark:border-zinc-700 h-12 px-3 items-center dark:text-zinc-100"
            placeholder="alex@example.com"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => setUserEmail(text)}
          />
          <Pressable
            className="bg-zinc-900 border justify-center items-center border-zinc-800 rounded p-3 dark:border-zinc-200 dark:bg-zinc-100"
            disabled={!email}
            onPress={handleSendMagicCode}
          >
            <Text className="text-white font-medium dark:text-zinc-900">
              Send code
            </Text>
          </Pressable>
        </View>
      )}
    </SafeView>
  );
}
