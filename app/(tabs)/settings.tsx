import { Pressable, Text, TextInput, View } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "tailwindcss/colors";
import { auth, useAuth } from "@instantdb/react-native";

import Debugger from "@/components/Debugger";
import { SafeScrollView } from "@/components/SafeView";

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
    <SafeScrollView className="bg-white">
      <View className="mt-8 mb-4 px-4">
        <Text className="font-bold text-zinc-900 text-4xl">Settings</Text>
        <View className="h-px bg-zinc-200 my-2" />
      </View>

      {hasSentCode ? (
        <View className="p-4 gap-2">
          <View className="mb-2">
            <Text className="text-2xl text-zinc-900 font-bold mb-1">
              Enter verification code
            </Text>
            <Text className="text-base text-zinc-700">
              A login code was sent to {email}
            </Text>
          </View>
          <TextInput
            className="border bg-zinc-100 rounded flex-1 border-zinc-200 p-3"
            placeholder="000000"
            autoCapitalize="none"
            value={code}
            onChangeText={(text) => setMagicCode(text)}
          />
          <Pressable
            className="bg-zinc-900 border justify-center items-center border-zinc-800 rounded p-3"
            disabled={!code}
            onPress={handleVerifyMagicCode}
          >
            <Text className="text-white font-medium">Send code</Text>
          </Pressable>
        </View>
      ) : (
        <View className="p-4 gap-2">
          <View className="mb-2">
            <Text className="text-2xl text-zinc-900 font-bold mb-1">
              Log in
            </Text>
            <Text className="text-base text-zinc-700">
              Enter your email to receive a login code.
            </Text>
          </View>
          <TextInput
            className="border bg-zinc-100 rounded flex-1 border-zinc-200 p-3"
            placeholder="alex@example.com"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => setUserEmail(text)}
          />
          <Pressable
            className="bg-zinc-900 border justify-center items-center border-zinc-800 rounded p-3"
            disabled={!email}
            onPress={handleSendMagicCode}
          >
            <Text className="text-white font-medium">Send code</Text>
          </Pressable>
        </View>
      )}
    </SafeScrollView>
  );
}
