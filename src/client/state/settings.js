import EventEmitter from 'events';
import appDispatcher from '../dispatcher';

import cons from './cons';

function getSettings() {
  const settings = localStorage.getItem('settings');
  if (settings === null) return null;
  return JSON.parse(settings);
}

function setSettings(key, value) {
  let settings = getSettings();
  if (settings === null) settings = {};
  settings[key] = value;
  localStorage.setItem('settings', JSON.stringify(settings));
}

class Settings extends EventEmitter {
  constructor() {
    super();

    this.themes = ['', 'silver-theme', 'dark-theme', 'butter-theme'];
    this.themeIndex = this.getThemeIndex();

    this.isMarkdown = this.getIsMarkdown();
  }

  getThemeIndex() {
    if (typeof this.themeIndex === 'number') return this.themeIndex;

    const settings = getSettings();
    if (settings === null) return 0;
    if (typeof settings.themeIndex === 'undefined') return 0;
    // eslint-disable-next-line radix
    return parseInt(settings.themeIndex);
  }

  getThemeName() {
    return this.themes[this.themeIndex];
  }

  setTheme(themeIndex) {
    const appBody = document.getElementById('appBody');
    this.themes.forEach((themeName) => {
      if (themeName === '') return;
      appBody.classList.remove(themeName);
    });
    if (this.themes[themeIndex] !== '') appBody.classList.add(this.themes[themeIndex]);
    setSettings('themeIndex', themeIndex);
    this.themeIndex = themeIndex;
  }

  getIsMarkdown() {
    if (typeof this.isMarkdown === 'boolean') return this.isMarkdown;

    const settings = getSettings();
    if (settings === null) return false;
    if (typeof settings.isMarkdown === 'undefined') return false;
    return settings.isMarkdown;
  }

  setter(action) {
    const actions = {
      [cons.actions.settings.TOGGLE_MARKDOWN]: () => {
        this.isMarkdown = !this.isMarkdown;
        setSettings('isMarkdown', this.isMarkdown);
        this.emit(cons.events.settings.MARKDOWN_TOGGLED, this.isMarkdown);
      },
    };

    actions[action.type]?.();
  }
}

const settings = new Settings();
appDispatcher.register(settings.setter.bind(settings));

export default settings;
