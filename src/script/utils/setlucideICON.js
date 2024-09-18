import {
  createElement,
  Eye,
  EyeOff,
  User,
  MonitorUp,
  Menu,
  Settings2,
  LogOut,
  StickyNote,
  X,
  Plus,
  Trash2,
  MonitorCog,
  Sun,
  Moon,
  ListTodo
} from 'lucide';

const iconMap = {
  eye: Eye,
  'eye-off': EyeOff,
  user: User,
  upload: MonitorUp,
  menu: Menu,
  setting: Settings2,
  logout: LogOut,
  note: StickyNote,
  close: X,
  plus: Plus,
  delete: Trash2,
  system: MonitorCog,
  light: Sun,
  dark: Moon,
  list: ListTodo
};

function setLucideIcon() {
  document.querySelectorAll('i[data-icon]').forEach(icon => {
    const { icon: iconName, size: iconSize = '20px', stroke: iconStroke = '2.5' } = icon.dataset;
    const IconComponent = iconMap[iconName];

    if (!IconComponent) {
      console.warn(`Icon not found for: ${iconName}`);
      return;
    }

    while (icon.firstChild) icon.removeChild(icon.firstChild);

    const iconElement = createElement(IconComponent);
    Object.assign(iconElement.style, {
      width: iconSize,
      height: iconSize,
      strokeWidth: iconStroke
    });

    icon.appendChild(iconElement);
  });
}

export default setLucideIcon;