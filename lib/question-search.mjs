// Turkish prompts also contain English technical terms and English wheel
// initials. Treat all I variants equally for search in either question language.
const fold = value => value.normalize('NFC').replace(/[Iİı]/gu, 'i').toLowerCase().replace(/\u0307/gu, '');

export const questionMatchesSearch = (question, search) => fold(`${question.letter} ${question.text}`).includes(fold(search.trim()));
