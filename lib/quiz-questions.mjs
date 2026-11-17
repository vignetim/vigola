import { turkishQuizExtraA } from './quiz-questions-tr-a.mjs';
import { turkishQuizExtraB } from './quiz-questions-tr-b.mjs';
import { aiCloudQuizRows } from './quiz-questions-ai-cloud.mjs';

// Server-side quiz catalog. Each locale tuple contains prompt, four options
// (the first is correct), and explanation. Code snippets are shared by locales.
const q = (id, category, difficulty, tr, en, code = '') => ({ id: `quiz-${id}`, category, difficulty, tr, en, code });
const rows = [
 q('01', ['Algoritmalar', 'Algorithms'], 'Orta',
  ['Sıralı [1, 3, 3, 7] dizisinde 4 değerini ekleyip sıralamayı korumak istiyorsun. Sıfır tabanlı ekleme indeksi kaçtır?', ['3', '2', '4', '1'], '4, son 3 ile 7 arasına eklenir; 7 mevcut dizide 3. indekstedir.'],
  ['You want to insert 4 into the sorted array [1, 3, 3, 7] while preserving order. What is the zero-based insertion index?', ['3', '2', '4', '1'], '4 belongs between the last 3 and 7. The existing 7 is at index 3.']),
 q('02', ['Algoritmalar', 'Algorithms'], 'Orta',
  ['Bir fonksiyon önce n öğeyi, sonra aynı n öğeyi birer kez dolaşıyor. Döngüler iç içe değil. Çalışma süresi nasıl büyür?', ['Doğrusal: O(n)', 'Karesel: O(n²)', 'Logaritmik: O(log n)', 'Sabit: O(1)'], 'İki ardışık geçiş 2n işlem yapar. Sabit çarpan büyüme sınıfını değiştirmez.'],
  ['A function visits n items once, then visits those n items once again. The loops are sequential. How does its running time grow?', ['Linear: O(n)', 'Quadratic: O(n²)', 'Logarithmic: O(log n)', 'Constant: O(1)'], 'Two sequential passes do 2n operations. A constant factor does not change the growth class.']),
 q('03', ['Algoritmalar', 'Algorithms'], 'Orta',
  ['Tüm kenarların maliyeti 1 olan bir grafikte tek kaynaktan en az kenarlı yolları O(V + E) sürede bulmak istiyorsun. Hangisini seçersin?', ['BFS', 'DFS', 'Prim', 'Floyd–Warshall'], 'BFS düğümleri uzaklık katmanları halinde ziyaret eder. DFS en kısa yolu garanti etmez; Prim kapsayan ağaç, Floyd–Warshall tüm çiftler içindir.'],
  ['Every edge in a graph costs 1. You need shortest paths from one source in O(V + E) time. Which algorithm fits?', ['BFS', 'DFS', 'Prim', 'Floyd–Warshall'], 'BFS explores vertices in distance layers. DFS does not guarantee shortest paths; Prim builds a spanning tree, while Floyd–Warshall solves all pairs.']),
 q('04', ['Algoritmalar', 'Algorithms'], 'Orta',
  ['Uzunlukları n ve m olan iki sıralı diziyi, her öğeyi bir kez okuyarak tek sıralı dizide birleştiriyorsun. Süre karmaşıklığı hangisidir?', ['Doğrusal: O(n + m)', 'Çarpımsal: O(n × m)', 'Karesel: O((n + m)²)', 'Sabit: O(1)'], 'İki işaretçi yalnız ileri gider; toplam n + m öğe okunur ve yazılır.'],
  ['You merge two sorted arrays of lengths n and m, reading each item once. What is the time complexity?', ['Linear: O(n + m)', 'Multiplicative: O(n × m)', 'Quadratic: O((n + m)²)', 'Constant: O(1)'], 'Both pointers move forward only. A total of n + m items are read and written.']),
 q('05', ['Veri yapıları', 'Data structures'], 'Zor',
  ['Ayrı zincirleme kullanan bir hash tabloda n anahtarın tümü aynı kovaya düşüyor. Olmayan bir anahtarı aramanın en kötü maliyeti nedir?', ['Doğrusal: O(n)', 'Sabit: O(1)', 'Logaritmik: O(log n)', 'Karesel: O(n²)'], 'Tek kovadaki zincirin tamamı taranabilir. Ortalama sabit erişim, bu çakışma durumunda geçerli değildir.'],
  ['A hash table uses separate chaining, and all n keys collide into one bucket. What is the worst-case cost of finding an absent key?', ['Linear: O(n)', 'Constant: O(1)', 'Logarithmic: O(log n)', 'Quadratic: O(n²)'], 'The entire chain may need to be scanned. Average constant-time access does not apply to this collision pattern.']),
 q('06', ['Algoritmalar', 'Algorithms'], 'Orta',
  ['(A, 2), (B, 1), (C, 2) kayıtları sayısal değere göre artan ve kararlı biçimde sıralanıyor. Harf sırası ne olur?', ['B, A, C', 'B, C, A', 'A, B, C', 'C, A, B'], 'Önce değeri 1 olan B gelir. Eşit değere sahip A ve C, girişteki sıralarını korur.'],
  ['Records (A, 2), (B, 1), (C, 2) are sorted by number in ascending order using a stable sort. What is the letter order?', ['B, A, C', 'B, C, A', 'A, B, C', 'C, A, B'], 'B comes first because its value is 1. Equal-valued A and C retain their original order.']),
 q('07', ['Algoritmalar', 'Algorithms'], 'Orta',
  ['A görevi B bitmeden, B görevi C bitmeden, C görevi A bitmeden başlayamıyor. Bu üç görevi sırayla tamamlayan geçerli plan hangisidir?', ['Geçerli bir sıra yok', 'A → B → C', 'B → C → A', 'C → A → B'], 'Bağımlılıklar bir çevrim oluşturur. Çevrimli bir yönlü grafiğin topolojik sıralaması yoktur.'],
  ['A cannot start until B finishes, B waits for C, and C waits for A. Which sequential execution order can finish all three?', ['No valid order exists', 'A → B → C', 'B → C → A', 'C → A → B'], 'The dependencies form a cycle. A directed graph containing a cycle has no topological ordering.']),
 q('08', ['Veri yapıları', 'Data structures'], 'Kolay',
  ['Bir min-heap 2, 4, 7 ve 9 değerlerini içeriyor. En küçük öğe çıkarılıp 3 ekleniyor. Yeni en küçük değer kaçtır?', ['3', '4', '2', '7'], '2 çıkarılınca 4, 7 ve 9 kalır. 3 eklendiğinde en küçük değer 3 olur.'],
  ['A min-heap contains 2, 4, 7, and 9. You remove the minimum and insert 3. What is the new minimum?', ['3', '4', '2', '7'], 'Removing 2 leaves 4, 7, and 9. Inserting 3 makes 3 the smallest value.']),
 q('09', ['Algoritmalar', 'Algorithms'], 'Orta',
  ['f(0) = 0 ve n > 0 için f(n) = f(n − 1) + n tanımlı. f(4) kaçtır?', ['10', '6', '16', '4'], 'f(4), 1 + 2 + 3 + 4 toplamıdır: 10.'],
  ['Let f(0) = 0 and f(n) = f(n − 1) + n for n > 0. What is f(4)?', ['10', '6', '16', '4'], 'f(4) adds 1 + 2 + 3 + 4, which equals 10.']),
 q('10', ['Algoritmalar', 'Algorithms'], 'Zor',
  ['Bir dizinin her alt dizisinin toplamını en fazla toplamla karşılaştırıyorsun. Sabit n için yalnız farklı, boş olmayan bitişik alt dizilerin sayısı nedir?', ['n(n + 1) / 2', 'n²', '2ⁿ', 'n(n − 1) / 2'], 'Başlangıç 0 için n, başlangıç 1 için n − 1 seçenek vardır. n + (n − 1) + … + 1 = n(n + 1)/2.'],
  ['You compare sums of every nonempty contiguous subarray of an array of length n. How many different subarrays are there?', ['n(n + 1) / 2', 'n²', '2ⁿ', 'n(n − 1) / 2'], 'There are n choices for the first starting position, then n − 1, down to 1. Their sum is n(n + 1)/2.']),
 q('11', ['SQL', 'SQL'], 'Zor',
  ['SQL üç değerli mantığında, tek satırın x değeri 2. WHERE x NOT IN (1, NULL) bu satırı döndürür mü?', ['Hayır; koşul UNKNOWN olur', 'Evet; 2 listedeki 1 değildir', 'Evet; NULL karşılaştırması TRUE olur', 'Hayır; sorgu sözdizimi hatası verir'], '2 = NULL karşılaştırması UNKNOWN olur. NOT IN sonucu da UNKNOWN kalır; WHERE yalnız TRUE olan satırları döndürür.'],
  ['Under SQL three-valued logic, a single row has x = 2. Does WHERE x NOT IN (1, NULL) return the row?', ['No; the condition is UNKNOWN', 'Yes; 2 differs from the listed 1', 'Yes; the NULL comparison is TRUE', 'No; the query has a syntax error'], 'Comparing 2 with NULL yields UNKNOWN. NOT IN remains UNKNOWN, and WHERE retains only TRUE rows.']),
 q('12', ['SQL', 'SQL'], 'Orta',
  ['Bir sütunun üç satırdaki değerleri 10, NULL, 10. COUNT(*) ve COUNT(sütun) sırasıyla kaçtır?', ['3 / 2', '2 / 3', '3 / 3', '2 / 2'], 'COUNT(*) tüm satırları sayar; COUNT(sütun) yalnız NULL olmayan değerleri sayar. Yinelenen 10 yine sayılır.'],
  ['A column contains three rows: 10, NULL, 10. What are COUNT(*) and COUNT(column), respectively?', ['3 / 2', '2 / 3', '3 / 3', '2 / 2'], 'COUNT(*) counts every row. COUNT(column) counts non-NULL values, including repeated 10s.']),
 q('13', ['SQL', 'SQL'], 'Orta',
  ['İki kullanıcı var. Birincinin iki siparişi, ikincinin hiç siparişi yok. Kullanıcılar siparişlere LEFT JOIN yapıldığında kaç satır çıkar?', ['3', '2', '4', '1'], 'İlk kullanıcı iki eşleşen satır üretir. İkinci kullanıcı, sipariş alanları NULL olan bir satırla korunur.'],
  ['There are two users. The first has two orders, and the second has none. How many rows result from users LEFT JOIN orders?', ['3', '2', '4', '1'], 'The first user produces two matching rows. The second is preserved as one row with NULL order fields.']),
 q('14', ['SQL', 'SQL'], 'Orta',
  ['Satışları mağazaya göre grupladın. Yalnız SUM(total) > 100 olan grupları tutmak için hangi SQL bölümü uygundur?', ['HAVING', 'WHERE', 'ORDER BY', 'DISTINCT'], 'HAVING gruplamadan sonra toplu sonuçları filtreler. WHERE, gruplama öncesindeki satırları filtreler.'],
  ['Sales have been grouped by store. Which SQL clause keeps only groups whose SUM(total) exceeds 100?', ['HAVING', 'WHERE', 'ORDER BY', 'DISTINCT'], 'HAVING filters aggregated groups. WHERE filters individual rows before grouping.']),
 q('15', ['SQL', 'SQL'], 'Orta',
  ['E-posta alanı NOT NULL. Eşzamanlı iki kayıt isteğinin aynı e-postayla iki kullanıcı oluşturmasını veritabanında ne engeller?', ['UNIQUE kısıtı', 'Sadece normal bir indeks', 'Önce SELECT ile kontrol', 'İstemcide boşluk kontrolü'], 'UNIQUE kısıtı, eşzamanlı yazmalarda da aynı değerin tekrarını engeller. Ayrı SELECT ve INSERT adımları yarışabilir.'],
  ['An email column is NOT NULL. What database mechanism prevents two concurrent signup requests from storing the same email?', ['A UNIQUE constraint', 'An ordinary nonunique index', 'A preliminary SELECT check', 'A client-side blank check'], 'A UNIQUE constraint enforces uniqueness during concurrent writes. Separate SELECT and INSERT steps can race.']),
 q('16', ['Veritabanları', 'Databases'], 'Orta',
  ['Bir para aktarımında borç yazıldıktan sonra alacak yazımı hata veriyor. Tek transaction içindeki iki yazımın da geri alınması hangi ACID özelliğidir?', ['Atomicity', 'Isolation', 'Durability', 'Consistency'], 'Atomicity, transaction içindeki değişikliklerin tamamının yapılmasını veya hiçbirinin kalmamasını sağlar.'],
  ['A transfer debits one account, but the credit write fails. Which ACID property makes a single transaction roll back both writes?', ['Atomicity', 'Isolation', 'Durability', 'Consistency'], 'Atomicity makes a transaction all-or-nothing: either all its changes commit or none remain.']),
 q('17', ['SQL', 'SQL'], 'Orta',
  ['En yeni created_at değerini; eşitse en büyük id değerini önce istiyorsun. id benzersiz. Hangi sıralama bunu her veri kümesinde sağlar?', ['created_at DESC, id DESC', 'id DESC, created_at DESC', 'created_at ASC, id DESC', 'created_at DESC, id ASC'], 'Önce zaman azalan sıralanır; yalnız eşit zamanlarda benzersiz id azalan sırayla bağlayıcı olur.'],
  ['You need newest created_at first, with the largest unique id first when timestamps tie. Which ordering guarantees this for any dataset?', ['created_at DESC, id DESC', 'id DESC, created_at DESC', 'created_at ASC, id DESC', 'created_at DESC, id ASC'], 'Timestamp must be the primary descending key. Descending unique id breaks only timestamp ties.']),
 q('18', ['SQL', 'SQL'], 'Zor',
  ['Tek siparişin total değeri 100 ve iki sipariş kalemi var. Siparişi kalemlerle JOIN edip SUM(orders.total) alırsan sonuç kaçtır?', ['200', '100', '50', '2'], 'JOIN, sipariş satırını her kalem için bir kez üretir. 100 değeri iki kez toplandığı için sonuç 200 olur.'],
  ['One order has total = 100 and two line items. After joining the order to its items, what is SUM(orders.total)?', ['200', '100', '50', '2'], 'The join repeats the order row once per item. Its total of 100 is summed twice, producing 200.']),
 q('19', ['Ağ', 'Networking'], 'Orta',
  ['Bir GET isteği If-None-Match ile önbellekteki ETag değerini gönderiyor. Kaynak değişmemiş. Sunucunun uygun yanıt kodu hangisidir?', ['304', '200', '204', '412'], '304 Not Modified, istemcinin önbellekteki gösterimi kullanabileceğini belirtir; gövde yeniden gönderilmez.'],
  ['A GET request sends its cached ETag in If-None-Match. The resource is unchanged. Which response code fits?', ['304', '200', '204', '412'], '304 Not Modified tells the client to reuse its cached representation without retransmitting the response body.']),
 q('20', ['Dağıtık sistemler', 'Distributed systems'], 'Orta',
  ['Ödeme POST isteği sunucuda işlendi, ama yanıt yolda kayboldu. Aynı işlemin yeniden denemede iki kez ücretlendirilmesini ne önler?', ['Aynı idempotency key ile yeniden deneme', 'Her denemede yeni işlem kimliği üretme', 'Timeout süresini tek başına kısaltma', 'Sonuç bilinmeden yeniden ücret yazma'], 'Sunucu aynı anahtarlı isteği aynı işleme bağlayıp önceki sonucu döndürebilir; yanıt kaybı ikinci bir ödeme oluşturmaz.'],
  ['A payment POST succeeds on the server, but its response is lost. What prevents a retry from charging the same operation twice?', ['Retrying with the same idempotency key', 'Generating a new operation ID per retry', 'Only reducing the request timeout', 'Charging again before checking the result'], 'The server can map repeated use of the same key to the existing operation and return its result instead of creating another charge.']),
 q('21', ['Ağ', 'Networking'], 'Orta',
  ['Bir DNS yanıtı 60 saniye TTL ile t = 0 anında önbelleğe alındı. Kayıt t = 10 anında değişiyor. Eski yanıt TTL bitene kadar kaç saniye daha kalabilir?', ['50', '10', '60', '0'], 'Süre ilk önbelleğe alma anından başlar. 60 − 10 = 50 saniye kalmıştır; kayıt değişikliği mevcut önbelleği kendiliğinden temizlemez.'],
  ['A DNS answer is cached at t = 0 with a 60-second TTL. The record changes at t = 10. How many more seconds may that cached answer remain before expiry?', ['50', '10', '60', '0'], 'Expiry is measured from caching time. There are 60 − 10 = 50 seconds left, and changing the record does not automatically purge this cache.']),
 q('22', ['Ağ', 'Networking'], 'Orta',
  ['TCP üzerinden iki ayrı uygulama mesajı gönderiyorsun. Alıcıda mesaj sınırlarını güvenilir biçimde nasıl bulursun?', ['Uzunluk alanı veya ayraç tanımlayarak', 'Her recv çağrısını bir mesaj sayarak', 'Her send çağrısının sınırına güvenerek', 'Paket boyutunu mesaj kimliği sayarak'], 'TCP sıralı bir byte akışıdır; uygulama mesaj sınırlarını taşımaz. Uzunluk öneki veya uygun bir ayraçla çerçeveleme gerekir.'],
  ['You send two application messages over TCP. How should the receiver reliably identify message boundaries?', ['Define a length field or delimiter', 'Treat each recv call as one message', 'Rely on the boundaries of send calls', 'Treat packet size as a message ID'], 'TCP provides an ordered byte stream, not application message boundaries. A length prefix or suitable delimiter supplies framing.']),
 q('23', ['Ağ', 'Networking'], 'Orta',
  ['Bir uygulama UDP ile numaralandırılmış üç datagram gönderiyor. Ek güvenilirlik katmanı yok. Alıcı hangi duruma hazır olmalıdır?', ['Kayıp, tekrar veya sıra değişimi', 'Yalnız gönderim sırasıyla teslim', 'Her datagramın tam bir kez teslimi', 'Eksik datagramın otomatik TCP tekrarı'], 'UDP teslimi, tekilliği veya sıralamayı garanti etmez. Gerekli güvenceleri uygulama veya üst katman sağlamalıdır.'],
  ['An application sends three numbered UDP datagrams with no added reliability layer. What must its receiver be prepared for?', ['Loss, duplicates, or reordering', 'Delivery only in the sending order', 'Exactly one delivery per datagram', 'Automatic TCP retries of missing data'], 'UDP does not guarantee delivery, uniqueness, or order. Required guarantees must come from the application or a higher layer.']),
 q('24', ['Ağ', 'Networking'], 'Orta',
  ['Bir IPv4 /24 alt ağında ağ ve broadcast adreslerini ayırıyorsun. Geleneksel host adresleri için kaç adres kalır?', ['254', '256', '255', '128'], '/24, host bölümü için 8 bit bırakır: 2⁸ = 256 adres. Ağ ve broadcast adresleri çıkarılınca 254 kalır.'],
  ['In an IPv4 /24 subnet, you reserve the network and broadcast addresses. How many conventional host addresses remain?', ['254', '256', '255', '128'], '/24 leaves 8 host bits, giving 2⁸ = 256 addresses. Reserving network and broadcast addresses leaves 254.']),
 q('25', ['Kod okuma', 'Code reading'], 'Kolay',
  ['Bu JavaScript kodu hangi metni yazdırır?', ['4, 6', '2, 4', '2, 3', '6'], 'map önce 2, 4, 6 üretir. filter yalnız 2’den büyük olan 4 ve 6 değerlerini tutar.'],
  ['What text does this JavaScript code print?', ['4, 6', '2, 4', '2, 3', '6'], 'map first produces 2, 4, 6. filter then keeps only 4 and 6, which are greater than 2.'],
  "console.log([1, 2, 3].map(n => n * 2).filter(n => n > 2).join(', '));"),
 q('26', ['Kod okuma', 'Code reading'], 'Orta',
  ['Bu JavaScript kodu hangi metni yazdırır? Döngü değişkeninin let ile tanımlandığına dikkat et.', ['0, 1, 2', '3, 3, 3', '1, 2, 3', '2, 2, 2'], 'let ile tanımlanan döngü değişkeni her tur için ayrı bağ oluşturur. Her fonksiyon kendi turundaki i değerini saklar.'],
  ['What text does this JavaScript code print? The loop variable is declared with let.', ['0, 1, 2', '3, 3, 3', '1, 2, 3', '2, 2, 2'], 'The let loop variable has a separate binding for each iteration. Each function captures its own iteration’s i.'],
  "const f = [];\nfor (let i = 0; i < 3; i++) f.push(() => i);\nconsole.log(f.map(fn => fn()).join(', '));"),
 q('27', ['Kod okuma', 'Code reading'], 'Orta',
  ['Bu JavaScript kodu hangi sayıyı yazdırır?', ['2', '1', '0', '3'], 'Nesne yayma işlemi sığ kopya oluşturur. a.user ve b.user aynı iç nesneyi gösterdiği için değişiklik a üzerinden de görünür.'],
  ['What number does this JavaScript code print?', ['2', '1', '0', '3'], 'Object spread makes a shallow copy. a.user and b.user refer to the same nested object, so the mutation is visible through a too.'],
  'const a = { user: { n: 1 } };\nconst b = { ...a };\nb.user.n = 2;\nconsole.log(a.user.n);'),
 q('28', ['Kod okuma', 'Code reading'], 'Orta',
  ['Bu JavaScript kodundaki üç çıktı hangi sırayla gelir?', ['A, C, B', 'A, B, C', 'B, A, C', 'C, A, B'], 'A ve C mevcut senkron akışta yazdırılır. Promise callback’i, bu akış bittikten sonra microtask olarak çalışır.'],
  ['In what order do the three outputs appear in this JavaScript code?', ['A, C, B', 'A, B, C', 'B, A, C', 'C, A, B'], 'A and C run in the current synchronous execution. The Promise callback runs as a microtask after that execution completes.'],
  "console.log('A');\nPromise.resolve().then(() => console.log('B'));\nconsole.log('C');"),
 q('29', ['Kod okuma', 'Code reading'], 'Kolay',
  ['JavaScript’te aşağıdaki iki karşılaştırmanın sonuçları sırasıyla nedir?', ['true / false', 'false / true', 'true / true', 'false / false'], '== gerektiğinde tür dönüşümü yapar; === tür dönüşümü yapmadığından sayı 0 ile metin 0 eşit değildir.'],
  ['In JavaScript, what are the results of these comparisons, respectively?', ['true / false', 'false / true', 'true / true', 'false / false'], '== can convert types. === does not convert types, so the number 0 and the string 0 are not strictly equal.'],
  "0 == '0'\n0 === '0'"),
 q('30', ['Kod okuma', 'Code reading'], 'Orta',
  ['Bu JavaScript kodu hangi iki sayıyı yazdırır?', ['5 / 0', '0 / 5', '5 / 5', '0 / 0'], '0 falsy olduğu için || sağdaki 5’i seçer. ?? yalnız null veya undefined için sağ tarafı seçtiğinden 0’ı korur.'],
  ['Which two numbers does this JavaScript code print?', ['5 / 0', '0 / 5', '5 / 5', '0 / 0'], '0 is falsy, so || selects 5. The ?? operator falls back only for null or undefined, preserving 0.'],
  'const x = 0;\nconsole.log(x || 5, x ?? 5);'),
 q('31', ['Kod okuma', 'Code reading'], 'Orta',
  ['Bu Python 3 kodunun çıktısı kaçtır?', ['30', '14', '25', '55'], 'range(1, 5), 1, 2, 3, 4 değerlerini üretir; 5 dahil değildir. Karelerinin toplamı 1 + 4 + 9 + 16 = 30 olur.'],
  ['What number does this Python 3 code print?', ['30', '14', '25', '55'], 'range(1, 5) produces 1, 2, 3, 4 and excludes 5. Their squares add to 1 + 4 + 9 + 16 = 30.'],
  'print(sum(x * x for x in range(1, 5)))'),
 q('32', ['Kod okuma', 'Code reading'], 'Zor',
  ['Bu JavaScript kodu hangi metni yazdırır? sort için karşılaştırma fonksiyonu verilmedi.', ['1, 10, 2', '1, 2, 10', '2, 1, 10', '10, 2, 1'], 'JavaScript’in varsayılan sort işlemi değerlerin metin gösterimini karşılaştırır. Metin olarak 10, 2’den önce gelir.'],
  ['What text does this JavaScript code print? No comparator is supplied to sort.', ['1, 10, 2', '1, 2, 10', '2, 1, 10', '10, 2, 1'], 'JavaScript’s default sort compares string representations. As text, 10 comes before 2.'],
  "console.log([2, 10, 1].sort().join(', '));"),
 q('33', ['Güvenlik', 'Security'], 'Orta',
  ['Arama metni doğrudan SQL sorgusuna ekleniyor. Kullanıcı girdisinin sorgu mantığına dönüşmesini en doğrudan ne engeller?', ['Parametreli sorgu kullanmak', 'Yalnız tek tırnakları girdiden silmek', 'SQL anahtar sözcüklerini engellemek', 'Girdiye yalnız URL encoding uygulamak'], 'Parametre bağlama, kullanıcı verisini SQL komutundan ayrı taşır; veri sorgu sözdizimi olarak yorumlanmaz.'],
  ['Search text is concatenated into an SQL query. What most directly stops user input from becoming query logic?', ['Use a parameterized query', 'Remove only single quotes from the input', 'Block SQL keywords found in the input', 'Apply only URL encoding to the input'], 'Parameter binding keeps user data separate from the SQL command, so it is not interpreted as query syntax.']),
 q('34', ['Güvenlik', 'Security'], 'Orta',
  ['İki kullanıcı aynı parolayı seçiyor. Her parola, aynı hash algoritmasıyla ama farklı rastgele salt ile işleniyor. Beklenen özellik hangisidir?', ['Saklanan hash değerleri farklı olur', 'Hash değerleri zorunlu olarak aynı olur', 'Salt parolanın düz metnini geri verir', 'Salt hash kontrolünü gereksiz kılar'], 'Farklı salt değerleri aynı parolayı farklı girdilere dönüştürür. Bu, ortak hash ve önceden hesaplanmış tablo saldırılarını zorlaştırır.'],
  ['Two users choose the same password. The same password-hashing algorithm processes each with a different random salt. What is the expected property?', ['Their stored hash values differ', 'Their hash values must be identical', 'The salt recovers the plaintext password', 'The salt removes the need to verify hashes'], 'Different salts produce different inputs for the same password, frustrating shared-hash comparisons and precomputed lookup attacks.']),
 q('35', ['Güvenlik', 'Security'], 'Orta',
  ['Kullanıcı URL’deki belge ID’sini değiştirip başka birinin belgesini okuyabiliyor. Sunucuda hangi kontrol eksiktir?', ['İstenen belgeye erişim yetkisi', 'Yalnız oturumun geçerli olması', 'Belge ID’sinin tahmin edilememesi', 'Yalnız arayüzde sahiplik kontrolü'], 'Kimlik doğrulama tek başına yeterli değildir. Sunucu, her nesne isteğinde o kullanıcının nesneye yetkisini de doğrulamalıdır.'],
  ['A user changes a document ID in the URL and can read someone else’s document. What server-side check is missing?', ['Authorization for the requested document', 'Only checking that the session is valid', 'Only making document IDs unpredictable', 'Checking ownership only in the interface'], 'Authentication alone is insufficient. The server must also authorize this user’s access to the specific object on each request.']),
 q('36', ['Web güvenliği', 'Web security'], 'Zor',
  ['Oturum cookie’siyle yetkilenen bir siteye başka siteden form gönderilebiliyor. Durum değiştiren istekte hangi önlem CSRF’yi doğrudan hedefler?', ['Sunucuda doğrulanan CSRF tokenı', 'Yalnız HttpOnly cookie ayarı', 'Yalnız HTTPS bağlantısı', 'Yalnız CORS yanıt başlığı'], 'Saldırganın üretemediği ve sunucunun doğruladığı CSRF tokenı isteği bağlar. HttpOnly veya TLS, tarayıcının cookie ile istek göndermesini tek başına önlemez.'],
  ['A site authenticates with session cookies, and another site can submit a form to it. Which measure directly targets CSRF on a state-changing request?', ['A server-validated CSRF token', 'Only an HttpOnly cookie setting', 'Only using an HTTPS connection', 'Only adding a CORS response header'], 'A validated CSRF token binds the request to a value the attacker cannot supply. HttpOnly or TLS alone does not stop the browser from sending a request with cookies.']),
 q('37', ['Web güvenliği', 'Web security'], 'Orta',
  ['Kullanıcı yorumunu HTML olarak çalıştırmadan, olduğu gibi metin olarak bir DOM öğesine yerleştireceksin. Hangi atama uygundur?', ['element.textContent = comment', 'element.innerHTML = comment', 'element.outerHTML = comment', 'document.write(comment)'], 'textContent girdiyi metin düğümü olarak kullanır. Diğer işlemler girdiyi HTML olarak yorumlayabilir.'],
  ['You must place a user comment into a DOM element as literal text without interpreting it as HTML. Which assignment fits?', ['element.textContent = comment', 'element.innerHTML = comment', 'element.outerHTML = comment', 'document.write(comment)'], 'textContent treats the input as text. The other operations can interpret the input as HTML.']),
 q('38', ['Güvenlik', 'Security'], 'Kolay',
  ['Bir rapor servisi veritabanından yalnız SELECT çalıştırıyor. Hata veya ele geçirilme etkisini azaltmak için hangi yetki en uygundur?', ['Yalnız gereken tablolarda okuma', 'Veritabanında tüm yönetici hakları', 'Şemaların sahipliği ve silme hakkı', 'Tüm kullanıcılara yetki verme hakkı'], 'En az yetki ilkesi, servise yalnız işi için gereken erişimi verir. Okuma yapan servisin yazma veya yönetim yetkisine ihtiyacı yoktur.'],
  ['A reporting service only runs SELECT queries. Which permission best limits the damage of a bug or compromise?', ['Read access to required tables only', 'Full database administrator rights', 'Ownership and deletion of all schemas', 'Permission to grant rights to all users'], 'Least privilege grants only the access needed for the task. A reporting reader does not need write or administration rights.']),
 q('39', ['Eşzamanlılık', 'Concurrency'], 'Orta',
  ['Sayaç 0. İki thread de kilitsiz olarak 0 okuyor, 1 ekliyor ve sonucu yazıyor. İkisi bittikten sonra sayaç hangi değerle kalabilir?', ['1', '2', '0', '−1'], 'İki thread de okuduğu 0’dan 1 hesaplar. Son yazan diğerinin sonucunu ezer; bir artış kaybolur.'],
  ['A counter starts at 0. Two threads both read 0 without locking, add 1, and write their result. What value can remain after both finish?', ['1', '2', '0', '−1'], 'Both threads compute 1 from the value 0 they read. The later write overwrites the earlier result, losing one increment.']),
 q('40', ['Eşzamanlılık', 'Concurrency'], 'Orta',
  ['İki thread’in de A ve B kilitlerine ihtiyacı var. Kilitler için döngüsel beklemeyi hangi ortak kural ortadan kaldırır?', ['Daima A’yı, sonra B’yi almak', 'Her thread’de ters sırayla almak', 'Yalnız kilit bırakma sırasını sabitlemek', 'Her kilidi ayrı ayrı atomik olarak almak'], 'Tüm katılımcılar aynı kilit sırasını izlerse biri A’yı, diğeri B’yi tutup karşılıklı bekleyen bir çevrim oluşmaz.'],
  ['Two threads both need locks A and B. Which shared rule eliminates a circular wait involving these locks?', ['Always acquire A before B', 'Use opposite orders in the two threads', 'Fix only the order in which locks are released', 'Acquire each individual lock atomically'], 'A consistent acquisition order prevents one thread from holding A while another holds B and each waits for the other.']),
 q('41', ['Eşzamanlılık', 'Concurrency'], 'Zor',
  ['İstemci version = 7 kaydını okudu. UPDATE ... WHERE version = 7, başka bir yazım nedeniyle 0 satır etkiledi. Güvenli sonraki adım nedir?', ['Güncel veriyi okuyup işlemi yeniden değerlendirmek', 'İlk yazım başarılıymış gibi devam etmek', 'Sürüm koşulunu kaldırıp eski veriyi yazmak', 'Etkilenen satır sayısını tamamen yok saymak'], '0 satır, beklenen sürümün artık eşleşmediğini gösterir. Güncel veriyle yeniden değerlendirmek, başka yazımı körlemesine ezmeyi önler.'],
  ['A client read version = 7. Its UPDATE ... WHERE version = 7 affects zero rows because another write occurred. What is the safe next step?', ['Read current data and reconsider the operation', 'Continue as though the original write succeeded', 'Remove the version check and write stale data', 'Ignore the affected-row count entirely'], 'Zero affected rows indicates that the expected version no longer matches. Reconsidering with current data avoids blindly overwriting another change.']),
 q('42', ['Eşzamanlılık', 'Concurrency'], 'Kolay',
  ['Başlangıç değeri 3 olan semaphore, görev başına bir izin veriyor. Yedi görev aynı anda bekliyor. Kritik alanda en fazla kaçı birlikte çalışabilir?', ['3', '7', '1', '21'], 'Semaphore’da üç izin vardır. İzin tutan her görev çıkışta izni iade edene kadar yalnız üç görev içeri girebilir.'],
  ['A semaphore starts with 3 permits, and each task needs one. Seven tasks are waiting. What is the maximum number simultaneously inside the protected area?', ['3', '7', '1', '21'], 'Only three permits exist. At most three tasks can hold them until a task exits and releases its permit.']),
 q('43', ['Eşzamanlılık', 'Concurrency'], 'Zor',
  ['Stok 1. İki eşzamanlı satışın stok değerini negatife indirmesini tek bir veritabanı yazımıyla nasıl önlersin?', ['UPDATE ... SET stock = stock - 1 WHERE stock > 0', 'Önce SELECT, sonra koşulsuz UPDATE yapmak', 'Yalnız arayüzde stock > 0 kontrolü yapmak', 'Her isteği aynı sabit süre geciktirmek'], 'Koşullu atomik UPDATE, kontrol ile azaltmayı aynı işlemde yapar. Başarı için etkilenen satır sayısı da kontrol edilmelidir.'],
  ['Stock is 1. How can a single database write prevent two concurrent sales from reducing it below zero?', ['UPDATE ... SET stock = stock - 1 WHERE stock > 0', 'Run SELECT before an unconditional UPDATE', 'Check stock > 0 only in the user interface', 'Delay every request by the same fixed time'], 'An atomic conditional UPDATE combines the check and decrement. The caller must also check the number of affected rows to know whether it succeeded.']),
 q('44', ['Test', 'Testing'], 'Kolay',
  ['Yaş ≥ 18 kuralında eşik çevresindeki davranışı doğrudan sınamak için hangi üçlü en uygundur?', ['17, 18, 19', '0, 9, 30', '1, 10, 40', '20, 30, 40'], '17, 18 ve 19 değerleri sınırın hemen altını, kendisini ve hemen üstünü sınar.'],
  ['For an age ≥ 18 rule, which set most directly tests behavior around the threshold?', ['17, 18, 19', '0, 9, 30', '1, 10, 40', '20, 30, 40'], '17, 18, and 19 exercise the value immediately below the boundary, the boundary itself, and the value immediately above it.']),
 q('45', ['Test', 'Testing'], 'Zor',
  ['Bir sıralama fonksiyonunu farklı rastgele girdilerle sınayacaksın. Hangisi her doğru sonuçta korunması gereken bir özelliktir?', ['Öğe çokluğu aynı, sıra azalmayan olmalı', 'İlk çıktı öğesi ilk girdi öğesi olmalı', 'Eşit öğeler sonuçtan tamamen silinmeli', 'Çıktı uzunluğu her zaman artmalı'], 'Doğru bir sıralama, yinelenenler dahil aynı öğeleri korur ve istenen sıralama düzenini sağlar. Yalnız uzunluğu kontrol etmek yeterli değildir.'],
  ['You test a sorting function with many random inputs. Which property must hold for every correct result?', ['Same item multiplicities and nondecreasing order', 'First output item must equal the first input item', 'All repeated items must be removed from the result', 'The output must always be longer than the input'], 'A correct sort preserves the same items, including duplicates, and establishes the requested order. Checking length alone is insufficient.']),
 q('46', ['Test', 'Testing'], 'Orta',
  ['age >= 18 koşulu yanlışlıkla age > 18 yapıldı. Tek bir yaş girdisiyle bu hatayı hangisi yakalar?', ['18', '17', '19', '20'], 'İki koşul yalnız age = 18 için farklı sonuç verir. Sınır değeri bu değişikliği doğrudan yakalar.'],
  ['The condition age >= 18 is accidentally changed to age > 18. Which single age input detects the change?', ['18', '17', '19', '20'], 'The two conditions disagree only at age = 18. Testing that boundary directly detects the mutation.']),
 q('47', ['Test', 'Testing'], 'Orta',
  ['Token tam 60 saniye sonra geçersiz oluyor. Gerçek süre beklemeden sınır anını tekrarlanabilir biçimde test etmek için ne yaparsın?', ['Saati bağımlılık olarak verip testte ilerletmek', 'Her testte gerçek 60 saniye uyumak', 'Başarısız testi sonuç değişene dek yinelemek', 'Süreye bağlı tüm kontrolleri kaldırmak'], 'Kontrol edilebilir saat, sınırın öncesini ve sonrasını deterministik biçimde üretir. Uyuma ve yeniden deneme zamanlama belirsizliğini çözmez.'],
  ['A token expires after exactly 60 seconds. How can you test the boundary reproducibly without waiting in real time?', ['Inject a clock and advance it in the test', 'Sleep for 60 real seconds in every test', 'Rerun failures until their outcome changes', 'Remove every time-dependent assertion'], 'A controlled clock deterministically produces times before and after the boundary. Sleeping and retries do not remove timing uncertainty.']),
 q('48', ['Test', 'Testing'], 'Orta',
  ['if (A && B) için yalnız if ifadesinin doğru ve yanlış dallarını en az bir kez çalıştırmak istiyorsun. En az kaç test gerekir?', ['2', '1', '3', '4'], 'A ve B doğruyken doğru dal çalışır. A yanlışken yanlış dal çalışır. Bu iki test dal kapsamı için yeterlidir; koşul kapsamı ayrı bir ölçüttür.'],
  ['For if (A && B), you only need to execute the if statement’s true and false branches at least once. What is the minimum number of tests?', ['2', '1', '3', '4'], 'Both inputs true execute the true branch; A false executes the false branch. These two tests cover the statement’s branches, not every condition combination.']),
 q('49', ['Yazılım tasarımı', 'Software design'], 'Orta',
  ['Kapasitesi 2 olan boş bir LRU cache’e sırayla A ve B ekleniyor, A okunuyor, sonra C ekleniyor. Hangisi atılır?', ['B', 'A', 'C', 'Hiçbiri'], 'A son okunan öğe olduğu için güncellenir. En uzun süredir kullanılmayan B, C için yer açmak üzere atılır.'],
  ['An empty LRU cache has capacity 2. You insert A, insert B, read A, then insert C. What is evicted?', ['B', 'A', 'C', 'Nothing'], 'Reading A makes it the most recently used item. B is least recently used and is evicted to make room for C.']),
 q('50', ['Yazılım tasarımı', 'Software design'], 'Zor',
  ['Sipariş kaydı DB’ye yazıldıktan sonra süreç çökünce kuyruk mesajı kayboluyor. Transactional outbox bu boşluğu nasıl kapatır?', ['Olayı siparişle aynı DB transaction’ına yazar', 'Mesajı DB yazımından önce koşulsuz gönderir', 'DB başarısından sonra mesaj hatasını yok sayar', 'Bellekteki mesajı süreç sonlanana dek saklar'], 'Sipariş ve outbox kaydı birlikte commit olur. Ayrı bir yayıncı outbox’tan tekrar deneyerek mesajı gönderebilir; tüketici tekrarları yönetmelidir.'],
  ['A process crashes after saving an order to the database but before sending its queue message. How does a transactional outbox close this gap?', ['Save the event in the same DB transaction as the order', 'Always send the message before writing the database', 'Ignore messaging errors after the database succeeds', 'Keep the message only in memory until process exit'], 'The order and outbox entry commit together. A separate publisher can retry delivery from the outbox; consumers must still handle duplicates.']),
 q('51', ['Yazılım tasarımı', 'Software design'], 'Orta',
  ['Aynı olayı hem faturalama hem analitik servisi ayrı ayrı almalı. Hangi yayın düzeni, tüketicilerin tek mesajı paylaşmak için yarışmasını önler?', ['Her servis için ayrı abonelik', 'İki servise tek ortak iş kuyruğu', 'İki servise aynı consumer group', 'Mesajları servislere round-robin dağıtmak'], 'Bağımsız abonelikler her servise olayın kendi kopyasını verir. Ortak iş kuyruğu ise işi tüketiciler arasında paylaştırır.'],
  ['Both billing and analytics must independently receive each event. Which setup avoids making them compete for one shared delivery?', ['A separate subscription for each service', 'One shared work queue for both services', 'One shared consumer group for both services', 'Deliver messages round-robin across services'], 'Independent subscriptions give each service its own copy. A shared work queue distributes work among competing consumers instead.']),
 q('52', ['Yazılım tasarımı', 'Software design'], 'Kolay',
  ['Aşağıdaki işlemlerden hangisini aynı girdilerle tekrar etmek, kendi başına son durumu yeniden değiştirmez?', ['Durumu CLOSED olarak ayarlamak', 'Bakiyeye 10 eklemek', 'Liste sonuna kayıt eklemek', 'Yeni bir e-posta göndermek'], 'Bir alanı aynı sabit değere tekrar ayarlamak idempotenttir. Artış, ekleme ve gönderim yeniden çalışınca ek etki oluşturur.'],
  ['Which operation, repeated with the same inputs, does not itself change the final state again?', ['Set status to CLOSED', 'Add 10 to the balance', 'Append a record to a list', 'Send a new email'], 'Setting a field to the same fixed value is idempotent. Incrementing, appending, and sending create another effect when repeated.']),
 q('53', ['Olasılık', 'Probability'], 'Orta',
  ['Adil bir para iki bağımsız kez atılıyor. En az bir kez yazı gelme olasılığı nedir?', ['3/4', '1/2', '1/4', '1'], 'Dört eş olasılıklı sonuçtan yalnız iki turun da tura olduğu sonuç dışarıda kalır. Olasılık 1 − 1/4 = 3/4’tür.'],
  ['A fair coin is tossed twice independently. What is the probability of at least one head?', ['3/4', '1/2', '1/4', '1'], 'Of four equally likely outcomes, only two tails is excluded. The probability is 1 − 1/4 = 3/4.']),
 q('54', ['Olasılık', 'Probability'], 'Orta',
  ['Bir torbada 2 kırmızı, 1 mavi top var. Geri koymadan rastgele iki top seçiliyor. İkisinin de kırmızı olma olasılığı nedir?', ['1/3', '2/3', '1/2', '2/9'], 'İlk topun kırmızı olma olasılığı 2/3, ardından diğer kırmızının seçilme olasılığı 1/2’dir. Çarpımları 1/3 olur.'],
  ['A bag contains 2 red balls and 1 blue ball. Two balls are drawn uniformly without replacement. What is the probability that both are red?', ['1/3', '2/3', '1/2', '2/9'], 'The first draw is red with probability 2/3. The remaining red is then drawn with probability 1/2, giving 1/3 overall.']),
 q('55', ['Olasılık', 'Probability'], 'Orta',
  ['Bir istekte iki bağımsız cache’in hit olasılıkları %80 ve %50. İkisinin de miss olması olasılığı nedir?', ['10%', '20%', '40%', '60%'], 'Bağımsız miss olasılıkları %20 ve %50’dir. 0,2 × 0,5 = 0,1, yani %10 olur.'],
  ['For one request, two independent caches have hit probabilities of 80% and 50%. What is the probability that both miss?', ['10%', '20%', '40%', '60%'], 'Their independent miss probabilities are 20% and 50%. Multiplying 0.2 × 0.5 gives 0.1, or 10%.']),
 q('56', ['Olasılık', 'Probability'], 'Zor',
  ['Her denemenin bağımsız hata olasılığı 1/4. En fazla iki denemede en az bir başarı olasılığı nedir?', ['15/16', '3/4', '1/16', '1/2'], 'İki denemenin de hata vermesi 1/4 × 1/4 = 1/16 olasılıklıdır. En az bir başarı bunun tümleyeni olan 15/16’dır.'],
  ['Each attempt independently fails with probability 1/4. What is the probability of at least one success within two attempts?', ['15/16', '3/4', '1/16', '1/2'], 'Both attempts fail with probability 1/4 × 1/4 = 1/16. At least one success is the complement, 15/16.']),
 q('57', ['Bitler ve mantık', 'Bits and logic'], 'Orta',
  ['İzin bitleri: okuma = 1, yazma = 2, çalıştırma = 4. Değeri 5 olan izin maskesi hangilerini içerir?', ['Okuma ve çalıştırma', 'Okuma ve yazma', 'Yazma ve çalıştırma', 'Yalnız yazma'], '5 = 1 OR 4 olduğundan okuma ve çalıştırma bitleri açıktır; yazma biti kapalıdır.'],
  ['Permission bits are read = 1, write = 2, execute = 4. Which permissions does the mask value 5 contain?', ['Read and execute', 'Read and write', 'Write and execute', 'Write only'], '5 = 1 OR 4, so the read and execute bits are set while the write bit is clear.']),
 q('58', ['Bitler ve mantık', 'Bits and logic'], 'Orta',
  ['8 bit two’s complement gösteriminde 11111110 hangi ondalık tamsayıdır?', ['−2', '254', '−1', '2'], 'En yüksek bitin ağırlığı −128’dir. Diğer açık bitlerin toplamı 126 olduğundan değer −128 + 126 = −2 olur.'],
  ['What signed decimal integer does 11111110 represent in 8-bit two’s complement?', ['−2', '254', '−1', '2'], 'The most significant bit has weight −128. The other set bits total 126, so the value is −128 + 126 = −2.']),
 q('59', ['Bitler ve mantık', 'Bits and logic'], 'Orta',
  ['10010000 adlı 8 bit değer, soldan sıfır doldurarak iki bit sağa kaydırılıyor. Sonuç hangisidir?', ['00100100', '11100100', '01000000', '01001000'], 'Mantıksal sağa kaydırma her adımda sola sıfır koyar: 10010000 → 01001000 → 00100100.'],
  ['The 8-bit value 10010000 is shifted right by two bits, filling from the left with zeros. What is the result?', ['00100100', '11100100', '01000000', '01001000'], 'Logical right shift inserts a zero on each step: 10010000 → 01001000 → 00100100.']),
 q('60', ['Bitler ve mantık', 'Bits and logic'], 'Orta',
  ['A ve B boolean değerler. (A VE B) VEYA (DEĞİL A VE B) ifadesi hangisine eşdeğerdir?', ['B', 'A', 'A VEYA B', 'A VE B'], 'B ortak alınır: B VE (A VEYA DEĞİL A). Parantez her zaman doğru olduğundan sonuç B’dir.'],
  ['A and B are boolean values. What is (A AND B) OR (NOT A AND B) equivalent to?', ['B', 'A', 'A OR B', 'A AND B'], 'Factor out B to obtain B AND (A OR NOT A). The parenthesized expression is always true, leaving B.']),
];

const bilingualRows = [...rows, ...aiCloudQuizRows];
const turkishExtras = [...turkishQuizExtraA, ...turkishQuizExtraB];
const normalized = value => value.normalize('NFC').replace(/\s+/g, ' ').trim().toLocaleLowerCase('tr');
const canonicalTexts = new Map();
for (const row of bilingualRows) {
 for (const locale of [row.tr, row.en]) {
  const key = normalized(locale[0]);
  const entries = canonicalTexts.get(key) || [];
  entries.push({ answer: locale[1][0], text: row.en[0] });
  canonicalTexts.set(key, entries);
 }
}
for (const [, , , text, options] of turkishExtras) {
 const key = normalized(text);
 const entries = canonicalTexts.get(key) || [];
 entries.push({ answer: options[0], text });
 canonicalTexts.set(key, entries);
}

export function quizPoolForLanguage(language = 'en') {
 if (language !== 'tr' && language !== 'en') throw new Error('Soru dili için Türkçe veya English seç.');
 const localeIndex = language === 'tr' ? 0 : 1;
 const questions = rows.map(row => {
  const [text, options, explanation] = row[language];
  return {
   id: row.id, letter: '?', category: row.category[localeIndex], text,
   answer: options[0], explanation, code: row.code, difficulty: row.difficulty,
   points: 100, penalty: row.difficulty === 'Zor' ? 50 : row.difficulty === 'Orta' ? 30 : 25,
   multiplier: row.difficulty === 'Zor' ? 2 : row.difficulty === 'Orta' ? 1.5 : 1,
   choices: options.map((option, index) => ({ id: `${row.id}-choice-${index + 1}`, text: option })),
  };
 });
 if (language === 'tr') {
  for (const [slug, category, difficulty, text, options, explanation, code = ''] of turkishExtras) {
   const id = `quiz-tr-${slug}`;
   questions.push({
    id, letter: '?', category, difficulty, text, answer: options[0], explanation, code,
    points: 100, penalty: difficulty === 'Zor' ? 50 : difficulty === 'Orta' ? 30 : 25,
    multiplier: difficulty === 'Zor' ? 2 : difficulty === 'Orta' ? 1.5 : 1,
    choices: options.map((option, index) => ({ id: `${id}-choice-${index + 1}`, text: option })),
   });
  }
 }
 for (const row of aiCloudQuizRows) {
  const [text, options, explanation] = row[language];
  questions.push({
   id: row.id, letter: '?', category: row.category[localeIndex], text,
   answer: options[0], explanation, code: row.code, difficulty: row.difficulty,
   points: 100, penalty: row.difficulty === 'Zor' ? 50 : row.difficulty === 'Orta' ? 30 : 25,
   multiplier: row.difficulty === 'Zor' ? 2 : row.difficulty === 'Orta' ? 1.5 : 1,
   choices: options.map((option, index) => ({ id: `${row.id}-choice-${index + 1}`, text: option })),
  });
 }
 return questions;
}

// Only authored prompt + exact answer pairs share their canonical identity.
// The original bilingual rows use English text; Turkish-only additions use theirs.
// Edited prompts or answers remain custom questions instead of inheriting IDs.
export function canonicalQuizText(text, answer) {
 if (typeof text !== 'string' || typeof answer !== 'string') return undefined;
 return canonicalTexts.get(normalized(text))?.find(entry => entry.answer === answer)?.text;
}
