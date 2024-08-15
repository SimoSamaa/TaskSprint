import { createElement, Eye, EyeOff, User, MonitorUp } from 'lucide';

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