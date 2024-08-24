import { exampleThemeStorage } from '@extension/storage';

export async function toggleTheme() {
  await exampleThemeStorage.toggle();
}
