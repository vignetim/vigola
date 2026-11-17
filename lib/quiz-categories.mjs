// Safe to import in the browser: category names only, never question content.
export const QUIZ_CATEGORIES = [
 { id: 'ai', label: 'AI · Yapay zekâ', aliases: ['AI · Yapay zekâ', 'AI · Artificial intelligence', 'AI', 'Yapay zekâ'] },
 { id: 'cloud', label: 'Cloud', aliases: ['Cloud', 'Bulut'] },
 { id: 'algorithms', label: 'Algoritma ve Mantık', aliases: ['Algoritmalar', 'Algorithms', 'Veri yapıları', 'Data structures', 'Olasılık', 'Probability', 'Beklenen değer', 'Koşullu olasılık', 'Sayma', 'Küme mantığı', 'Sayı mantığı', 'Boolean mantığı', 'Bitler ve mantık', 'Bits and logic', 'Bit işlemleri', 'Bit maskeleri', 'Bitler ve parite', 'Bitler ve kodlama', 'Sayı gösterimi', 'Bilgi kodlama', 'Bit alanları'] },
 { id: 'programming', label: 'Programlama', aliases: ['Programlama', 'Programming', 'Kod okuma', 'Code reading', 'JavaScript okuma', 'Python okuma'] },
 { id: 'databases', label: 'Veritabanı', aliases: ['SQL', 'Veritabanları', 'Databases', 'İlişkisel model', 'SQL ve indeksler'] },
 { id: 'network-security', label: 'Ağ ve Güvenlik', aliases: ['Ağ', 'Networking', 'Güvenlik', 'Security', 'Web güvenliği', 'Web security', 'Ağ ve HTTP'] },
 { id: 'systems', label: 'Sistem Tasarımı', aliases: ['Dağıtık sistemler', 'Distributed systems', 'Eşzamanlılık', 'Concurrency', 'Yazılım tasarımı', 'Software design', 'Eşzamanlılık ve güvenilirlik', 'Tasarım ve API sözleşmeleri'] },
 { id: 'testing', label: 'Test ve Kalite', aliases: ['Test', 'Testing', 'Test ve gözlemlenebilirlik'] },
];

const normalized = value => value.normalize('NFC').trim().toLocaleLowerCase('tr');
const categoryIds = new Map(QUIZ_CATEGORIES.flatMap(category =>
 [category.id, category.label, ...category.aliases].map(alias => [normalized(alias), category.id])));

export function quizCategoryForQuestion(question) {
 return typeof question?.category === 'string' ? categoryIds.get(normalized(question.category)) : undefined;
}

export function validateQuizCategory(category = '') {
 if (category === '') return '';
 if (typeof category !== 'string' || !QUIZ_CATEGORIES.some(option => option.id === category)) throw new Error('Geçerli bir test kategorisi seç.');
 return category;
}

export function filterQuizCategory(pool, category) {
 return category ? pool.filter(question => quizCategoryForQuestion(question) === category) : pool;
}

export function quizCategoryCounts(pool) {
 return Object.fromEntries(QUIZ_CATEGORIES.map(category => [category.id, filterQuizCategory(pool, category.id).length]));
}
