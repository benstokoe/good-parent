import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Eye,
  ImagePlus,
  Lock,
  MessageSquare,
  Mic,
  Pencil,
  Plus,
  RefreshCw,
  Send,
  Share2,
  Sparkles,
  Star,
  TriangleAlert,
  User,
  X,
  type LucideIcon,
} from "lucide-react-native";

export const ICONS = {
  lock: Lock,
  "circle-check": CheckCircle2,
  sparkles: Sparkles,
  star: Star,
  x: X,
  pencil: Pencil,
  "refresh-cw": RefreshCw,
  eye: Eye,
  "image-plus": ImagePlus,
  "message-square": MessageSquare,
  check: Check,
  "triangle-alert": TriangleAlert,
  send: Send,
  plus: Plus,
  "share-2": Share2,
  mic: Mic,
  "chevron-right": ChevronRight,
  "chevron-down": ChevronDown,
  user: User,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export function Icon({
  name,
  size = 20,
  color = "currentColor",
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  const Cmp = ICONS[name];
  return <Cmp size={size} color={color} strokeWidth={2} />;
}
