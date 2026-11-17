// This module is safe for the client: it never imports the question catalog.
export const bankStorageKeys = (language, mode = 'buzzer', category = '') => mode === 'quiz'
 ? { bank: `vigola-quiz-bank-${language}${category ? `-${category}` : ''}`, useDefault: `vigola-quiz-use-default-pool-${language}${category ? `-${category}` : ''}` }
 : { bank: `vigola-bank-${language}`, useDefault: `vigola-use-default-pool-${language}` };

export function savedBankForLanguage(read, language, mode = 'buzzer', category = '') {
 const keys = bankStorageKeys(language, mode, category);
 if (mode === 'quiz') return read(keys.useDefault) ? undefined : read(keys.bank) ?? undefined;
 // Existing unscoped sets were created when the catalog was English-only.
 const useDefault = read(keys.useDefault) ?? (language === 'en' ? read('vigola-use-default-pool') : false);
 if (useDefault) return undefined;
 return read(keys.bank) ?? (language === 'en' ? read('vigola-bank') : undefined) ?? undefined;
}
