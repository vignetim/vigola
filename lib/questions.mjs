import { questionVariants } from './question-variants.mjs';

const make = (letter, category, text, answer, explanation, difficulty = 'Kolay', code = '') => ({ id: letter.toLowerCase(), letter, category, text, answer, explanation, difficulty, code, points: 100, penalty: difficulty === 'Zor' ? 50 : difficulty === 'Orta' ? 30 : 25, multiplier: difficulty === 'Zor' ? 2 : difficulty === 'Orta' ? 1.5 : 1 });
export const questions = [
 make('A', 'Web geliştirme', 'Farklı yazılımların birbiriyle iletişim kurmasını sağlayan arayüze ne ad verilir?', 'API', 'Application Programming Interface, uygulamaların belirli kurallar üzerinden veri ve işlev paylaşmasını sağlar.', 'Kolay', 'const response = await fetch("/api/players");\nconst players = await response.json();'),
 make('B', 'Algoritmalar', 'Sıralı bir dizide arama alanını her adımda ikiye bölerek çalışan arama algoritması nedir?', 'Binary search', 'İkili arama, kalan aralığın yarısını eler. Zaman karmaşıklığı O(log n) olur.', 'Orta'),
 make('C', 'JavaScript', 'Bir fonksiyonun, dış fonksiyonu tamamlandıktan sonra bile onun değişkenlerine erişmesini sağlayan yapının adı nedir?', 'Closure', 'Closure, bir fonksiyonun tanımlandığı sözcüksel kapsama erişimini korumasıdır.', 'Zor', 'function counter() {\n  let count = 0;\n  return () => ++count;\n}'),
 make('D', 'DevOps', 'Uygulamaları bağımlılıklarıyla birlikte konteynerler içinde paketleyip çalıştıran popüler platform nedir?', 'Docker', 'Docker, uygulamaları izole konteynerler içinde çalıştırır.'),
 make('E', 'JavaScript', 'JavaScript’te çağrı yığını ile görev kuyrukları arasındaki koordinasyonu sağlayan mekanizma nedir?', 'Event loop', 'Event loop, çağrı yığını boşaldığında sıradaki görevlerin çalışmasını koordine eder.', 'Orta'),
 make('F', 'Programlama', 'Belirli bir işi gerçekleştirmek için çağrılabilen, yeniden kullanılabilir kod bloğuna ne denir?', 'Fonksiyon', 'Fonksiyonlar girdileri işleyebilir ve bir değer döndürebilir.'),
 make('G', 'Geliştirici araçları', 'Kod değişikliklerini takip etmek için kullanılan dağıtık sürüm kontrol sistemi nedir?', 'Git', 'Git, değişiklik geçmişini yerel depolarda da tutar.'),
 make('H', 'Web geliştirme', 'Web sayfalarının yapısını tanımlamak için kullanılan işaretleme dilinin kısaltması nedir?', 'HTML', 'HyperText Markup Language, web içeriğinin anlamsal yapısını tanımlar.'),
 make('İ', 'Veritabanı', 'Veritabanı sorgularının kayıtlara daha hızlı erişmesini sağlayan yardımcı veri yapısı nedir?', 'İndeks', 'İndeks okumaları hızlandırırken ek depolama ve yazma maliyeti oluşturur.', 'Orta'),
 make('J', 'Web geliştirme', 'Anahtar-değer çiftleri ve dizilerle yapılandırılmış veri taşımak için kullanılan metin biçimi nedir?', 'JSON', 'JavaScript Object Notation, dilden bağımsız bir veri değişim biçimidir.'),
 make('K', 'DevOps', 'Konteynerlerin dağıtımını ve ölçeklenmesini yöneten açık kaynak orkestrasyon sistemi nedir?', 'Kubernetes', 'Kubernetes, konteyner iş yüklerini istenen durumda tutar.', 'Zor'),
 make('L', 'Veri yapıları', 'Her elemanın veriye ve sıradaki elemana bir referansa sahip olduğu veri yapısının İngilizce adı nedir?', 'Linked list', 'Bağlı listede düğümler referanslarla birbirine bağlanır.', 'Orta'),
 make('M', 'Yazılım mimarisi', 'Uygulamayı bağımsız dağıtılabilen küçük servislere bölen mimari yaklaşım nedir?', 'Mikroservis', 'Servisler belirli bir sorumluluğa odaklanır ve arayüzlerle haberleşir.', 'Orta'),
 make('N', 'JavaScript', 'JavaScript’i tarayıcı dışında çalıştırmayı sağlayan V8 tabanlı çalışma ortamı nedir?', 'Node.js', 'Node.js, sunucularda ve komut satırında JavaScript çalıştırır.'),
 make('O', 'Programlama', 'Nesne yönelimli programlamanın İngilizce adının yaygın kısaltması nedir?', 'OOP', 'Object-Oriented Programming; nesneler, kapsülleme ve polimorfizm içerir.', 'Orta'),
 make('P', 'JavaScript', 'Henüz tamamlanmamış asenkron işlemin gelecekteki sonucunu temsil eden nesne nedir?', 'Promise', 'Promise; pending, fulfilled veya rejected durumundadır.', 'Orta'),
 make('R', 'Web geliştirme', 'Meta tarafından geliştirilen, bileşenlerle arayüz oluşturmayı sağlayan JavaScript kütüphanesi nedir?', 'React', 'React, bildirime dayalı ve bileşen temelli arayüzler oluşturur.'),
 make('S', 'Veritabanı', 'İlişkisel veritabanlarındaki verileri sorgulamak için kullanılan dil nedir?', 'SQL', 'Structured Query Language; SELECT, INSERT, UPDATE ve DELETE komutlarını içerir.'),
 make('T', 'Programlama', 'JavaScript’e statik tip denetimi ekleyen, Microsoft tarafından geliştirilen dil nedir?', 'TypeScript', 'TypeScript, JavaScript’in tip sözdizimi ekleyen bir üst kümesidir.'),
 make('U', 'Test', 'Tek bir fonksiyonun davranışını izole biçimde doğrulayan testin İngilizce adı nedir?', 'Unit test', 'Birim testleri küçük bir kod biriminin beklenen davranışını sınar.', 'Orta'),
 make('V', 'Web geliştirme', 'Arayüzün bellekte tutulan temsilini gerçek DOM ile karşılaştıran yaklaşımın yaygın adı nedir?', 'Virtual DOM', 'Sanal DOM, arayüzün JavaScript nesneleriyle temsilidir.', 'Orta'),
 make('W', 'Ağ', 'İstemci ve sunucu arasında tek bağlantıda sürekli, çift yönlü iletişim sağlayan protokol nedir?', 'WebSocket', 'WebSocket, kalıcı bağlantı üzerinden iki yönlü mesajlaşma sağlar.', 'Zor'),
 make('Y', 'Veri yapıları', 'Son giren elemanın ilk çıktığı (LIFO) veri yapısının Türkçe adı nedir?', 'Yığın', 'Yığın (stack), ekleme ve çıkarmayı aynı uçtan yapar.'),
 make('Z', 'Algoritmalar', 'Algoritmanın çalışma süresinin girdi büyüklüğüyle nasıl arttığını anlatan kavram nedir?', 'Zaman karmaşıklığı', 'Genellikle O(1), O(n) veya O(n log n) biçiminde gösterilir.', 'Zor'),
];

const easyAnswers = new Set([
 'Array', 'Await', 'Alias', 'Branch', 'Boolean', 'Break', 'CSS', 'Cookie',
 'Commit', 'DNS', 'DOM', 'HTTP', 'HTTPS', 'Java', 'JavaScript', 'JOIN',
 'Kuyruk', 'Kotlin', 'Loop', 'Markdown', 'Null', 'npm', 'Python',
 'Regex', 'Set', 'SSH', 'TCP', 'UDP', 'URL', 'UI', 'Vim', 'While', 'ZIP',
]);
const hardAnswers = new Set([
 'Bloom filter', 'Backpressure', 'Dijkstra', 'HMAC', 'Event sourcing',
 'Eventual consistency', 'Hexagonal architecture', 'Lexical scope',
 'LRU', 'Mutex', 'Race condition', 'Topological sort', 'Trie', 'WAL', 'Zero-copy',
]);

export const questionPool = [
 ...questions,
 ...Object.entries(questionVariants).flatMap(([letter, rows]) => rows.trim().split('\n').map((row, index) => {
  const [category, answer, text, explanation] = row.split('|');
  const difficulty = easyAnswers.has(answer) ? 'Kolay' : hardAnswers.has(answer) ? 'Zor' : 'Orta';
  return { ...make(letter, category, text, answer, explanation, difficulty), id: `${letter}-${index + 1}` };
 })),
];
