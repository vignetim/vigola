// The first row in each group is the base question; the next ten follow
// question-variants.mjs order. Canonical answers and letters stay unchanged.
const groups = {
 A: `
Bir hava durumu uygulaması, başka bir servisten belgelenmiş bir arayüz üzerinden tahmin istiyor. Bu arayüzün üç harfli adı nedir?|API, yazılım bileşenlerinin birbirinden nasıl veri veya işlem isteyebileceğini tanımlar.
Bir transaction üç satır yazacakken son yazma işlemi hata veriyor. Ya tüm işlemlerin tamamlanmasını ya da hiçbirinin uygulanmamasını hangi ACID özelliği sağlar?|Atomicity, transaction içindeki işlemlerin bir bütün olarak başarılı veya başarısız olmasını sağlar.
Promise kullanan JavaScript kodunu, sırayla çalışan ifadeler gibi yazmamızı sağlayan iki anahtar kelime hangileridir?|async fonksiyon bir Promise döndürür; await ise fonksiyonun devamını beklenen sonuca kadar erteler.
Bir giriş sistemi, girilen parolanın belirtilen kullanıcıya ait olup olmadığını kontrol ediyor. Kullanıcının kimliğini doğrulayan bu sürece ne denir?|Authentication, bir kullanıcı veya sistemin iddia ettiği kimliğe sahip olup olmadığını doğrular.
Oturum açmış bir kullanıcı belgeyi okuyabiliyor ama silemiyor. Hangi işlemleri yapabileceğini belirleyen güvenlik süreci nedir?|Authorization, kimliği bilinen bir kullanıcı veya sisteme hangi işlemler için izin verildiğini belirler.
Eski bir ödeme istemcisinin arayüzü uygulamanıza uymuyor. Onu beklenen arayüzle sarmalayarak kullanmanızı sağlayan tasarım deseni hangisidir?|Adapter, mevcut bir bileşenin arayüzünü çağıranın beklediği arayüze dönüştürür.
Bir JavaScript koleksiyonundaki değerlere items[0] ve items[1] ile erişiyorsunuz. Bu yerleşik koleksiyonun adı nedir?|Array, elemanları sıralı biçimde tutar ve onlara index üzerinden erişilmesini sağlar.
Bir compiler, kaynak kodu ifade ve komutları temsil eden düğümlerden oluşan bir ağaca dönüştürüyor. Bu gösterimin adı nedir?|Abstract syntax tree, kaynak kodun tüm yazım ayrıntılarını taşımadan programın yapısını temsil eder.
Bir test, hesaplanan değer beklenen değerden farklıysa başarısız oluyor. Beklentiyi sınayan bu kontrole ne denir?|Assertion, testin geçmesi için sağlanması gereken koşulu belirtir.
Bir depolama sistemi yeni event kayıtlarını listenin sonuna ekliyor, önceki kayıtları değiştirmiyor. Bu kayıt yapısının adı nedir?|Append-only log, yeni kayıtları sona ekleyerek sıralı bir geçmiş tutar.
Bir array büyütülürken yüksek maliyet oluşuyor; buna rağmen peş peşe yapılan çok sayıda eklemenin işlem başına maliyeti düşük kalıyor. Maliyeti işlem dizisine yayan analiz hangisidir?|Amortized analysis, tek bir işlemin en kötü maliyeti yerine bir işlem dizisinin toplam maliyetini inceler.
`,
 B: `
Sıralı bir listede ortadaki elemana bakıp her adımda kalan adayların yarısını eliyorsunuz. Hangi arama algoritmasını kullanıyorsunuz?|Binary search, arama aralığını her adımda yarıya indirir ve O(log n) karşılaştırmayla çalışır.
Ağırlıksız bir graph üzerinde, iki adım uzaktaki düğümlere geçmeden önce bir adım uzaktaki tüm komşuları geziyorsunuz. Bu dolaşım algoritması hangisidir?|Breadth-first search, düğümleri başlangıca olan uzaklık sırasıyla gezer; genellikle bir queue kullanır.
Bir consumer, gelen mesajları yeterince hızlı işleyemiyor ve producer'dan yavaşlamasını istiyor. Bu akış kontrolüne ne denir?|Backpressure, üretim veya gönderim hızını veriyi işleyecek tarafın kapasitesine göre sınırlar.
İki production ortamı hazır tutuluyor ve trafik eski sürümden tamamen hazırlanmış yeni sürüme aktarılıyor. Bu deployment stratejisi hangisidir?|Blue-green deployment, eski ve yeni sürümü ayrı ortamlarda tutarak trafiğin aralarında geçirilmesini sağlar.
Bir üyelik kontrolü, bir eleman için kesinlikle yok veya muhtemelen var diyebiliyor; false positive üretebiliyor. Bu olasılıksal veri yapısı hangisidir?|Standart Bloom filter, daha az bellek karşılığında false positive üretebilir; false negative üretmez.
Debugger'ın şüpheli bir satır çalışmadan hemen önce durmasını istiyorsunuz. O satıra koyduğunuz işaretin adı nedir?|Breakpoint, çalışma anındaki durumu incelemek ve kodu adım adım ilerletmek için yürütmeyi durdurur.
Bir değişken yalnızca true veya false değeri alabiliyor. Bu veri türünün adı nedir?|Boolean, mantıksal doğru ve yanlış değerlerini temsil eder.
Bir algoritmanın kaynak kullanımının girdiyle birlikte nasıl büyüdüğüne asimptotik üst sınır koyan O(n) gibi gösterimlere ne denir?|Big O, sabit çarpanları göz ardı ederek büyüme hızına üst sınır belirtir.
Bir job, kayıtları geldikleri anda tek tek işlemek yerine biriktirip topluca işliyor. Bu yaklaşımın adı nedir?|Batch processing, biriken işleri grup halinde işler; çoğu zaman belirli bir takvime göre çalışır.
Bir database index yapısında, her düğümün birden fazla anahtar ve alt düğüm tutabildiği dengeli bir arama ağacı kullanılıyor. Bu ağaç ailesi hangisidir?|B-tree, ağacın yüksekliğini azaltır ve veriyi bloklar halinde okuyan depolama sistemlerine uygundur.
Ağdan gelen byte'lar, uygulama onları işlemeye hazır olana kadar geçici bir alanda bekletiliyor. Bu alanın adı nedir?|Buffer, farklı hızlarda çalışan bileşenler arasında veriyi geçici olarak tutar.
`,
 C: `
Bir uygulama, maliyetli bir sorgunun sonucunu sonraki istekte tekrar kullanmak üzere geçici olarak saklıyor. Bu saklama alanının adı nedir?|Cache, daha önce alınan veya hesaplanan veriyi yeniden kullanır; expiration ve invalidation kuralları verinin güncelliğini yönetir.
Bir fonksiyonun döndürdüğü başka bir fonksiyon, dış fonksiyonun çalışması bittikten sonra da onun yerel değişkenini okuyabiliyor. Bunu sağlayan yapı nedir?|Closure, bir fonksiyonun tanımlandığı lexical scope içindeki değişkenlere erişimini korur.
Bir servis, art arda hata veren bağımlılığına çağrı göndermeyi bir süre durduruyor; sonra düzelip düzelmediğini deniyor. Bu tasarım deseni hangisidir?|Circuit breaker, bağımlılığın toparlanmasına fırsat verirken başarısız çağrıların tekrarlanmasını azaltır.
Browser, başka bir origin'den gelen API yanıtını JavaScript'e açmadan önce response header'larını kontrol ediyor. Bu erişimi yöneten dört harfli mekanizma nedir?|CORS, server'ın hangi origin'lerin yanıtı okuyabileceğini browser'a bildirmesini sağlar.
Bir saldırgan, oturum açmış kullanıcının browser'ına başka bir siteye istenmeyen bir authenticated request göndertiyor. Bu saldırının kısaltması nedir?|CSRF, browser'ın otomatik eklediği oturum bilgilerini kötüye kullanarak kullanıcının istemediği bir işlemi yaptırır.
Statik dosyalar, kullanıcılara yakın konumdaki farklı edge sunucularından gönderiliyor. Bu dağıtım yapısının üç harfli adı nedir?|CDN, içeriği farklı bölgelerdeki edge sunucularında cache'leyerek kullanıcılara ulaştırır.
İndirilen bir dosyada aktarım sırasında bozulma olup olmadığını anlamak için dosyadan kısa bir kontrol değeri hesaplanıyor. Bu değere ne denir?|Checksum, verideki değişiklikleri tespit etmeye yardımcı olur; basit bir checksum verinin kimden geldiğini kanıtlamaz.
Bir servis, Logger sınıfından türemek yerine içinde bir logger nesnesi tutup işlemleri ona devrediyor. Bu yeniden kullanım yaklaşımı hangisidir?|Composition, farklı sorumlulukları olan nesneleri bir araya getirerek davranış oluşturur.
Bir uygulama her istekte yeni database bağlantısı açmak yerine sınırlı sayıdaki açık bağlantıyı yeniden kullanıyor. Bu bağlantıları yöneten yapının adı nedir?|Connection pool, hazır bağlantıları çağıranlara verir ve işleri bitince yeniden kullanım için geri alır.
Bir thread, paylaşılan değeri yalnızca hâlâ daha önce okuduğu değere eşitse güncelliyor. Bunu tek adımda yapan atomic işlem hangisidir?|Compare-and-swap, beklenen değeri kontrol etmeyi ve eşleşiyorsa değiştirmeyi tek bir atomic işlem olarak yapar.
Yeni sürüm önce gerçek trafiğin küçük bir bölümünü alıyor; ekip hata oranlarını izledikten sonra kapsamı genişletiyor. Bu deployment stratejisi hangisidir?|Canary deployment, yeni sürümün ilk aşamadaki etkisini sınırlayarak sorunları daha az kullanıcı etkilenirken görmeyi sağlar.
`,
 D: `
İki thread birbirinin ihtiyaç duyduğu lock'u tutuyor ve ikisi de ilerleyemiyor. Bu duruma ne denir?|Deadlock, kaynaklar için döngüsel bir bekleme oluştuğunda ilgili thread'lerin ilerleyememesidir.
Bir arama alanı, kullanıcı yazmayı bıraktıktan 300 milisaniye sonra istek gönderiyor. Bu zamanlama tekniğinin adı nedir?|Debounce, çağrılar arasındaki sessiz süre dolana kadar işlemi erteler.
Bir servis, database istemcisini kendi oluşturmak yerine constructor üzerinden dışarıdan alıyor. Bu tekniğe ne denir?|Dependency injection, bir bileşenin ihtiyaç duyduğu bağımlılıkların dışarıdan verilmesidir.
Browser, bir alan adına bağlanmadan önce ona karşılık gelen IP adresini bulmak zorunda. Bu çözümlemeyi hangi sistem yapar?|DNS, alan adlarını IP adresi gibi kayıtlarla eşleştiren isimlendirme sistemidir.
Bir ekip Dockerfile'dan image oluşturup bu image ile izole container'lar çalıştırıyor. Hangi platformu kullanıyor?|Docker, uygulamaları image olarak paketler ve bu image'lardan container çalıştırır.
Commit edilmiş bir transaction, database yeniden başlatıldıktan sonra da korunmalı. Bu garantiyi hangi ACID özelliği verir?|Durability, commit edilmiş değişikliklerin database'in garanti kapsamındaki arızalara rağmen kalıcı olmasını ifade eder.
İki thread aynı bellek konumuna yeterli synchronization olmadan erişiyor ve en az biri yazma yapıyor. Bu concurrency hatasının adı nedir?|Data race, aralarında gerekli sıralama veya synchronization bulunmayan çakışan bellek erişimleridir.
Negatif ağırlıklı edge içermeyen bir graph üzerinde, bir başlangıç düğümünden en kısa yolları bulmanız gerekiyor. Hangi klasik algoritma uygundur?|Dijkstra algoritması, henüz kesinleşmemiş düğümlerden en yakınının mesafesini sırayla kesinleştirir.
Bir ekip, rapor sorgularında JOIN kullanmamak için müşteri adını rapor tablosunda bilinçli olarak tekrar saklıyor. Bu şema yaklaşımı nedir?|Denormalization, bazı okumaları hızlandırmak için kontrollü veri tekrarı ekler; buna karşılık veriyi güncel tutma maliyeti doğurur.
Code review ekranı, iki dosya sürümü arasındaki eklenen ve silinen satırları gösteriyor. Bu karşılaştırmanın adı nedir?|Diff, içeriğin sürümleri arasındaki farkları gösterir.
Kod, sınıfına bakmadan çağrılabilir bir write metodu olan her nesneyi kabul ediyor. Bu typing yaklaşımı hangisidir?|Duck typing, nesnenin ilan edilmiş sınıfından çok sunduğu davranışlara bakar.
`,
 E: `
Bir BankAccount sınıfı deposit() metodunu dışarı açıyor ama balance değerinin doğrudan değiştirilmesini engelliyor. Bu örnekte hangi object-oriented programming ilkesi uygulanıyor?|Encapsulation, veriyi ve davranışı birlikte tutar; iç ayrıntılara erişimi kontrol eder.
Senkron JavaScript kodu bittikten ve call stack boşaldıktan sonra bekleyen callback'lerin çalışmasını hangi runtime mekanizması koordine eder?|Event loop, call stack üzerindeki senkron çalışma bittikten sonra sıradaki task'lerin çalışmasını koordine eder; microtask'ler belirli kontrol noktalarında işlenir.
Bir hesabın güncel durumu, geçmişte kaydedilmiş para yatırma ve çekme event'leri yeniden uygulanarak oluşturuluyor. Bu veri saklama yaklaşımı nedir?|Event sourcing, yalnızca son durumu saklamak yerine durumu değiştiren domain event'lerini temel kayıt olarak tutar.
Replica'lar kısa süreliğine farklı değerler gösterebiliyor; güncellemeler durup iletişim sağlandığında aynı duruma gelmeleri bekleniyor. Bu consistency modeli hangisidir?|Eventual consistency, geçici farklılıklara izin verir; gerekli koşullar sağlandığında replica'ların aynı duruma gelmesini gerektirir.
Başarısız bir isteği tekrar denerken sırasıyla 1, 2, 4 ve 8 saniye bekliyorsunuz. Bekleme süresini böyle artıran retry stratejisi nedir?|Exponential backoff, retry aralığını katlanarak artırır; jitter eklemek de aynı anda yapılan denemeleri azaltabilir.
Bir process, kullanacağı portu çalıştığı ortamdan gelen isimlendirilmiş bir ayardan okuyor. Bu ayara ne denir?|Environment variable, process'e çalıştığı ortamdan aktarılan metin değerli bir ayardır.
Bir string içinde ters eğik çizginin ardından gelen n, yeni satırı temsil ediyor. Bu özel yazım biçiminin adı nedir?|Escape sequence, string gibi bir literal içinde özel bir karakteri veya anlamı temsil eder.
Bir dil, fonksiyon çağrılmadan önce tüm argümanları hesaplıyor; fonksiyon bazılarını kullanmasa bile bu değişmiyor. Bu evaluation yaklaşımı hangisidir?|Eager evaluation, hesaplamayı ihtiyaç duyulana kadar ertelemek yerine ifadeyi hemen değerlendirir.
Başarısız bir işlem, normal akışı keserek kontrolü uygun catch bloğuna aktaran bir değer fırlatıyor. Bu hata sinyalinin adı nedir?|Exception, normal kontrol akışını keser ve çevresindeki bir handler tarafından yakalanabilir.
İki bilgisayar, aynı çok byte'lı tam sayının byte'larını ters sırada saklıyor. Aralarındaki hangi özellik farklıdır?|Endianness, bir değerin byte'larının hangi sırada tutulduğunu belirtir; little-endian ve big-endian buna örnektir.
Bir pipeline veriyi kaynaktan alıyor, dönüştürüyor ve ardından data warehouse'a yüklüyor. Bu sürecin üç harfli kısaltması nedir?|ETL, Extract, Transform, Load adımlarını ifade eder; veri hedefe yüklenmeden önce dönüştürülür.
`,
 F: `
Bir ekip yeni ödeme ekranını deploy ediyor ama bir ayarla yalnızca belirli kullanıcılara açıyor. Bu kontrol mekanizmasının adı nedir?|Feature flag, kodun deploy edilmesiyle kullanıcıya açılmasını birbirinden ayırır.
orders tablosundaki customer_id değerinin mevcut bir müşteri kaydına karşılık gelmesini bir constraint zorunlu tutuyor. Bu anahtarın adı nedir?|Foreign key, ilişkili kayıtlar arasında referans bütünlüğünü korur.
Bir queue'daki işler, geldikleri sırayla çıkıyor. Bu sıralama kuralının dört harfli kısaltması nedir?|FIFO, First In, First Out anlamına gelir; ilk eklenen eleman ilk çıkar.
Bir nesneyi oluşturan override edilebilir metodun hangi somut nesneyi döndüreceğine alt sınıfların karar vermesini sağlayan tasarım deseni hangisidir?|Factory method, somut nesnenin oluşturulmasını alt sınıfın özelleştirebildiği bir metoda bırakır.
Bir arama sistemi tam string eşitliği yerine index'lenmiş kelimeleri, dil kurallarını ve alaka sıralamasını kullanıyor. Bu arama tekniği nedir?|Full-text search, metin içeriğini index'leyerek kelime tabanlı sorguları ve alaka sıralamasını destekler.
Bir CSS container, elemanları ana eksende sıralıyor ve boşluğu justify-content ile dağıtıyor. Hangi layout sistemi kullanılıyor?|Flexbox, ana eksen ve ona dik eksen üzerinden tek boyutlu yerleşim sağlar.
Tekrar kullanılacak bir hesaplamayı, argüman alan ve çağrılabilen bir kod bloğuna koyuyorsunuz. Bu programlama yapısı nedir?|Function, girdilerle çağrılabilen ve sonuç döndürebilen bir davranışı tek yerde toplar.
Bir test aracı, crash bulmak için parser'a çok sayıda üretilmiş veya bozuk girdi gönderiyor. Bu test tekniği hangisidir?|Fuzz testing, hataları ortaya çıkarmak için üretilmiş ya da değiştirilmiş girdilerle farklı durumları dener.
Aktif database erişilemez olunca standby database onun görevini devralıyor. Bu geçişin adı nedir?|Failover, bir bileşen arızalandığında sorumluluğun onun yerine geçecek bileşene aktarılmasıdır.
Unix'te çalışan bir process'ten yeni bir child process oluşturan system call hangisidir?|fork, ayrı bir process kimliği ve mantıksal olarak kopyalanmış adres alanı olan bir child process oluşturur.
Bir kod tabanı pure function'ları, immutable veriyi ve fonksiyonları birleştirerek dönüşüm yapmayı öne çıkarıyor. Bu programlama paradigması hangisidir?|Functional programming, hesaplamayı fonksiyonlar etrafında kurar ve çoğunlukla değiştirilebilir durumu azaltmayı amaçlar.
`,
 G: `
Bir client, tipli bir sorgu şeması üzerinden yalnızca kullanıcının adını ve avatarını istiyor. Bunu hangi API sorgu dili sağlar?|GraphQL, client'ın sabit bir yanıt yapısı almak yerine şemadan ihtiyaç duyduğu alanları seçmesini sağlar.
Repository'nizde değişiklikler commit'lerle kaydediliyor ve merkezi bir server olmadan yerel branch'ler açabiliyorsunuz. Hangi version control sistemi kullanılıyor?|Git, yerel geçmiş ve branch desteği sunan dağıtık bir version control sistemidir.
Şehirleri vertex, aralarındaki yolları edge olarak modelliyorsunuz. Bu ilişkileri hangi genel veri yapısı temsil eder?|Graph, edge'lerle birbirine bağlanan vertex'lerden oluşur; edge'ler yönlü veya ağırlıklı olabilir.
Runtime, artık erişilemeyen nesnelerin kullandığı belleği otomatik olarak geri alıyor. Bu sürece ne denir?|Garbage collection, canlı referanslardan ulaşılamayan nesnelerin belleğini geri kazandırır.
Bir algoritma her adımda o an için en iyi görünen seçimi yapıyor ve önceki seçimlerine dönmüyor. Bu yaklaşım hangisidir?|Greedy algorithm, yerel olarak en iyi seçimi yapar; bunun en iyi toplam sonucu verip vermemesi probleme bağlıdır.
Bir container, T türüyle parametrelendirilerek aynı implementasyonun farklı veri türlerini güvenli biçimde tutması sağlanıyor. Bu dil özelliği nedir?|Generics, algoritma ve veri yapılarını tür parametreleriyle tekrar kullanılabilir hale getirir.
Bir server yeni istek kabul etmeyi durdurup devam eden işleri bitirdikten sonra kapanıyor. Bu kapanış biçiminin adı nedir?|Graceful shutdown, kaynaklar bırakılmadan önce devam eden işlere tamamlanma fırsatı verir.
Bir SQL raporunda sayıları hesaplamadan önce her ülke için bir grup oluşturmanız gerekiyor. Bunu hangi clause yapar?|GROUP BY, aynı gruplama değerlerine sahip satırları birleştirir ve aggregate fonksiyonların grup üzerinde çalışmasını sağlar.
Bir HTTP yanıtında Content-Encoding: gzip header'ı var. Hangi sıkıştırma biçimi uygulanmıştır?|Gzip, byte akışını sıkıştırır ve özellikle metin verisinin aktarım boyutunu azaltabilir.
İki servis .proto tanımları ve üretilmiş client kodlarıyla, genellikle HTTP/2 üzerinden haberleşiyor. Hangi RPC framework'ü kullanılıyor?|gRPC, servis metotlarını ve mesajları tanımlar; client ve server kodunun üretilmesini destekler.
JavaScript'te function* ile tanımlanan bir fonksiyon duraklayıp sırayla değer üretebiliyor. Bu fonksiyon türünün adı nedir?|Generator bir iterator döndürür; çalışması yield ifadelerinde duraklayıp sonradan devam edebilir.
`,
 H: `
Kullanıcıları, hashing fonksiyonunun seçtiği bucket'larda ID'lerine göre saklıyorsunuz. Hangi key-value veri yapısını kullanıyorsunuz?|Hash map, anahtarları değerlerle eşleştirir; uygun hashing ile ortalama O(1) erişim sağlar.
Bir client GET /products gönderiyor; karşılığında status code, header'lar ve body alıyor. Bu iletişimi hangi uygulama protokolü tanımlar?|HTTP, web iletişimindeki request ve response anlamlarını tanımlar.
Browser, HTTP trafiğini şifreli bir TLS bağlantısı üzerinden taşıyor. Bu iletişimin URL scheme adı nedir?|HTTPS, HTTP trafiğini TLS ile koruyarak aktarım sırasında gizlilik ve bütünlük sağlar.
İki farklı anahtar aynı hash değerini üretiyor. Bu duruma ne denir?|Hash collision oluştuğunda, aynı hash veya bucket'a düşen farklı anahtarları ayırt edecek bir yöntem gerekir.
Bir priority queue, kökünde en küçük elemanın bulunduğu complete binary tree kullanıyor. Bu veri yapısının adı nedir?|Min-heap'te her parent, çocuklarından küçük veya eşittir; bütün elemanların tamamen sıralı olması gerekmez.
Gönderen taraf, mesajın kaynağını ve bütünlüğünü doğrulatmak için gizli bir anahtarı cryptographic hash ile birleştiriyor. Bu yapının dört harfli adı nedir?|HMAC, ortak gizli anahtarı bilen taraflar arasında mesajın bütünlüğünü ve kaynağını doğrulamayı sağlar.
Browser, server'da üretilmiş HTML'e uygulamanın etkileşimli davranışlarını bağlıyor. Bu sürecin adı nedir?|Hydration, client tarafındaki uygulama mantığını mevcut server-rendered HTML ile buluşturur.
Bir servisin kapasitesi, tek makinenin kaynakları artırılarak değil daha fazla instance eklenerek büyütülüyor. Bu scaling yaklaşımı nedir?|Horizontal scaling, yükü ek instance'lar arasında dağıtarak kapasiteyi artırır.
Bir worker, hâlâ ulaşılabilir olduğunu göstermek için düzenli aralıklarla küçük bir mesaj gönderiyor. Bu sinyalin adı nedir?|Heartbeat, olası arızaları fark etmeye yardımcı olur; mesajın gecikmesi ağdaki bir sorundan da kaynaklanabilir.
Bir component'i değiştirdiğinizde development ortamı uygulamayı elle baştan başlatmadan güncelliyor. Bu özelliğin adı nedir?|Hot reload, geliştirme sırasında kod değişikliklerini çalışan uygulamaya aktarır; bazı durumlarda uygulama durumunu da korur.
Sıralı bir akışın başındaki veri geciktiği için, sonraki hazır veriler de teslim edilemiyor. Bu sorunun adı nedir?|Head-of-line blocking, sonraki işlerin ilerlemesini daha önceki bir öğenin tamamlanmasına bağımlı hale getirir.
`,
 I: `
Database, email alanında tuttuğu ek bir arama yapısı sayesinde tüm müşteri satırlarını taramadan kaydı buluyor. Bu yapının adı nedir?|Index, bazı okumaları hızlandırır; bunun karşılığında ek depolama alanı ve yazma maliyeti oluşturur.
Bir işlemi tekrarlamak, server'daki durum üzerinde bir kez yapmakla aynı amaçlanan etkiyi oluşturuyor. Bu özelliğe ne denir?|Idempotency, işlemin sonucundaki etkiyle ilgilidir; her çağrının aynı yanıtı vermesi gerekmez.
Eşzamanlı transaction'ların birbirlerinin henüz tamamlanmamış değişikliklerini nasıl görebileceğini hangi ACID özelliği belirler?|Isolation, aynı anda çalışan transaction'ların birbirleriyle etkileşimini ve değişikliklerinin görünürlüğünü düzenler.
Uygulama kodunuz framework'ün akışını yönetmek yerine framework'ün belirli noktalarda çağırdığı callback'leri sağlıyor. Kontrolün bu şekilde devredilmesine ne denir?|Inversion of control, akışın yönetimini uygulama kodundan başka bir bileşene veya framework'e devreder.
Bir değer oluşturulduktan sonra içeriği değiştirilemiyor. Böyle bir değeri tanımlayan sıfat nedir?|Immutable bir değer yerinde değiştirilmez; farklı bir değer gerektiğinde yeni bir değer oluşturulur.
Bir alt sınıf, parent sınıfın alanlarını veya metotlarını devralıyor. Bunu sağlayan object-oriented mekanizma nedir?|Inheritance, bir sınıftan başka bir sınıf türetmeyi ve onun davranışını yeniden kullanmayı veya özelleştirmeyi sağlar.
Bir test, API handler'ını ve gerçek database'i birlikte çalıştırıp aralarındaki bağlantıyı sınayıyor. Bu test türünün adı nedir?|Integration test, bileşenlerin kendi başlarına çalışmasından çok birlikte nasıl çalıştığını kontrol eder.
Bir nesne, sıradaki değeri üretmek ve dizi bittiğinde bunu bildirmek için next() metodu sunuyor. Bu dolaşım yapısına ne denir?|Iterator, alttaki veri yapısını çağırana açmadan elemanlara sırayla erişim sağlar.
Sabit genişlikli bir tam sayı hesabının sonucu, o türün temsil edebildiği aralığı aşıyor. Bu duruma ne denir?|Integer overflow durumunda sarma, hata veya başka bir davranış oluşabilir; sonuç kullanılan dile ve işleme bağlıdır.
Bir ekip ağları ve server'ları elle kurmak yerine version control altında tutulan yapılandırma dosyalarıyla tanımlıyor. Bu yaklaşımın adı nedir?|Infrastructure as code, altyapı tanımlarını incelenebilir ve tekrar uygulanabilir hale getirir.
Bir ürünün bilgileri değiştiği için cache'teki eski kaydının silinmesi veya kullanılamaz sayılması gerekiyor. Bu cache işlemine ne denir?|Invalidation, güncel olmadığı bilinen bir cache kaydının kullanılmasını engeller.
`,
 J: `
Bir HTTP yanıtında {"online":true,"players":4} verisi geliyor. Bu metin tabanlı veri biçiminin adı nedir?|JSON; nesne, array, string, sayı, boolean ve null değerlerini temsil eden bir veri biçimidir.
Bir SQL sorgusu, customer_id üzerinden orders kayıtlarını karşılık gelen müşteri kayıtlarıyla birleştiriyor. Tabloları bağlayan işlem hangisidir?|JOIN, belirtilen eşleştirme koşuluna göre tablolardaki satırları bir araya getirir.
İmzalı bir token, sub ve exp gibi claim'ler taşıyor; header, payload ve signature bölümleri noktalarla ayrılıyor. Bu token biçiminin üç harfli adı nedir?|İmzalı JWT, claim'leri taşır; yalnızca imzalanmış olması payload'un şifrelendiği anlamına gelmez.
Browser script'lerinde çalışan; undefined, const ve Promise gibi yerleşik özellikleri bulunan dil hangisidir?|JavaScript; dinamik değerleri, fonksiyonları, nesneleri ve asenkron programlamayı destekler.
Bir program bytecode'a derlenip JVM üzerinde çalıştırılıyor. Bu çalışma modeliyle bilinen programlama dili hangisidir?|Java, yaygın olarak JVM bytecode'una derlenen, statik tipli ve sınıf tabanlı bir dildir.
Runtime, sık çalışan kod parçalarını program çalışırken machine code'a derliyor. Bu derleme yaklaşımı nedir?|JIT compilation, derleme işini tamamen önceden yapmak yerine program çalışırken gerçekleştirir.
Bir API, e-posta gönderme işlerini background worker'ların daha sonra işlemesi için ortak bir bekleme alanına bırakıyor. Bu yapının adı nedir?|Job queue, background işlerinin sisteme alınmasını bu işlerin çalıştırılmasından ayırır.
Binlerce client'ın aynı anda retry yapmasını engellemek için bekleme sürelerine rastgele farklar ekliyorsunuz. Bu rastgele değişimin adı nedir?|Jitter, retry'ları zamana yayarak aynı anda oluşan yük artışını azaltır.
Bir JSON belgesinde /users/0/name gibi bir yol kullanarak belirli bir değeri gösteren standart sözdiziminin adı nedir?|JSON Pointer, eğik çizgiyle ayrılan yol parçaları üzerinden JSON içindeki bir değeri belirtir.
JVM'de sınıf instance'larını ve array'leri tutan, thread'ler arasında paylaşılan bellek alanının adı nedir?|Java heap, nesnelerin ve array'lerin tutulduğu ve JVM'in garbage collector'ı tarafından yönetilen alandır.
Bir JavaScript yorumunda fonksiyonu açıklamak için @param ve @returns etiketleri kullanılıyor. Bu dokümantasyon biçiminin adı nedir?|JSDoc etiketleri JavaScript API'lerini açıklar; development araçlarına tür bilgisi de sağlayabilir.
`,
 K: `
Bir cluster, bir container'ın üç replica'sını çalışır tutuyor ve arızalanan pod'ların yerine yenilerini açıyor. Bu işi hangi orchestration platformu yönetir?|Kubernetes controller'ları, cluster'ın mevcut durumunu tanımlanmış hedef durumla uyumlu hale getirir.
Bir database, relational tabloları sorgulamak yerine benzersiz bir anahtar üzerinden değeri doğrudan getiriyor. Bu veri modeli nedir?|Key-value store, anahtarları değerlerle eşleştirir; değerin iç yapısını yorumlamak zorunda değildir.
val ve var kullanan, nullable türleri tür adının sonuna soru işareti ekleyerek belirten JVM dili hangisidir?|Kotlin'in type system'i, nullable ve non-nullable türleri birbirinden ayırır.
Bir streaming platformunda kayıtlar topic ve partition'lara ayrılıyor; consumer'lar nerede kaldıklarını offset ile takip ediyor. Bu Apache projesi hangisidir?|Kafka, consumer'ların okuyabildiği ve yeniden işleyebildiği partition'lara bölünmüş event log'ları sağlar.
Bir reviewer, sorunu çözen en basit tasarımı öneriyor. "Keep It Simple, Stupid" ilkesinin kısaltması nedir?|KISS, anlaşılır tasarımları tercih etmeyi ve gereksiz karmaşıklıktan kaçınmayı önerir.
Minimum spanning tree kurmak için edge'leri ağırlıklarına göre sıralıyor, cycle oluşturmayan her edge'i sırayla ekliyorsunuz. Hangi algoritma budur?|Kruskal algoritması, çoğunlukla disjoint-set kullanarak minimum spanning forest oluşturur.
Bir graph'ın topological sıralamasını bulmak için incoming edge sayısı sıfır olan düğümleri tekrar tekrar kaldırıyorsunuz. Bu algoritmanın adı nedir?|Kahn algoritması, incoming edge sayılarını izler; tüm düğümler kaldırılamıyorsa graph'ta cycle vardır.
Önceden eşleşen karakterleri tekrar kontrol etmemek için prefix table kullanan string eşleştirme algoritmasının üç harfli kısaltması nedir?|KMP, eşleşmiş prefix bilgisini kullanarak bir pattern'i doğrusal zamanda arar.
Bir paroladan cryptographic key üretmek için parola, salt ve work factor ile işleniyor. Bu işi yapan fonksiyon türünün adı nedir?|Parola için tasarlanmış bir key derivation function, ayarlanabilir hesaplama maliyetiyle parola tahminini pahalılaştırır.
Bir client, ağ servislerine erişmek için güvenilen bir merkezden ticket alıyor. Bu authentication protokolünün adı nedir?|Kerberos, client ve servislerin kimliğini ticket'lar ve ortak anahtarlı cryptography ile doğrular.
Bir URL slug'ında kelimeler account-settings biçiminde, küçük harfle ve aralarında tireyle yazılıyor. Bu adlandırma biçimi nedir?|Kebab-case, kelimeleri tireyle birbirinden ayırır.
`,
 L: `
Gelen istekleri birden fazla sağlıklı uygulama server'ı arasında dağıtan bileşenin adı nedir?|Load balancer, trafiği backend'ler arasında dağıtır ve sağlıksız instance'lara istek göndermekten kaçınabilir.
Her düğüm bir değer ve sonraki düğümün referansını tutuyor; elemanların bellekte yan yana olması gerekmiyor. Bu veri yapısı hangisidir?|Linked list, elemanları bitişik bir array'de tutmak yerine düğümleri referanslarla bağlar.
Dolu bir cache'ten, en uzun süredir erişilmemiş kayıt çıkarılıyor. Bu politikanın üç harfli kısaltması nedir?|LRU, yakın zamanda erişilen kayıtları tutmayı, daha uzun süredir kullanılmayanları çıkarmayı tercih eder.
Bir ifade, sonucu gerçekten gerekli olana kadar hesaplanmıyor. Bu evaluation yaklaşımının adı nedir?|Lazy evaluation, hesaplamayı ihtiyaç anına kadar erteler; hesaplanan sonuç daha sonra tekrar kullanılabilir.
Bir fonksiyon, değişken adlarını çağrıldığı yere göre değil tanımlandığı yere göre çözümlüyor. Bu scope kuralı nedir?|Lexical scope, kaynak kodun iç içe yapısını esas alarak hangi değişkenlere erişileceğini belirler.
Bir araç, uygulamayı çalıştırmadan kullanılmayan import'ları ve şüpheli kod örüntülerini işaretliyor. Bu araç türünün adı nedir?|Linter, sorunları bulmak veya kod kurallarını uygulamak için kaynak kodu analiz eder.
İki worker sürekli birbirine tepki verip durum değiştiriyor ama hiçbiri işini tamamlayamıyor. Bu concurrency sorununun adı nedir?|Livelock durumunda katılımcılar aktiftir; buna rağmen yararlı bir ilerleme sağlayamazlar.
Server, bir HTTP isteğini yeni veri gelene kadar açık tutuyor; yanıtı alan client hemen yeni bir istek açıyor. Bu iletişim tekniği nedir?|Long polling, her isteği veri veya timeout gelene kadar bekleterek server'dan bildirim almayı sağlar.
Bir raporda hiç siparişi olmayanlar dahil tüm müşteriler gösterilmeli. Sol tablodaki tüm kayıtları koruyan SQL JOIN türü hangisidir?|LEFT JOIN, sağ tabloda karşılığı bulunmayan satırların sağ tarafındaki alanlara NULL koyar.
Bir isteğin gönderilmesiyle yanıtının alınması arasında 80 milisaniye geçiyor. Bu gecikmeyi ifade eden performans ölçütü nedir?|Latency gecikmeyi, throughput ise birim zamanda tamamlanan iş miktarını ölçer.
Bir stack'e sırayla A, B ve C ekleniyor; ilk çıkarılan C oluyor. Bunu açıklayan dört harfli sıralama kuralı nedir?|LIFO, Last In, First Out anlamına gelir; son eklenen eleman ilk çıkar.
`,
 M: `
Recursive bir fonksiyon her girdi için hesapladığı sonucu saklıyor ve aynı girdiyle tekrar çağrıldığında hesabı tekrarlamıyor. Bu teknik nedir?|Memoization, fonksiyon sonuçlarını girdilerine göre cache'ler.
Bir critical section'a aynı anda yalnızca bir thread'in girmesi gerekiyor. Bunu sağlayan lock türü hangisidir?|Mutex, aynı anda yalnızca bir sahibinin lock'u tutmasına izin vererek paylaşılan kaynağı korur.
Bir algoritma diziyi ikiye bölüyor, parçaları recursive olarak sıralıyor ve sıralı parçaları birleştiriyor. Hangi sıralama algoritmasıdır?|Merge sort, O(n log n) iş yapar ve stable sıralama sağlayacak şekilde uygulanabilir.
Bir request, route handler'a ulaşmadan önce ortak logging ve authentication adımlarından geçiyor. Bu ara işleme katmanının adı nedir?|Middleware, request ve response gibi işlemlerin çevresinde tekrar kullanılabilir adımlar çalıştırır.
Bir uygulama, bağımsız deploy edilebilen ve arayüzler üzerinden haberleşen küçük servislere ayrılıyor. Bu mimari yaklaşım hangisidir?|Microservices, uygulamayı belirli sorumluluklara odaklanan ve ayrı deploy edilebilen servisler halinde düzenler.
Bir test double, sendEmail'in hangi argümanlarla çağrıldığını kaydediyor; test de bu çağrıyı doğruluyor. Bu test double türü nedir?|Mock, argümanlar ve çağrı sayısı gibi etkileşimlerle ilgili beklentileri doğrulamayı sağlar.
JavaScript'te anahtar olarak yalnızca string ve symbol değil, nesne de kabul eden key-value koleksiyonu hangisidir?|Map, her türden anahtarı kabul eder ve elemanları eklenme sırasıyla dolaşır.
Version control altındaki bir script database'e sütun ekliyor ve bu değişikliğin uygulandığını kaydediyor. Bu script türünün adı nedir?|Migration, database şemasını veya verisini bilinen bir sürümden diğerine taşır.
Bir uygulamanın modülleri birlikte build edilip tek bir uygulama olarak deploy ediliyor. Bu mimariye ne denir?|Monolith, içindeki kod modüler olsa bile tek bir deployment birimi kullanır.
Bir server, artık gerekmeyen nesnelere referans tutmaya devam ettiği için giderek daha fazla bellek kullanıyor. Bu hataya ne denir?|Memory leak, ihtiyaç kalmayan belleğin tutulmaya devam etmesi ve geri alınamamasıdır.
Producer'lar mesajları, onları consumer'lara yönlendiren merkezi bir aracıya gönderiyor. Bu aracının adı nedir?|Message broker, mesaj üreten tarafla tüketen tarafı birbirinden ayırır; buffering ve yönlendirme sağlayabilir.
`,
 N: `
Bir C programı, geçerli bir nesneyi göstermeyen özel pointer değerini dereference ederek undefined behavior oluşturuyor. Bu pointer türü nedir?|Null pointer geçerli bir nesneyi göstermez; dereference edilmemelidir.
Bir JavaScript alanında, undefined'dan farklı olarak bilinçli biçimde nesne değeri bulunmadığını belirten primitive değer hangisidir?|null, açıkça yokluk belirtmek için kullanılır; undefined ise çoğunlukla eksik veya başlatılmamış bir değeri temsil eder.
JavaScript'te Number("hello") işlemi hangi özel sayısal değeri üretir?|NaN, Not-a-Number anlamına gelir ve JavaScript'te kendisi de number türündedir.
İki kütüphane aynı sınıf adını kullanıyor; çakışmayı önlemek için adlar farklı isimlendirilmiş gruplarda tutuluyor. Bu yapının adı nedir?|Namespace, adları gruplar ve isim çakışmalarını önlemeye yardımcı olur.
Bir router, özel ağla public ağ arasında geçen paketlerin adres bilgisini değiştiriyor. Bu tekniğin üç harfli kısaltması nedir?|NAT, ağ adres alanları arasında adresleri ve çoğu zaman port'ları eşler.
Server'lar saatlerini ağ üzerindeki zaman kaynaklarıyla eşitliyor. Bu iş için yaygın olarak hangi protokol kullanılır?|NTP, ağ gecikmesini de hesaba katarak sistem saatleri arasındaki farkı tahmin eder.
Bir database şemasında müşteri bilgileri ayrı tabloda tutularak veri tekrarı ve güncelleme tutarsızlıkları azaltılıyor. Bu tasarım süreci nedir?|Normalization, bağımlılıklara göre tabloları düzenleyerek sorunlu veri tekrarını azaltır.
Bir sayfa önce 50 siparişi tek sorguyla getiriyor, sonra her siparişin müşterisi için ayrı sorgu çalıştırıyor. Bu sorgu sorununa ne denir?|N+1 query, koleksiyon için bir sorgu ve koleksiyondaki her eleman için ek sorgular çalıştırılmasıdır.
npm install gibi komutlarla paket yükleyen ve bağımlılıkları package.json dosyasından okuyan JavaScript paket yöneticisi hangisidir?|npm, paket yükler ve projenin package.json dosyasında tanımlanan script'leri çalıştırır.
Bir okuma işlemi veri gelmesini beklemeden geri dönüyor; thread başka işlere devam edebiliyor. Bu I/O çalışma biçiminin adı nedir?|Non-blocking I/O, çağıranı işlem tamamlanana kadar bekletmek yerine hazır olma durumunu veya would-block sonucunu bildirir.
Bir protokol, replay saldırısını önlemeye yardımcı olması için tek kullanımlık güncel bir değer gönderiyor. Bu değerin adı nedir?|Nonce, protokolün istediği benzersizlik veya güncellik koşulunu sağlamalıdır.
`,
 O: `
Bir takvim uygulaması, parolanızı öğrenmeden hesabınızdaki belirli verilere erişme izni alıyor. Bu yetki devrini hangi authorization framework'ü sağlar?|OAuth, access token'larla yetki devrini sağlar; tek başına bir authentication protokolü değildir.
Bir nesnenin durumu değişince, somut sınıflarını bilmediği kayıtlı abonelere haber vermesini sağlayan tasarım deseni hangisidir?|Observer, bir nesneyi abonelerine ortak bir bildirim arayüzü üzerinden bağlar.
Bir kütüphane database satırlarını uygulama nesnelerine eşliyor ve nesneler üzerindeki işlemleri sorgulara dönüştürüyor. Bu yaklaşımın üç harfli adı nedir?|ORM, uygulamanın nesne modeliyle ilişkisel veriler arasında eşleme yapar.
Bir dilde aynı adla, fakat farklı parametre imzalarıyla birden fazla metot tanımlanabiliyor. Bu özelliğin adı nedir?|Overloading, aynı adlı metotlar arasından imzaya göre uygun olanın seçilmesini sağlar.
Bir alt sınıf, parent sınıftan aldığı metodun yerine kendi implementasyonunu sunuyor. Bu işleme ne denir?|Overriding, devralınan davranışın alt sınıf için özelleştirilmesidir.
Browser, güvenlik kararlarında bir URL'yi scheme, host ve port birleşimiyle değerlendiriyor. Bu birleşimin adı nedir?|Origin; scheme, host ve port ile belirlenir, URL'nin path bölümü buna dahil değildir.
Bir SQL sorgusunda en yeni kayıtları önce göstermek için created_at DESC yazılacak. Sıralamayı hangi clause belirler?|ORDER BY, sorgu sonucunun hangi alanlara ve hangi yöne göre sıralanacağını belirtir.
Bir lookup işleminin yaptığı iş, saklanan eleman sayısı arttıkça büyümüyor. Sabit zaman için kullanılan gösterim nedir?|O(1), kullanılan modele göre işlem maliyetinin girdi büyüklüğünden bağımsız olarak sınırlı olduğunu belirtir.
Ağ iletişimini fiziksel katmandan uygulama katmanına kadar yedi katmanda açıklayan referans modelinin kısaltması nedir?|OSI, ağ işlevlerini yedi katmana ayırarak tanımlayan bir referans modelidir.
Bir satır ancak version değeri, daha önce okunan değerle hâlâ aynıysa güncelleniyor. Bu concurrency kontrol tekniği nedir?|Optimistic locking, çakışan güncellemeleri tespit eder; çakışma halinde retry veya başka bir çözüm gerekir.
Bir yazılımın lisansı, kaynak kodunu kullanmaya, incelemeye, değiştirmeye ve yeniden dağıtmaya izin veriyor. Bu lisanslama yaklaşımının adı nedir?|Open source lisansları, kaynak kodun yalnızca görünür olmasının ötesinde kullanım ve değişiklik hakları verir.
`,
 P: `
Bir endpoint her istekte 20 ürün döndürüyor ve sonraki grubu istemek için bir yol sunuyor. Sonuçları böyle bölmeye ne denir?|Pagination, sonuç kümesini daha küçük sayfalara ayırır; offset veya cursor kullanılabilir.
Bir JavaScript fonksiyonu, ileride tamamlanacak işlemin sonucunu temsil eden ve pending, fulfilled veya rejected olabilen bir nesne döndürüyor. Bu nesne nedir?|Promise, asenkron bir işlemin gelecekteki sonucunu temsil eder.
Kod bloklarını girintiyle belirleyen ve fonksiyonları def ile tanımlayan programlama dili hangisidir?|Python'da girinti, ifadelerin hangi kod bloğuna ait olduğunu belirleyen sözdiziminin bir parçasıdır.
Bir tabloda her satırı benzersiz olarak tanımlayan tek sütuna veya sütun birleşimine ne denir?|Primary key, her satırı benzersiz tanımlar ve NULL değer içeremez.
Ortak bir arayüz üzerinden yapılan aynı draw() çağrısı, Circle ve Rectangle nesnelerinde farklı implementasyonları çalıştırıyor. Bu ilke nedir?|Polymorphism, aynı arayüzün farklı somut davranışları temsil etmesini sağlar.
Bir scheduler, en önce gelen işi değil en yüksek öncelikli işi sıradan çıkarıyor. Buna uygun veri yapısı nedir?|Priority queue, elemanları önceliğe göre çıkarır ve genellikle bir heap ile uygulanır.
IP adresi bilgisayarı belirtiyor. O bilgisayardaki TCP veya UDP servisinin iletişim ucunu ayırt eden numaranın adı nedir?|Port numarası, bir host'un ağ yapısı içindeki transport-layer iletişim ucunu belirtir.
Bir compiler, token'lar üretildikten sonra dilbilgisini kontrol edip sözdizimi yapısını kuruyor. Bu işi hangi bileşen yapar?|Parser, token'ları dilin grammar kurallarına göre düzenler.
Bir geliştirici GitHub'da branch değişikliklerini tartışmaya, otomatik kontrollere ve code review'a açıyor. Bu önerinin adı nedir?|Pull request, önerilen değişikliği, review tartışmasını ve otomatik kontrolleri aynı yerde toplar.
function greet(name) tanımındaki name, çağrı sırasında verilen argument'tan farklı olarak ne ad alır?|Parameter, fonksiyon tanımındaki isimlendirilmiş girdidir; argument ise çağrıda verilen değerdir.
Bir fonksiyon aynı girdiler için daima aynı sonucu döndürüyor ve gözlemlenebilir bir side effect oluşturmuyor. Bu fonksiyon türü nedir?|Pure function, yalnızca girdilerine bağlıdır ve dışarıdaki durumu değiştirmez.
`,
 R: `
Bir para transferi, database transaction'ının ortasında hata veriyor. Henüz commit edilmemiş değişiklikleri geri alan işlemin adı nedir?|Rollback, başarısız transaction'ın değişikliklerini iptal ederek işlemin kısmen uygulanmış halde kalmasını önler.
Bir fonksiyon, base case'e ulaşana kadar kendisini daha küçük bir girdiyle çağırarak problemi çözüyor. Bu tekniğin adı nedir?|Recursion, problemi fonksiyonun kendi kendini çağırmasıyla küçültür; durabilmesi için bir base case gerekir.
Git'te bir branch'in commit'leri farklı bir base commit üzerine yeniden uygulanıyor. Bu işlemin adı nedir?|Rebase, commit'leri başka bir başlangıç noktası üzerine yeniden uygular ve yeni bir commit dizisi oluşturur.
Metindeki rakamları ^[0-9]+$ gibi kısa bir pattern ile eşleştiriyorsunuz. Bu gösterimin yaygın kısa adı nedir?|Regex; metin eşleştirme, arama veya değiştirme işlemlerinde kullanılacak örüntüyü tanımlar.
String, hash, list ve set gibi veri yapılarını destekleyen, cache için de sık kullanılan in-memory veri deposu hangisidir?|Redis, farklı veri yapılarına hızlı erişim sağlar; isteğe bağlı kalıcılık özellikleri de sunar.
Resource'lar, stateless etkileşimler ve uniform interface üzerine kurulu web mimari stilinin kısaltması nedir?|REST, belirli bir veri biçiminden çok bir dizi mimari kısıtı tanımlar.
Bir programın doğru çalışması, eşzamanlı işlemlerden hangisinin önce gerçekleştiğine beklenmedik biçimde bağlı oluyor. Bu hataya ne denir?|Race condition, yeterli koordinasyon olmadığında zamanlamanın veya işlem sırasının doğruluğu etkilemesidir.
Bellek güvenliğini garbage collector gerektirmeden ownership ve borrowing kurallarıyla sağlayan sistem programlama dili hangisidir?|Rust, safe kodda ownership ve borrowing kurallarını derleme sırasında denetler.
IP paketlerini routing table'a göre ağlar arasında ileten cihazın adı nedir?|Router, paketlerin hedef ağa ulaşması için uygun iletim yolunu seçer.
Bir API her client'a dakikada en fazla 100 istek izni veriyor. Bu trafik kontrol yönteminin adı nedir?|Rate limiting, kapasiteyi korumak veya kullanım politikasını uygulamak için zaman içindeki istek sayısını sınırlar.
Leader election, log replication ve çoğunluk onayıyla çalışan consensus algoritması hangisidir?|Raft, leader tabanlı bir replicated log tasarımıyla consensus sürecini daha anlaşılır parçalara ayırır.
`,
 S: `
Bir undo geçmişinde, en son eklenen işlem ilk geri alınıyor. Bu LIFO davranışına uygun veri yapısı nedir?|Stack, ekleme ve çıkarma işlemlerini aynı uçtan yapar.
Bir sınıf, nesne oluşturulmasını kontrol ederek tüm çağıranların ortak erişim noktasından aynı instance'ı almasını sağlıyor. Bu tasarım deseni nedir?|Singleton, instance oluşturulmasını sınırlar ve paylaşılan instance'a erişim sağlar.
Bir koleksiyonda her farklı değerin yalnızca bir kez bulunmasını istiyorsunuz. Hangi koleksiyon türü uygundur?|Set, benzersiz elemanlar tutar ve bir değerin koleksiyonda bulunup bulunmadığını kontrol etmeyi sağlar.
Bir uygulama, bellekteki nesneyi saklamak veya göndermek için JSON byte'larına dönüştürüyor. Bu dönüşümün adı nedir?|Serialization, yapılandırılmış değerleri saklanabilir veya aktarılabilir bir gösterime dönüştürür.
Bir worker pool, mevcut izinleri sayarak paylaşılan kaynağa aynı anda en fazla beş task'in erişmesini sağlıyor. Bu concurrency aracı nedir?|Semaphore, izin sayısını yöneterek bir kaynağa eşzamanlı erişimi sınırlar.
Public-key authentication ile şifreli bir uzak terminal oturumu açıyorsunuz. Bu bağlantıyı hangi protokol sağlar?|SSH, kimliği doğrulanmış ve şifreli uzak erişim ile ilgili servisleri sağlar.
SELECT, INSERT, UPDATE ve DELETE, relational database'lerle kullanılan hangi dilin komutlarıdır?|SQL, relational verileri sorgulamak ve değiştirmek için kullanılan işlemleri tanımlar.
Bir transaction tutarlı bir snapshot üzerinden okuma yapıyor; bu sırada diğer transaction'ların commit ettiği değişiklikleri görmeyebiliyor. Bu isolation yaklaşımı nedir?|Snapshot isolation, tutarlı bir snapshot'tan okuma sağlar; buna rağmen write skew gibi anomaliler oluşabilir.
Browser'da kayıtlı bir background script, ağ isteklerini yakalayıp cache'teki yanıtları döndürebiliyor. Bu script türünün adı nedir?|Service worker, DOM'a doğrudan erişmeden fetch event'lerini işleyebilir ve çevrimdışı çalışmayı destekleyebilir.
Büyük bir database, farklı müşterilerin satırlarını partition key'e göre ayrı server'lara dağıtıyor. Bu veri dağıtım tekniği nedir?|Sharding, tüm veriyi her node'a kopyalamak yerine veriyi farklı database node'larına böler.
Bir parola hash'lenmeden önce benzersiz, rastgele bir değer ekleniyor; bu değer hash ile birlikte saklanıyor. Eklenen değere ne denir?|Salt, aynı parolaların farklı sonuçlar üretmesini sağlar ve önceden hesaplanmış hash tablolarıyla yapılan saldırıları zorlaştırır.
`,
 T: `
Bir hesaptan para düşülmesi ve diğerine eklenmesi ya birlikte tamamlanmalı ya da ikisi de iptal edilmeli. Bu database işlemlerini tek bir bütün olarak gruplayan yapı nedir?|Transaction, işlemleri atomicity ve isolation gibi garantiler altında bir araya getirir.
Bir uygulama, IP üzerinden güvenilir ve sıralı bir byte akışına ihtiyaç duyuyor. Bunu hangi transport protokolü sağlar?|TCP, sıralama, yeniden iletim ve flow control gibi işlevleri yönetir.
HTTPS trafiğini şifreleme, bütünlük kontrolü ve karşı tarafın kimliğini doğrulama yoluyla koruyan protokol hangisidir?|TLS, bağlantının iki ucu arasındaki veriyi aktarım sırasında korur.
Autocomplete için kelimeler ortak karakter prefix'lerini paylaşan bir ağaçta saklanıyor. Bu veri yapısı nedir?|Trie, ortak prefix'leri aynı yolda tutar ve prefix araması için uygundur.
Bir geliştirici önce başarısız bir test yazıyor, sonra testi geçiriyor ve ardından refactor yapıyor. Bu yöntemin üç harfli kısaltması nedir?|TDD, red, green, refactor döngüsüyle ilerleyen bir geliştirme yöntemidir.
Bir fonksiyon, status code ve mesajı belirli bir sırayla tek bir bileşik değer içinde döndürüyor. Bunu temsil eden yapı genellikle nedir?|Tuple, farklı türlerde olabilen alanları sıralı bir değer olarak bir arada tutar.
JavaScript'e statik tür sözdizimi ve derleme sırasında type checking ekleyen dil hangisidir?|TypeScript, geliştirme sırasında türleri denetler; JavaScript çıktısı üretilirken tür sözdizimi kaldırılır.
Bir cache kaydı 60 saniye sonra geçersiz olacak. Kaydın bu yaşam süresini belirten üç harfli ayar nedir?|TTL, cache politikasına göre bir kaydın ne kadar süre geçerli kalacağını belirtir.
Database, tabloya yeni satır eklendiğinde önceden tanımlanmış bir işlemi otomatik çalıştırıyor. Bunu sağlayan database nesnesi nedir?|Trigger, belirtilen database event'lerine bağlı olarak çalışır.
Build işleri, her dependency ona ihtiyaç duyan işten önce gelecek biçimde sıralanmalı. Directed acyclic graph üzerinde bu sıralamanın adı nedir?|Topological sort, her yönlü edge için başlangıç düğümünü hedef düğümden önce yerleştirir.
Bir fonksiyonun son yaptığı iş, başka bir fonksiyon çağrısının sonucunu doğrudan döndürmek; ardından başka işlem yok. Bu çağrı türü nedir?|Tail call, fonksiyonun son işlem konumundaki çağrıdır; runtime destekliyorsa stack frame yeniden kullanılabilir.
`,
 U: `
Bir test, fiyat hesaplayan tek bir fonksiyonu dış bağımlılıklarını değiştirerek izole biçimde kontrol ediyor. Bu test türü nedir?|Unit test, küçük bir kod biriminin davranışını dış sistemlerden bağımsız olarak sınar.
Bağlantı kurmadan datagram gönderen, teslim veya sıralama garantisi vermeyen transport protokolü hangisidir?|UDP, transport katmanında çok az garanti veren datagram iletişimi sağlar.
https://example.com/items?page=2 ifadesi bir kaynağa nereden erişileceğini gösteriyor. Bu adres türünün kısaltması nedir?|URL; scheme, host, path ve isteğe bağlı query gibi bölümlerle bir kaynağın konumunu belirtir.
ASCII karakterlerini bir byte, diğer Unicode code point'lerini en fazla dört byte ile kodlayan biçim hangisidir?|UTF-8, değişken uzunluklu bir encoding'dir ve ASCII byte değerleriyle uyumludur.
Farklı yazı sistemlerindeki karakterlere ve sembollere code point atayan standardın adı nedir?|Unicode, karakterleri ve code point'leri tanımlar; UTF-8 gibi encoding'ler bunları byte'lara dönüştürür.
Kullanıcının uygulamayla etkileştiği butonlar, formlar ve menüler hangi iki harfli terimle ifade edilir?|UI, yazılımla etkileşim kurmak için kullanıcıya bilgi ve kontroller sunan arayüzdür.
Birbiriyle uyumlu iki SELECT sonucunu birleştirip tekrar eden satırları kaldırmak istiyorsunuz. Bunu varsayılan olarak hangi SQL operator yapar?|UNION, tekrar eden satırları kaldırır; UNION ALL ise tekrarları korur.
Tabloda zaten bulunan satırların değerlerini değiştiren SQL komutu hangisidir?|UPDATE, mevcut satırları değiştirir; WHERE ile hangi satırların etkileneceği sınırlandırılabilir.
Pipe kullanımı, küçük araçların birleştirilmesi ve hiyerarşik filesystem yapısıyla bilinen işletim sistemi ailesi hangisidir?|Unix, kendisinden sonraki birçok sistemde kullanılan arayüzlerin ve araç kullanım ilkelerinin temelini oluşturmuştur.
Bir editör, yaptığınız son değişiklikten önceki durumu geri getiriyor. Bu komutun adı nedir?|Undo, kaydedilmiş düzenleme adımlarında geriye giderek önceki durumu geri yükler.
Version 4 değerleri rastgele veya sözde rastgele bitlerle üretilebilen 128 bit'lik tanımlayıcı ailesinin kısaltması nedir?|UUID, tek bir merkezi sayaç gerektirmeden benzersiz tanımlayıcılar üretmek için tasarlanmıştır.
`,
 V: `
Ekibiniz geçmiş değişiklikleri incelemek, branch'lerle çalışmak ve önceki sürümlere dönebilmek istiyor. Bunu sağlayan genel sistem türü nedir?|Version control, zaman içindeki değişiklikleri kaydeder ve revision'lar ile branch'ler üzerinden birlikte çalışmayı destekler.
Bir UI kütüphanesi, görünümün bellekteki gösterimlerini karşılaştırdıktan sonra gerçek DOM'u güncelliyor. Bellekte tuttuğu bu gösterimin adı nedir?|Virtual DOM, UI yapısını bellekte temsil eder ve reconciliation sürecinde kullanılabilir.
Chrome ve Node.js üzerinde JavaScript kodunu çalıştıran engine hangisidir?|V8, JavaScript kodunu derleyip çalıştırır ve WebAssembly desteği de sunar.
Bir hypervisor, guest işletim sistemine sanal CPU, bellek ve cihazlar sunuyor. Bu ortamın adı nedir?|Virtual machine, bir guest sistemi sanallaştırılmış donanım kaynakları üzerinde çalıştırır.
Template, script ve style bölümleri olan .vue uzantılı single-file component'leri kullanan JavaScript UI framework'ü hangisidir?|Vue, component tabanlı arayüzleri ve reaktif bir veri modelini destekler.
Database, bir SELECT tanımını saklayıp sonuç satırlarını ayrıca saklamak zorunda olmadan sanal tablo gibi sunuyor. Bu nesne nedir?|Normal bir view, sorgu tanımını saklar ve o sorgunun sonucunu tablo gibi kullanılabilir hale getirir.
let count = 0 örneğinde olduğu gibi, programın bir değere ad verip daha sonra bu adla erişmesini sağlayan yapıya ne denir?|Variable, dilin scope ve atama kurallarına göre bir değere erişim sağlar.
Uzaktaki bir laptop, şifreli bir tünel üzerinden özel ağa bağlanıyor. Bu teknolojinin üç harfli kısaltması nedir?|VPN, başka bir ağ üzerinden özel ağ bağlantısını genişletir.
Adını Fransızcada hızlı anlamına gelen kelimeden alan ve hot module replacement destekli development server sunan frontend build aracı hangisidir?|Vite, bir development server ile production asset'lerini oluşturmak için gereken araçları sağlar.
Uzunluğu belirlenen üst sınıra kadar değişebilen karakter dizilerini tutan yaygın SQL sütun türü hangisidir?|VARCHAR, değişken uzunlukta karakter verisi tutar; tam sınırları kullanılan database'e bağlıdır.
Dağıtık bir sistemde her node için sayaç tutularak event'lerin nedensel sırası karşılaştırılıyor. Bu logical clock yapısının adı nedir?|Vector clock, kullanılan modele göre event'lerin nedensel olarak sıralı mı yoksa eşzamanlı mı olduğunu ayırt edebilir.
`,
 W: `
Browser ve server, tek bir kalıcı bağlantı üzerinden iki yönde de mesaj gönderiyor. Bunu hangi web protokolü sağlar?|WebSocket, bağlantı kurulduktan sonra çift yönlü mesajlaşma sağlar.
Browser, C veya Rust'tan derlenmiş bir .wasm modülü yüklüyor. Çalıştırılan taşınabilir komut biçiminin adı nedir?|WebAssembly, farklı dillerin hedefleyebildiği bir binary komut biçimidir.
Bir ödeme servisi, ödeme tamamlandığında sizin endpoint'inize HTTP isteği gönderiyor. Bu event bildirim yönteminin adı nedir?|Webhook, bir event oluştuğunda yapılandırılmış HTTP endpoint'ine bildirim gönderir.
Koşulu her turdan önce kontrol edip doğru kaldığı sürece kod bloğunu tekrarlayan döngü anahtar kelimesi hangisidir?|while döngüsü, gövdesini çalıştırmadan önce koşulu değerlendirir.
Bir SQL sorgusu yalnızca status değeri active olan satırları döndürmeli. Satırları süzen clause hangisidir?|WHERE, gruplamadan önce yalnızca koşulu true olan satırları seçer.
Browser'daki yoğun bir hesaplama, sayfayla mesajlaşan ayrı bir JavaScript thread'ine taşınıyor. Bunu hangi API sağlar?|Web Worker, sayfanın main thread'i dışında çalışır ve DOM'a doğrudan müdahale edemez.
Bir şirket, farklı ülkelerdeki ofis ağlarını birbirine bağlıyor. Bu coğrafi ölçekteki ağ türünün üç harfli kısaltması nedir?|WAN, geniş bir coğrafi alana yayılmış ağları birbirine bağlar.
Dependency graph oluşturup loader ve plugin'lerle bundle üreten JavaScript module bundler hangisidir?|Webpack, modülleri ve ilgili asset'leri dependency graph üzerinden dönüştürüp paketler.
Bir laptop, IEEE 802.11 tabanlı kablosuz yerel ağa bağlanıyor. Bu teknolojinin yaygın adı nedir?|Wi-Fi, IEEE 802.11 ailesini kullanarak kablosuz yerel ağ bağlantısı sağlar.
Bir browser uygulamasının gerçek zamanlı peer-to-peer ses, video ve data channel desteğine ihtiyacı var. Bunu hangi web teknolojisi sağlar?|WebRTC, peer'ler arası iletişimi destekler; doğrudan bağlantı kurulamazsa relay server kullanılabilir.
Database'te değişen veri sayfaları diske kalıcı yazılmadan önce ilgili değişiklikler bir recovery log'a kaydediliyor. Bu durability tekniği nedir?|Write-ahead logging, veri sayfalarından önce onlara ait log kayıtlarının kalıcı depolamaya yazılmasını gerektirir.
`,
 Y: `
Bir ekip arkadaşı, gerçek bir ihtiyaç doğana kadar varsayımsal bir plugin sistemi geliştirmeye karşı çıkıyor. "You Aren't Gonna Need It" ilkesinin kısaltması nedir?|YAGNI, henüz ihtiyaç olmayan özelliklerin önceden geliştirilmemesini önerir.
JavaScript generator'ını duraklatıp çağırana bir değer veren anahtar kelime hangisidir?|yield, generator'ın çalışmasını iterator yeniden devam ettirilene kadar duraklatır.
Bir yapılandırma dosyasında mapping ve sequence yapıları girintilerle ve key: value satırlarıyla yazılıyor. Bu veri biçimi hangisidir?|YAML, yapılandırma dosyalarında sık kullanılan, insan tarafından okunabilir bir serialization biçimidir.
Bağımlılıkların çözümlenmiş sürümlerini yarn.lock dosyasında tutan JavaScript paket yöneticisi hangisidir?|Yarn, proje bağımlılıklarını yönetir ve resolution bilgilerini lockfile'a kaydeder.
Adı Yet Another Compiler-Compiler ifadesinden gelen, grammar tanımından parser üreten klasik aracın adı nedir?|Yacc, grammar kuralları ve bunlarla eşleştirilmiş işlemlerden parser üretir.
C benzeri bir dilde yanlışlıkla atama yapmayı fark etmek için karşılaştırma 5 == count biçiminde, sabit solda yazılıyor. Bu stilin takma adı nedir?|Yoda condition, operand sırasını ters çevirir; böylece sabit bir değere atama yapılması geçersiz olur.
Unix zamanını signed 32-bit sayı olarak tutan bir sayaç, Ocak 2038'de aralığını aşıyor. Bu zaman gösterimi sorununun adı nedir?|Year 2038 problem, Unix saniyelerini signed 32-bit tam sayıyla temsil eden sistemleri etkiler.
Eski bir yazılım yılları iki haneli tuttuğu için 00 değerini 2000 yerine 1900 olarak yorumlayabiliyor. Bu tarihsel hatanın adı nedir?|Y2K bug, milenyum geçişinde yıl gösteriminin yetersiz veya belirsiz olmasından kaynaklanıyordu.
YB simgesiyle gösterilen ve 10 üzeri 24 byte'a eşit olan ondalık depolama birimi hangisidir?|Bir yottabyte, 1000 zettabyte'a eşittir; ondalık birimler onun kuvvetlerini kullanır.
Y bileşeni luma'yı, U ve V bileşenleri chrominance bilgisini temsil eden üç harfli renk modeli hangisidir?|YUV, analog videoda parlaklıkla ilgili bilgiyi renk farkı bilgisinden ayırır.
Untyped lambda calculus içinde bir fonksiyonun kendi adını kullanmadan recursive tanımlanmasını sağlayan fixed-point combinator hangisidir?|Y-combinator bir fixed point sağlar; eager evaluation kullanan dillerde uygun bir düzenleme veya farklı bir combinator gerekir.
`,
 Z: `
Saldırganlar, düzeltmesi henüz bulunmayan ve savunma tarafının hazırlık yapma fırsatı bulamadığı bir açığı kullanıyor. Bu exploit türünün adı nedir?|Zero-day exploit, savunma tarafının önceden bir düzeltme uygulama fırsatı olmadığı açığı hedefler.
Position verilmiş bir CSS elemanının, aynı stacking context içindeki kardeşinin üstünde görünmesi gerekiyor. Sıralamayı hangi property belirler?|z-index, elemanları kendi stacking context'leri içinde sıralar; büyük bir değer parent stacking context'in dışına çıkarmaz.
Birden fazla dosyayı tek arşivde toplayan ve genellikle her dosyayı sıkıştıran arşiv biçimi hangisidir?|ZIP, dosyaları ve metadata'yı saklar; sıkıştırılmamış kayıt dahil farklı sıkıştırma yöntemlerini destekler.
comptime ile derleme sırasında kod çalıştıran, manual memory management ve C interoperability sunan sistem programlama dili hangisidir?|Zig, bellek ayırmayı açıkça kontrol etmeyi ve derleme sırasında hesaplama yapmayı destekler.
Bir güvenlik modelinde istek, sırf kurum ağının içinden geldiği için otomatik olarak güvenilir sayılmıyor. Bu modelin adı nedir?|Zero trust, erişimi yalnızca ağ konumuna göre değil kimlik, bağlam ve policy gibi ölçütlere göre değerlendirir.
Yeni sürüm yayına alınırken kullanıcılar hizmeti kesintisiz kullanmaya devam ediyor. Bu deployment hedefinin adı nedir?|Zero downtime deployment, sürüm değişikliği boyunca hizmetin kullanılabilir kalmasını amaçlar.
Bir Unix child process sonlanmış ama parent process çıkış durumunu henüz toplamamış. Process tablosunda kalan bu kaydın adı nedir?|Zombie process, parent veya sorumlu başka bir process tarafından toplanana kadar sonlanma bilgisini tutar.
Bir I/O işleminde user-space ve kernel buffer'ları arasındaki gereksiz veri kopyaları önleniyor. Bu optimizasyon tekniğinin adı nedir?|Zero-copy, kopyalama maliyetini azaltır; hangi kopyaların önlendiği sisteme ve API'ye bağlıdır.
Z shell olarak da bilinen, ayarları .zshrc dosyasında tutulan Unix shell hangisidir?|Zsh, script çalıştırma ve completion özellikleri sunan etkileşimli bir command interpreter'dır.
zstd olarak kısaltılan ve ayarlanabilir sıkıştırma seviyeleri sunan kayıpsız sıkıştırma algoritması hangisidir?|Zstandard, hız ile sıkıştırma oranı arasında denge kurar; uygun işlerde dictionary de kullanabilir.
Yapılandırma ve leader koordinasyonu gibi işler için znode'lardan oluşan hiyerarşik bir isim alanı sunan Apache servisi hangisidir?|ZooKeeper, sıralı güncellemeler ve hiyerarşik veri modeli üzerinden dağıtık koordinasyon için temel yapılar sağlar.
`,
};

export const turkishQuestions = Object.fromEntries(
 Object.entries(groups).flatMap(([letter, rows]) => rows.trim().split('\n').map((row, index) => {
  const [text, explanation] = row.split('|');
  return [index === 0 ? letter.toLowerCase() : `${letter}-${index}`, { text, explanation }];
 })),
);
