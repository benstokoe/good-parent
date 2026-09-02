import { router } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { Tag } from "@/components/ui/Tag";
import { Textarea } from "@/components/ui/Textarea";
import { useAppData } from "@/lib/app-data";
import { colors, semantic } from "@/lib/theme";

export default function MilestonesScreen() {
  const { state, addMilestone } = useAppData();
  const [tab, setTab] = useState<"parent" | "child">("parent");
  const [childFilter, setChildFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  const childNames = useMemo(
    () => [...new Set(state.childMilestones.map((m) => m.child).filter(Boolean))] as string[],
    [state.childMilestones],
  );
  const showChildFilter = childNames.length > 1 && tab === "child";

  const childMilestones =
    childFilter === "all"
      ? state.childMilestones
      : state.childMilestones.filter((m) => m.child === childFilter);

  const closeDialog = () => {
    setDialogOpen(false);
    setTitle("");
    setNote("");
  };

  const save = () => {
    if (!title.trim()) return;
    addMilestone(tab, title, note);
    closeDialog();
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: semantic.surfacePage }}>
      <View className="flex-row items-center gap-2.5 px-6 pb-3">
        <IconButton name="x" label="Close" onPress={() => router.back()} />
        <Text className="font-display text-title-sm flex-1" style={{ color: semantic.textHeading }}>
          Milestones
        </Text>
        <IconButton
          name="plus"
          label="Add milestone"
          variant="secondary"
          onPress={() => setDialogOpen(true)}
        />
      </View>

      <View className="px-6">
        <Tabs
          items={[
            { value: "parent", label: "Parent" },
            { value: "child", label: "Child" },
          ]}
          value={tab}
          onChange={(v) => setTab(v as "parent" | "child")}
        />
      </View>

      {showChildFilter ? (
        <View className="flex-row flex-wrap gap-1.5 px-6 pt-3">
          <Tag selected={childFilter === "all"} onPress={() => setChildFilter("all")}>
            All
          </Tag>
          {childNames.map((name) => (
            <Tag key={name} selected={childFilter === name} onPress={() => setChildFilter(name)}>
              {name}
            </Tag>
          ))}
        </View>
      ) : null}

      <ScrollView className="flex-1 px-6 pt-4" contentContainerClassName="pb-6">
        <View className="gap-3">
          {tab === "parent"
            ? state.parentMilestones.map((m) => (
                <Card key={m.id} tone="accent">
                  <View className="flex-row items-center gap-2 mb-1.5">
                    <Icon name="star" size={14} color={colors.clay[400]} />
                    <Text
                      className="font-display flex-1"
                      style={{ fontSize: 15, color: semantic.textHeading }}
                    >
                      {m.title}
                    </Text>
                    <Text className="text-caption" style={{ color: semantic.textSubtle }}>
                      {m.date}
                    </Text>
                    <IconButton
                      name="share-2"
                      label="Share this milestone"
                      variant="secondary"
                      size="sm"
                      onPress={() => {}}
                    />
                  </View>
                  <Text className="font-sans text-body-sm" style={{ color: semantic.textBody }}>
                    {m.note}
                  </Text>
                </Card>
              ))
            : childMilestones.map((m) => (
                <Card key={m.id}>
                  <View className="flex-row items-center gap-2 mb-1.5">
                    <Icon name="check" size={14} color={semantic.textMuted} />
                    <Text
                      className="font-display flex-1"
                      style={{ fontSize: 15, color: semantic.textHeading }}
                    >
                      {m.title}
                    </Text>
                    <Text className="text-caption" style={{ color: semantic.textSubtle }}>
                      {m.date}
                    </Text>
                    <IconButton
                      name="share-2"
                      label="Share this milestone"
                      variant="secondary"
                      size="sm"
                      onPress={() => {}}
                    />
                  </View>
                  <Text className="font-sans text-body-sm" style={{ color: semantic.textBody }}>
                    {m.note}
                  </Text>
                </Card>
              ))}
        </View>
      </ScrollView>

      <Dialog
        open={dialogOpen}
        title={tab === "parent" ? "New parent milestone" : "New child milestone"}
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
          <Input placeholder="e.g. First steps" value={title} onChangeText={setTitle} />
        </Field>
        <Field label="Note (optional)">
          <Textarea
            rows={3}
            placeholder="Anything you want to remember"
            value={note}
            onChangeText={setNote}
          />
        </Field>
      </Dialog>
    </SafeAreaView>
  );
}
