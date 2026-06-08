import {
  Brain,
  Cpu,
  Code2,
  Wrench,
  Users,
  GraduationCap,
  Code,
  Briefcase,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Brain,
  Cpu,
  Code2,
  Wrench,
  Users,
  GraduationCap,
  Code,
  Briefcase,
  CalendarDays,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Code;
}
