# GoodParent

A private, single-user app (this port: Expo/React Native, targeting iOS and Android — see the sibling SwiftUI/macOS version in `../GoodParent`) that helps a parent recognize and hold on to evidence that they *are* a good parent — the opposite of advice apps that tell them what to do. All data is private by default and never shared automatically. The parent may explicitly choose to Share an individual item — see **Share**.

## Language

**Check-In**:
A structured daily reflection with three parts: what went well, what didn't go so well, and an optional Action Item to revisit later.
_Avoid_: Entry, log, reflection (too generic — Check-In is the specific daily ritual)

**Action Item**:
A change the parent commits to after a Check-In. Resurfaces automatically in a future Check-In ("did this get better?"), but can also be browsed and reviewed manually at any time.
_Avoid_: Goal, task, reminder

**Panic Button**:
A quick, in-the-moment tool for a parent struggling emotionally during parenting — offers breathing exercises, positive affirmations, and possibly AI-guided conversation. Explicitly disclaimed as a lightweight coping aid, not crisis intervention; surfaces links to real professional help for anything beyond what it can handle.
_Avoid_: SOS, emergency button

**Affirmation Screen**:
The "I am a good dad/mum" screen — a dedicated space designed to help a parent say and internalize that affirmation with confidence.
_Avoid_: Home screen (this is distinct from the dashboard)

**Burn**:
A one-off cathartic release for a single bad moment the parent wants to let go of in the moment (e.g. "I got frustrated with him today"). Paired with a caveat that parenting is hard and hard days happen. Hard-deleted after burning — it is not linked to Check-Ins, Action Items, or any other record.
_Avoid_: Delete, remove (Burn is a deliberate emotional ritual, not general-purpose data deletion)

**Parent Milestone**:
An achievement the parent recognizes in themselves (e.g. "survived the first year," "handled a tantrum well"). The primary milestone type — central to the app's self-affirming purpose.
_Avoid_: Achievement, badge

**Child Milestone**:
A developmental milestone reached by the parent's child (e.g. first steps, first words). Secondary to Parent Milestone.

**Journal**:
A freeform writing space for the parent's general experience of parenthood — trips, moments, feelings — deliberately *not* framed around "are you a good parent." A neutral space to look back on, separate from the app's affirming angle.
_Avoid_: Check-In (Journal is unstructured and not goodness-framed; Check-In is)

**Homepage**:
A curated dashboard showing only the good — highlights pulled from Check-Ins, Journal, and Milestones, filtered to reinforce that the parent is doing well.

**Growth Space**:
A separate area holding what still needs work, kept apart from Homepage so the positives-only view stays uncontaminated by open Action Items or struggles.
_Avoid_: To-do list (Growth Space is reflective, not a productivity list)

**Timeline**:
A chronological aggregate view of Check-Ins, Milestones, and Affirmations. Distinct from Homepage (curated positives) and Growth Space (open items) — this is the full, unfiltered history.

**Recap**:
A periodic (weekly/monthly) digest computed on demand from existing Check-Ins, Journal entries, and Milestones — not a stored record of its own. Distinct from Homepage (always-current curated view): Recap is scoped to a specific past period and shown as stats plus highlights for that window.

**Share**:
An explicit, per-item, opt-in action the parent takes to send a single Parent Milestone, Child Milestone, or Affirmation outside the app via the OS-native share sheet (Messages, Mail, AirDrop, etc. on the SwiftUI version; the OS share sheet via `expo-sharing`/`react-native-share` on this Expo port) — no in-app recipient roster, nothing stored. The one deliberate exception to the app's private-by-default rule; deliberately unavailable on Burn, Journal, and Check-In, which stay private.
