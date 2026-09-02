import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PhotoSlot } from "@/components/PhotoSlot";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Field } from "@/components/ui/Field";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useAppData } from "@/lib/app-data";
import { semantic } from "@/lib/theme";

export default function JournalScreen() {
  const { state, addJournalEntry } = useAppData();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const entries = search.trim()
    ? state.journalEntries.filter((j) =>
        `${j.title} ${j.body}`.toLowerCase().includes(search.toLowerCase()),
      )
    : state.journalEntries;

  const closeDialog = () => {
    setDialogOpen(false);
    setTitle("");
    setBody("");
  };

  const save = () => {
    if (!title.trim() && !body.trim()) return;
    addJournalEntry(title, body);
    closeDialog();
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: semantic.surfacePage }}>
      <ScrollView className="flex-1 px-6 pt-16" contentContainerClassName="pb-6">
        <View className="flex-row justify-between items-start">
          <View>
            <Text className="font-display text-display-md" style={{ color: semantic.textHeading }}>
              Journal
            </Text>
            <Text
              className="font-sans text-body-sm mt-0.5 max-w-[260px]"
              style={{ color: semantic.textMuted }}
            >
              Your experience of parenthood. Not a report card.
            </Text>
          </View>
          <IconButton
            name="plus"
            label="New entry"
            variant="secondary"
            onPress={() => setDialogOpen(true)}
          />
        </View>

        <View className="mt-4">
          <Input placeholder="Search journal" value={search} onChangeText={setSearch} />
        </View>

        <View className="gap-3 mt-3">
          {entries.map((j) => (
            <Card key={j.id}>
              <View className="flex-row justify-between items-baseline">
                <Text className="font-display text-title-sm" style={{ fontSize: 15, color: semantic.textHeading }}>
                  {j.title}
                </Text>
                <Text className="text-caption" style={{ color: semantic.textSubtle }}>
                  {j.date}
                </Text>
              </View>
              <Text className="font-sans text-body-sm mt-1.5" style={{ color: semantic.textBody }}>
                {j.body}
              </Text>
              <View className="mt-2.5">
                <PhotoSlot />
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      <Dialog
        open={dialogOpen}
        title="New journal entry"
        onClose={closeDialog}
        footer={
          <>
            <Button variant="ghost" onPress={closeDialog}>
              Cancel
            </Button>
            <Button variant="primary" onPress={save}>
              Save
            </Button>
          </>
        }
      >
        <Field label="Title">
          <Input placeholder="A few words" value={title} onChangeText={setTitle} />
        </Field>
        <Field label="What's on your mind">
          <Textarea
            rows={5}
            placeholder="Trips, moments, feelings…"
            value={body}
            onChangeText={setBody}
          />
        </Field>
      </Dialog>
    </SafeAreaView>
  );
}
