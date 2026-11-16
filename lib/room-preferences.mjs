// This module is safe for the client: it never imports the question catalog.
export const bankStorageKeys = language => ({ bank: `vigola-bank-${language}`, useDefault: `vigola-use-default-pool-${language}` });

export function savedBankForLanguage(read, language) {
 const keys = bankStorageKeys(language);
 // Existing unscoped sets were created when the catalog was English-only.
 const useDefault = read(keys.useDefault) ?? (language === 'en' ? read('vigola-use-default-pool') : false);
 if (useDefault) return undefined;
 return read(keys.bank) ?? (language === 'en' ? read('vigola-bank') : undefined) ?? undefined;
}
