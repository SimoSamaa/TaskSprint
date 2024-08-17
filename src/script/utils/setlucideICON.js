import { createElement, Eye, EyeOff, User, MonitorUp, Menu, Settings2, LogOut, StickyNote } from 'lucide';

function setlucideICON() {
  const icons = document.querySelectorAll('i');

  for (let i = 0; i < icons.length; i++) {
    const icon = icons[i];
    const iconName = icon.dataset.icon;
    const iconSize = icon.dataset.size;
    const iconStroke = icon.dataset.stroke;

    let iconElement;

    if (iconName === 'eye') iconElement = createElement(Eye);
    if (iconName === 'eye-off') iconElement = createElement(EyeOff);
    if (iconName === 'user') iconElement = createElement(User);
    if (iconName === 'upload') iconElement = createElement(MonitorUp);
    if (iconName === 'menu') iconElement = createElement(Menu);
    if (iconName === 'setting') iconElement = createElement(Settings2);
    if (iconName === 'logout') iconElement = createElement(LogOut);
    if (iconName === 'note') iconElement = createElement(StickyNote);

    if (!iconElement) {
      console.warn(`Icon not found for: ${iconName}`);
      continue;
    }

    iconElement.style.cssText = `
      width: ${iconSize || '20px'}; 
      height: ${iconSize || '20px'}; 
      stroke-width: ${iconStroke || 2.5};
      `;
    icon.appendChild(iconElement);
  }
}

export default setlucideICON;