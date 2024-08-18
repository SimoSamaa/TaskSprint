import { createElement, Eye, EyeOff, User, MonitorUp, Menu, Settings2, LogOut, StickyNote } from 'lucide';

const iconMap = {
  eye: Eye,
  'eye-off': EyeOff,
  user: User,
  upload: MonitorUp,
  menu: Menu,
  setting: Settings2,
  logout: LogOut,
  note: StickyNote
};

function setLucideIcon() {
  document.querySelectorAll('i[data-icon]').forEach(icon => {
    const { icon: iconName, size: iconSize = '20px', stroke: iconStroke = '2.5' } = icon.dataset;
    const IconComponent = iconMap[iconName];

    if (!IconComponent) {
      console.warn(`Icon not found for: ${iconName}`);
      return;
    }

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
