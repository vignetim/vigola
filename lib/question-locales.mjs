import { questionPool } from './questions.mjs';
import { turkishQuestions } from './question-locales-tr.mjs';

// Localize the explanation, not the developer vocabulary: answers and choice
// labels stay canonical so the wheel initials and technical meaning stay intact.
const turkishCategories = {
 Algorithms: 'Algoritmalar', Compilers: 'Derleyiciler', Compression: 'Sıkıştırma',
 Concurrency: 'Eşzamanlılık', 'Data formats': 'Veri biçimleri', 'Data integrity': 'Veri bütünlüğü',
 'Data processing': 'Veri işleme', 'Data structures': 'Veri yapıları', Databases: 'Veritabanları',
 Delivery: 'Sürüm yönetimi', 'Developer tools': 'Geliştirici araçları', 'Digital media': 'Dijital medya',
 'Distributed systems': 'Dağıtık sistemler', 'Functional programming': 'Fonksiyonel programlama',
 Identifiers: 'Tanımlayıcılar', Infrastructure: 'Altyapı', JavaScript: 'JavaScript',
 'Memory management': 'Bellek yönetimi', 'Naming conventions': 'Adlandırma kuralları',
 Networking: 'Ağ', 'Operating systems': 'İşletim sistemleri', Performance: 'Performans',
 Programming: 'Programlama', Reliability: 'Güvenilirlik', Security: 'Güvenlik',
 'Software architecture': 'Yazılım mimarisi', 'Software design': 'Yazılım tasarımı',
 'Software licensing': 'Yazılım lisansları', Storage: 'Depolama', Systems: 'Sistemler',
 Testing: 'Test', Units: 'Birimler', 'Web development': 'Web geliştirme', 'Web security': 'Web güvenliği',
};

export function validateLanguage(language) {
 if (language !== 'tr' && language !== 'en') throw new Error('Soru dili için Türkçe veya English seç.');
 return language;
}

const normalized = value => value.normalize('NFC').replace(/\s+/g, ' ').trim().toLocaleLowerCase('tr');
const canonicalTexts = new Map();
const localized = questionPool.map(question => {
 const translation = turkishQuestions[question.id];
 if (!translation?.text?.trim() || !translation?.explanation?.trim()) throw new Error(`Missing Turkish question: ${question.id}`);
 if (!turkishCategories[question.category]) throw new Error(`Missing Turkish category: ${question.category}`);
 const translated = { ...question, ...translation, category: turkishCategories[question.category] };
 for (const text of [question.text, translated.text]) {
  const key = normalized(text);
  if (canonicalTexts.has(key)) throw new Error(`Duplicate localized question: ${question.id}`);
  canonicalTexts.set(key, { text: question.text, answer: question.answer });
 }
 return translated;
});

export function questionPoolForLanguage(language = 'en') {
 validateLanguage(language);
 return language === 'tr' ? localized : questionPool;
}

// Both versions consume the same historical question. Client-supplied IDs are
// still ignored, and edited/custom prompts retain their own content-based IDs.
export function canonicalQuestionText(text, answer) {
 const source = canonicalTexts.get(normalized(text));
 return source?.answer === answer ? source.text : text;
}
