import { useStorageSuspense, withErrorBoundary, withSuspense } from '@extension/shared';
import { configStorage, exampleThemeStorage } from '@extension/storage';
import '@src/Popup.css';
import languageList from '@src/language';

import type { SelectProps } from '@chakra-ui/react';
import { Box, ChakraProvider, FormControl, FormLabel, Select, SimpleGrid, Switch } from '@chakra-ui/react';

function LanguageSelect(props: SelectProps) {
  return (
    <Select {...props}>
      {languageList.map((language: { code: string; name: string }) => (
        <option key={language.code} value={language.code}>
          {language.name}
        </option>
      ))}
    </Select>
  );
}

const Popup = () => {
  const theme = useStorageSuspense(exampleThemeStorage);
  const config = useStorageSuspense(configStorage);
  console.log(config.firstLanguage, config.secondLanguage);

  return (
    <ChakraProvider>
      <Box px={4} py={8}>
        <FormControl spacing={2} as={SimpleGrid} columns={8}>
          <FormLabel gridColumn="span 5" mb="0">
            Enable extension:
          </FormLabel>
          <Switch
            gridColumn="span 3"
            isChecked={config.enable}
            onChange={configStorage.toggleExtension}
            id="email-alerts"
          />

          {config.enable && (
            <>
              <FormLabel gridColumn="span 5" mb="0">
                Light theme:
              </FormLabel>
              <Switch
                gridColumn="span 3"
                isChecked={theme == 'light'}
                onChange={exampleThemeStorage.toggle}
                id="email-alerts"
              />

              <FormLabel gridColumn="span 5" mb="0">
                Enable AI Translate:
              </FormLabel>
              <Switch
                gridColumn="span 3"
                isChecked={config.aiTranslate}
                onChange={configStorage.toggleAI}
                id="email-alerts"
              />

              <FormLabel gridColumn="span 5" mb="0">
                First Language:
              </FormLabel>
              <LanguageSelect
                value={config.firstLanguage}
                gridColumn="span 3"
                onChange={e => configStorage.setFirstLanguage(e.target.value)}
                id="email-alerts"
              />

              <FormLabel gridColumn="span 5" mb="0">
                Second Language:
              </FormLabel>
              <LanguageSelect
                value={config.secondLanguage}
                gridColumn="span 3"
                onChange={e => configStorage.setSecondLanguage(e.target.value)}
                id="email-alerts"
              />
            </>
          )}
        </FormControl>
      </Box>
    </ChakraProvider>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
