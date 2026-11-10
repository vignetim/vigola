// Each line gives the category, answer, clue, and explanation, in that order.
export const questionVariants = {
 A: `
Veri yapıları|Ağaç|Kökü olan ve düğümlerin alt düğümlere ayrıldığı hiyerarşik veri yapısına ne denir?|Bir ağaçta kök dışındaki her düğümün tek bir ebeveyni vardır.
Veritabanı|ACID|Veritabanı işlemlerinde atomiklik, tutarlılık, yalıtım ve kalıcılığı ifade eden kısaltma nedir?|Bu dört özellik, işlemlerin güvenilir biçimde yürütülmesini tanımlar.
JavaScript|Array|JavaScript’te birden fazla değeri sıralı ve indeksli biçimde saklayan yerleşik nesne türünün İngilizce adı nedir?|Diziler sıfır tabanlı indeksler kullanır.
Yazılım mimarisi|Adapter|Uyumsuz arayüzlere sahip iki bileşeni araya bir dönüştürücü koyarak birlikte çalıştıran tasarım deseni nedir?|Adapter, mevcut arayüzü çağıranın beklediği arayüze çevirir.
JavaScript|Await|Bir async fonksiyonda bir Promise’in sonucunu beklemek için kullanılan anahtar sözcük nedir?|Await, fonksiyonun devamını sonuca kadar erteler.
Programlama|Abstraction|Uygulama ayrıntılarını gizleyip sadece gerekli işlemleri dışarı açma ilkesinin İngilizce adı nedir?|Soyutlama, bir bileşeni iç ayrıntılarını bilmeden kullanmayı sağlar.
Test|Assertion|Bir testte beklenen koşul yanlışsa testi başarısız yapan kontrolün İngilizce adı nedir?|Assertion, gerçek davranışı beklenen koşulla karşılaştırır.
Web geliştirme|ARIA|Web arayüzlerinde rol ve durumları yardımcı teknolojilere bildiren özellikler kümesinin kısaltması nedir?|ARIA, erişilebilirlik ağacına anlamsal bilgi ekler.
Geliştirici araçları|Alias|Bir komuta kısa veya alternatif bir ad atamanın İngilizce adı nedir?|Kabuk alias’ı kısa adı başka bir komutla değiştirir.
Web geliştirme|Angular|Google tarafından geliştirilen, bileşen tabanlı TypeScript web çatısının adı nedir?|Angular yönlendirme ve bağımlılık enjeksiyonu gibi araçlar sunar.
`,
 B: `
Geliştirici araçları|Branch|Git’te belirli bir commit’i işaret eden ve yeni commit’lerle ilerleyen geliştirme hattının İngilizce adı nedir?|Branch, dallara birbirinden bağımsız ilerleme olanağı sağlar.
Programlama|Boolean|Yalnızca doğru ve yanlış değerlerini alabilen veri türünün adı nedir?|Boolean değerleri mantıksal koşullarda kullanılır.
Algoritmalar|Bubble sort|Yan yana duran elemanları kıyaslayıp yanlış sıradaysa yerlerini değiştiren sıralama algoritması nedir?|Kabarcık sıralaması ardışık geçişlerle çalışır.
Ağ|Bandwidth|Bir ağ bağlantısının birim zamanda taşıyabileceği veri kapasitesinin İngilizce adı nedir?|Kapasite genellikle bit/saniye ile ifade edilir.
Veri yapıları|Bloom filter|Bir elemanın kesinlikle bulunmadığını veya muhtemelen bulunduğunu söyleyebilen olasılıksal veri yapısı nedir?|Bloom filter yanlış pozitif verebilir.
Programlama|Break|Bir döngüyü bulunduğu noktada sonlandırmak için kullanılan yaygın anahtar sözcük nedir?|Break, kontrolü döngünün sonrasına taşır.
Geliştirici araçları|Breakpoint|Hata ayıklayıcının programı belirli bir satırda durdurması için konulan işaretin adı nedir?|Durma noktasında değişkenler ve çağrı yığını incelenebilir.
Kodlama|Base64|İkili veriyi 64 karakterli bir alfabe kullanarak metinle temsil eden kodlama nedir?|Base64 şifreleme değil, gösterim biçimidir.
Programlama|Bytecode|Sanal makineye yönelik, kaynak kodla makine kodu arasındaki komut gösterimine ne denir?|JVM sınıf dosyaları bu tür komutlar içerir.
Yazılım mimarisi|Backpressure|Tüketici yetişemediğinde üreticinin veri gönderme hızını azaltmasını sağlayan mekanizmanın adı nedir?|Backpressure kuyrukların kontrolsüz büyümesini önlemeye yardımcı olur.
`,
 C: `
Web geliştirme|CSS|Web sayfalarının renklerini, boşluklarını ve yerleşimini tanımlayan stil dilinin kısaltması nedir?|Cascading Style Sheets sunumu düzenler.
Web geliştirme|Cookie|Tarayıcının saklayıp ilgili HTTP isteklerine ekleyebildiği küçük ad-değer verisine ne denir?|Çerezler oturum kimlikleri gibi bilgileri taşıyabilir.
Geliştirici araçları|Commit|Git geçmişindeki, bir proje anlık görüntüsünü ve üst kayıtlarını tanımlayan kayda ne denir?|Commit, mesaj ve yazar bilgisi de taşır.
Programlama|Compiler|Kaynak kodu başka bir hedef dile veya makine komutlarına çeviren aracın İngilizce adı nedir?|Derleyicinin çıktısı hedef platforma göre değişir.
Web geliştirme|Canvas|HTML’de JavaScript ile piksel tabanlı çizim yapılabilen öğenin adı nedir?|Canvas oyun ve grafik çiziminde kullanılabilir.
Yazılım mimarisi|Cache|Tekrar istenmesi olası sonuçları hızlı erişim için geçici olarak saklayan katmanın İngilizce adı nedir?|Önbellek kaynak sisteme yapılan işi azaltır.
Programlama|Callback|Başka bir fonksiyona verilerek belirli bir olay gerçekleştiğinde çağrılan fonksiyona ne denir?|Callback, çağrının ne zaman yapılacağını alıcıya bırakır.
Veritabanı|Cursor|Bir sorgunun sonuçları üzerinde konumu takip edip satır satır ilerlemeye yarayan yapının adı nedir?|Cursor, sonuç kümesindeki geçerli konumu tutar.
DevOps|Canary deployment|Yeni sürümü önce kullanıcıların küçük bir bölümüne vererek izleme yapılan dağıtım stratejisi nedir?|Sorun görülmezse yeni sürümün payı artırılabilir.
Programlama|Composition|Karmaşık bir nesneyi, içinde başka nesneler kullanarak oluşturmanın İngilizce adı nedir?|Composition bir «sahiptir» ilişkisi kurar.
`,
 D: `
Ağ|DNS|Alan adlarını IP adresleri gibi kayıtlara çözümleyen dağıtık sistemin kısaltması nedir?|Domain Name System farklı kayıt türleri destekler.
Veritabanı|DDL|SQL’de tablo oluşturma ve şema değiştirme komutlarının ait olduğu dil grubunun kısaltması nedir?|CREATE ve ALTER, Data Definition Language komutlarıdır.
JavaScript|Destructuring|Bir dizi veya nesneden birden çok değeri kalıpla değişkenlere ayıran JavaScript sözdiziminin adı nedir?|Destructuring, iç içe değerleri de bağlayabilir.
Programlama|Deadlock|İki işlemin birbirinin tuttuğu kaynağı beklediği ve hiçbirinin ilerleyemediği duruma ne denir?|Döngüsel bekleme işlemleri kilitli bırakabilir.
Veri yapıları|Deque|Hem başından hem sonundan eleman eklenip çıkarılabilen kuyruğun adı nedir?|Double-ended queue iki uçlu erişim sağlar.
Yazılım mimarisi|Decorator|Bir nesneyi aynı arayüzü sunan başka bir nesneyle sararak davranış ekleyen desen nedir?|Decorator davranışı sarma yoluyla genişletir.
Algoritmalar|Dijkstra|Negatif olmayan kenar ağırlıklarıyla tek kaynaktan en kısa yolları bulan algoritma hangisidir?|Algoritma bilinen en kısa geçici uzaklığı olan düğümü ilerletir.
Web geliştirme|DOM|Tarayıcıda bir belgeyi düğümlerden oluşan bir ağaç olarak sunan modelin kısaltması nedir?|Document Object Model programların belgeyi okumasını ve değiştirmesini sağlar.
Programlama|Debugging|Bir yazılım hatasının nedenini bulup düzeltme sürecinin İngilizce adı nedir?|Hata ayıklamada durum ve yürütme adımları incelenir.
Veri biçimleri|Delimiter|Bir metinde alanları birbirinden ayıran virgül gibi karakterin İngilizce adı nedir?|CSV dosyalarında ayırıcı çoğunlukla virgüldür.
`,
 E: `
Geliştirici araçları|ESLint|JavaScript kaynak kodunu yapılandırılabilir kurallarla denetleyen aracın adı nedir?|ESLint sorunları raporlayabilir ve bazılarını düzeltebilir.
Programlama|Enum|Bir değerin alabileceği adlandırılmış sabitler kümesini tanımlayan türün kısa adı nedir?|Enum durum veya yön gibi seçenekleri ifade edebilir.
Yazılım mimarisi|Encapsulation|Veriyi ve onu işleyen davranışları bir arada tutup iç duruma erişimi denetleme ilkesinin İngilizce adı nedir?|Kapsülleme nesnenin durumunu tanımlı arayüz üzerinden korur.
Ağ|Ethernet|Yerel ağlarda yaygın kullanılan IEEE 802.3 standart ailesinin adı nedir?|Ethernet çerçeveleri bağlantı katmanında taşınır.
Veritabanı|ETL|Veriyi kaynaktan çıkarma, dönüştürme ve hedefe yükleme sürecinin kısaltması nedir?|Extract, Transform, Load veri hatlarında sık kullanılır.
Yazılım mimarisi|Event sourcing|Bir varlığın durumunu değişiklik olaylarının sıralı kaydından yeniden kuran yaklaşımın adı nedir?|Olaylar geçmişi temsil eder ve yeniden oynatılabilir.
Programlama|Exception|Normal yürütme akışını kesip bir hata işleyicisine aktarılabilen durumun İngilizce adı nedir?|Exception yakalanabilir veya çağırana aktarılabilir.
Web geliştirme|Endpoint|Bir API’de belirli bir işleme erişilen adresin yaygın İngilizce adı nedir?|HTTP API’lerinde adres ve yöntem birlikte işlemi belirler.
Yazılım mimarisi|Eventual consistency|Yeni yazmalar durduğunda kopyaların zamanla aynı duruma yakınsadığı tutarlılık modelinin adı nedir?|Kopyalar geçici olarak farklı değerler gösterebilir.
Programlama|Expression|Değerlendirildiğinde bir değer üreten kod parçasının İngilizce adı nedir?|Aritmetik işlemler ve fonksiyon çağrıları ifade olabilir.
`,
 F: `
Geliştirici araçları|Fork|Bir kaynak deponun kendi hesabında bağımsız olarak geliştirilebilen kopyasına ne denir?|Fork, orijinal depoya değişiklik önermek için kullanılabilir.
Programlama|Float|Kesirli sayıları kayan noktalı biçimde temsil eden yaygın türün kısa adı nedir?|Kayan nokta bazı ondalık değerleri yaklaşık olarak saklar.
Yazılım mimarisi|Facade|Karmaşık bir alt sisteme daha basit tek bir arayüz sunan tasarım deseni nedir?|Facade, birden çok alt bileşenin kullanımını kolaylaştırır.
Yazılım mimarisi|Factory Method|Oluşturulacak nesnenin somut türüne alt sınıfların karar verebilmesini sağlayan yaratım deseni nedir?|Desen nesne yaratmayı kullanım kodundan ayırır.
DevOps|Feature flag|Bir özelliği yeni kod dağıtmadan açıp kapatmaya yarayan çalışma zamanı ayarı nedir?|Bir bayrak yalnızca belirli kullanıcılara da açılabilir.
Algoritmalar|Fibonacci|İlk iki terimden sonra her terimi önceki iki terimin toplamı olan dizi hangi adla bilinir?|Dizi 0, 1, 1, 2, 3, 5 biçiminde başlayabilir.
Veritabanı|Foreign key|Bir tablodaki değerleri başka bir anahtarın değerleriyle ilişkilendiren kısıtın İngilizce adı nedir?|Yabancı anahtar referans bütünlüğünü korur.
Web geliştirme|Flexbox|CSS’te öğeleri tek bir ana eksen boyunca dizmek için kullanılan yerleşim modeli nedir?|Flexbox satır veya sütun yönünde hizalama sağlar.
Ağ|Firewall|Ağ trafiğini kurallara göre kabul eden veya engelleyen sistemin İngilizce adı nedir?|Güvenlik duvarı giriş ve çıkış trafiğini filtreleyebilir.
Yazılım mimarisi|Failover|Bir bileşen arızalanınca iş yükünün yedek bileşene aktarılması işlemine ne denir?|Failover hizmetin erişilebilirliğini sürdürmeye yardımcı olur.
`,
 G: `
Programlama|Garbage collector|Artık erişilemeyen nesnelerin belleğini otomatik geri alan bileşenin İngilizce adı nedir?|Çöp toplayıcı kullanılmayan belleği yeniden kullanılabilir kılar.
Ağ|Gateway|Farklı ağlar arasında geçiş noktası oluşturan bileşenin İngilizce adı nedir?|Ağ geçidi trafiği başka bir ağa yönlendirebilir.
Programlama|Generic|Aynı kodu farklı türlerle kullanmayı sağlayan tür parametresine dayalı tekniğin adı nedir?|Generics, tür güvenli yeniden kullanımı destekler.
JavaScript|Generator|Yield ile duraklatılıp daha sonra devam ettirilebilen fonksiyon türünün adı nedir?|Generator değerleri gerektiğinde üretir.
Web geliştirme|GraphQL|İstemcinin istediği alanları açıkça belirttiği, şema tabanlı API sorgu dilinin adı nedir?|GraphQL sorguları alanları ve iç içe ilişkileri seçebilir.
Ağ|gRPC|Protocol Buffers ile sık kullanılan uzak yordam çağrısı çatısının adı nedir?|gRPC istemci ve sunucu arasında tanımlı servis çağrıları sağlar.
Donanım|GPU|Grafik işlemleri ve yoğun paralel hesaplamalar için kullanılan işlemcinin kısaltması nedir?|Graphics Processing Unit çok sayıda işlemi paralel yürütebilir.
Veritabanı|GROUP BY|SQL’de satırları ortak sütun değerlerine göre kümelere ayıran ifade nedir?|Her grup üzerinde COUNT veya SUM gibi işlemler yapılabilir.
Web geliştirme|Grid|CSS’te satırları ve sütunları birlikte düzenleyen iki boyutlu yerleşim modelinin adı nedir?|Grid, öğeleri tanımlı satır ve sütunlara yerleştirebilir.
Geliştirici araçları|grep|Unix kabuğunda verilen desene uyan metin satırlarını yazdıran komut nedir?|grep düzenli ifadelerle arama yapabilir.
`,
 H: `
Ağ|HTTP|Tarayıcı ve web sunucusu arasında istek ve yanıtların taşınmasını tanımlayan protokolün kısaltması nedir?|Hypertext Transfer Protocol web kaynaklarına erişimde kullanılır.
Ağ|HTTPS|HTTP iletişiminin TLS ile korunmuş biçiminin adı nedir?|HTTPS bağlantıda gizlilik ve bütünlük sağlar.
Veri yapıları|Hash table|Anahtarı bir özet fonksiyonuyla kovaya eşleyerek değer saklayan veri yapısı nedir?|Hash table, çakışan anahtarları ele almak için bir yöntem kullanır.
Veri yapıları|Heap|Ebeveynlerin çocuklarından küçük veya eşit olması gibi bir öncelik kuralıyla düzenlenen yapının adı nedir?|Heap, öncelik kuyruğu uygulamakta kullanılır.
Veritabanı|HAVING|SQL’de gruplama tamamlandıktan sonra grupları süzen ifade hangisidir?|HAVING toplulaştırılmış değerler üzerinde koşul kurabilir.
Ağ|Header|HTTP istek veya yanıtında içerik türü gibi üstveri taşıyan ad-değer alanına ne denir?|HTTP başlıkları mesaj hakkında bilgi verir.
Kriptografi|HMAC|Gizli anahtar ve özet fonksiyonu ile mesaj bütünlüğünü doğrulayan yapının kısaltması nedir?|HMAC doğrulaması aynı gizli anahtarı kullanır.
Ağ|Hostname|Bir ağdaki makineye atanmış okunabilir adın İngilizce karşılığı nedir?|Hostname, bir alan adının parçası olabilir.
Donanım|HDD|Veriyi dönen manyetik plakalar üzerinde tutan depolama aygıtının kısaltması nedir?|Hard disk drive mekanik hareketli parçalar kullanır.
Yazılım mimarisi|Hexagonal architecture|Uygulama çekirdeğini dış dünyadan portlar ve adaptörlerle ayıran mimarinin İngilizce adı nedir?|Dış sistemler portlara bağlanan adaptörlerle değiştirilir.
`,
 İ: `
Programlama|İş parçacığı|Bir süreç içinde çalışabilen ve diğerleriyle aynı adres alanını paylaşabilen yürütme birimine ne denir?|Thread’ler kaynakları paylaşırken ayrı çağrı yığınlarına sahip olabilir.
Programlama|İşletim sistemi|Donanımı ve süreçleri yönetip uygulamalara temel hizmetleri sağlayan yazılım katmanı nedir?|Linux ve Windows işletim sistemlerine örnektir.
Programlama|İkili sistem|Sayıları 0 ve 1 rakamlarıyla gösteren sayı sisteminin adı nedir?|İkili sistem 2 tabanlıdır.
Programlama|İşaretçi|Bir bellek adresini tutan değişken türünün Türkçe adı nedir?|İşaretçi üzerinden adresin gösterdiği veriye erişilebilir.
Veritabanı|İşlem|Birlikte başarıya ulaşması veya geri alınması gereken veritabanı adımları kümesinin Türkçe adı nedir?|Transaction birden çok yazmayı tek mantıksal birime bağlayabilir.
Veritabanı|İlişkisel model|Veriyi tablolar, satırlar ve sütunlar olarak düzenleyen veritabanı modelinin adı nedir?|Tablolar arasındaki bağlantılar anahtarlarla ifade edilebilir.
Ağ|İstemci|İstek gönderip sunucunun sunduğu hizmeti kullanan tarafın Türkçe adı nedir?|Tarayıcı bir web istemcisi olarak çalışır.
Programlama|İterasyon|Bir döngü gövdesinin tek bir tekrarına ne denir?|Her iterasyonda döngü bir adım ilerler.
Programlama|İşlev imzası|Bir fonksiyonun çağrılabilmesi için adını ve parametre düzenini tarif eden bilginin Türkçe adı nedir?|Dile göre türler ve dönüş bilgisi de tanımda yer alabilir.
Algoritmalar|İkili arama ağacı|Her düğümün sol alt ağacında küçük, sağ alt ağacında büyük anahtarların bulunduğu yapıya ne denir?|Sıralama kuralı aramada hangi dala inileceğini belirler.
`,
 J: `
Programlama|Java|Kaynak kodu genellikle JVM bytecode’una derlenen, sınıf tabanlı dilin adı nedir?|Java programları uyumlu JVM’lerde çalıştırılabilir.
Web geliştirme|JavaScript|Tarayıcılarda etkileşimli web davranışları için kullanılan, ECMAScript standardına dayanan dil hangisidir?|JavaScript istemci ve sunucu tarafında çalışabilir.
Programlama|JVM|Java sınıf dosyalarındaki komutları çalıştıran sanal makinenin kısaltması nedir?|Java Virtual Machine başka dillerin çıktısını da çalıştırabilir.
Veritabanı|JOIN|SQL’de ilişkili sütunlar üzerinden birden fazla tablonun satırlarını birleştiren işlem nedir?|JOIN türü eşleşmeyen satırların nasıl ele alınacağını belirler.
Kodlama|JPEG|Fotoğraflar için yaygın kullanılan kayıplı görüntü sıkıştırma biçiminin kısaltması nedir?|JPEG yüksek sıkıştırmada bazı görüntü ayrıntılarını kaybedebilir.
Programlama|JIT|Program çalışırken komutları makine koduna derleyen yaklaşımın kısaltması nedir?|Just-in-time derleme, çalışma sırasında optimizasyon yapabilir.
Test|JUnit|Java ekosisteminde yaygın kullanılan birim testi çatısının adı nedir?|JUnit testleri keşfedip çalıştırmak için araçlar sağlar.
DevOps|Jenkins|Otomasyon hatlarıyla derleme ve test çalıştırabilen açık kaynak otomasyon sunucusunun adı nedir?|Jenkins sürekli entegrasyon süreçlerinde kullanılabilir.
Web geliştirme|JSX|JavaScript içinde HTML benzeri bileşen sözdizimi yazmayı sağlayan uzantının adı nedir?|JSX, araç zinciri tarafından JavaScript çağrılarına çevrilir.
Web geliştirme|JSON Schema|Bir JSON belgesinin beklenen alanlarını, türlerini ve kısıtlarını tanımlayan standardın adı nedir?|JSON Schema veriyi doğrulamakta kullanılabilir.
`,
 K: `
Veri yapıları|Kuyruk|İlk giren öğenin ilk çıktığı FIFO veri yapısının Türkçe adı nedir?|Kuyruk, işleri geliş sırasıyla tutabilir.
Programlama|Kapsam|Bir değişken adına programın hangi bölümlerinden erişilebildiğini belirleyen kavram nedir?|Scope sözcüksel blok veya fonksiyon sınırlarına bağlı olabilir.
DevOps|Konteyner|Bir uygulamayı bağımlılıklarıyla izole eden ve ev sahibi çekirdeğini paylaşan birime ne denir?|Konteynerler genellikle ayrı bir işletim sistemi çekirdeği çalıştırmaz.
Programlama|Kalıtım|Bir sınıfın başka bir sınıfın davranış ve özelliklerini devralması ilkesinin Türkçe adı nedir?|Alt sınıf bazı davranışları özelleştirebilir.
Donanım|Kernel|İşletim sisteminde donanım erişimi, bellek ve süreçler gibi temel kaynakları yöneten çekirdeğin İngilizce adı nedir?|Kernel, sistem çağrılarıyla uygulamalara hizmet sunar.
DevOps|Kustomize|Kubernetes manifestlerini şablon dili kullanmadan taban ve katmanlarla özelleştiren aracın adı nedir?|Kustomize yamaları taban kaynaklarına uygular.
Programlama|Kotlin|JetBrains tarafından geliştirilen ve Android uygulamalarında yaygın kullanılan dil hangisidir?|Kotlin JVM üzerinde Java ile birlikte çalışabilir.
Yazılım mimarisi|Kafka|Yüksek hacimli olay akışlarını bölümlere ayrılmış konularda tutan Apache projesinin adı nedir?|Üreticiler olay yazar, tüketiciler konulardan okur.
Programlama|Kısa devre değerlendirme|Bir mantıksal işlemin sonucu belli olduğunda sağ tarafın hiç değerlendirilmemesine ne denir?|Örneğin false && çağrı() ifadesinde çağrı yapılmaz.
Programlama|Kritik bölüm|Paylaşılan kaynağa erişim nedeniyle aynı anda çalıştırılması denetlenen kod bölgesine ne denir?|Kilitler kritik bölüme eşzamanlı girişleri sınırlayabilir.
`,
 L: `
Programlama|Lambda|Bazı dillerde isimsiz bir fonksiyon tanımlamak için kullanılan yaygın terim nedir?|Lambda bir değişkene atanabilir veya argüman olarak verilebilir.
Yazılım mimarisi|Load balancer|Gelen istekleri birden fazla sunucuya dağıtan bileşenin İngilizce adı nedir?|Yük dengeleyici sağlıklı sunuculara trafik yönlendirebilir.
Web geliştirme|LocalStorage|Tarayıcıda aynı origin için oturum kapandıktan sonra da anahtar ve metin değerlerini tutabilen API nedir?|LocalStorage verileri kullanıcı veya uygulama temizleyene kadar saklanabilir.
Ağ|LAN|Ev, ofis veya okul gibi sınırlı bir alandaki yerel ağın İngilizce kısaltması nedir?|Local Area Network yerel cihazları bağlar.
Yazılım mimarisi|Lazy loading|Veri veya bir bileşeni ilk yüklemede getirmek yerine ihtiyaç anına kadar erteleme tekniği nedir?|Bu yaklaşım başlangıç yükünü azaltabilir.
Programlama|Lexical scope|İsmin hangi değişkene bağlandığını çağrı yerine kodun yazıldığı konumun belirlediği kapsam türü nedir?|Sözcüksel kapsam iç fonksiyonların dış bağlamı kullanmasını sağlar.
Ağ|Latency|Bir isteğin gönderilmesiyle yanıtın alınması arasında geçen gecikmenin İngilizce adı nedir?|Latency çoğunlukla milisaniye cinsinden ölçülür.
Yazılım mimarisi|LRU|Önbellek dolduğunda en uzun süredir erişilmeyen girdiyi çıkaran politikanın kısaltması nedir?|Least Recently Used, son kullanım sırasına bakar.
Programlama|Loop|Bir kod bloğunu bir koşula veya sayaca bağlı olarak tekrar çalıştıran yapının İngilizce adı nedir?|Döngüler for ve while gibi yapılarla yazılabilir.
Veritabanı|LEFT JOIN|SQL’de soldaki tablonun tüm satırlarını koruyan ve sağda eşleşme yoksa boş değer kullanan birleşim hangisidir?|LEFT JOIN eşleşmeyen sağ sütunlar için NULL döndürür.
`,
 M: `
Geliştirici araçları|Merge|Git’te bir dalın değişiklik geçmişini başka bir dala birleştirme işleminin adı nedir?|Birleştirme hızlı ileri sarma veya birleştirme commit’i üretebilir.
Algoritmalar|Merge sort|Diziyi ikiye ayırıp sıralı parçaları birleştiren algoritma hangisidir?|Birleştirmeli sıralama O(n log n) zamanda çalışır.
Web geliştirme|Middleware|Bir web isteği son işleyiciye ulaşmadan önce çalışabilen ara yazılım katmanının İngilizce adı nedir?|Ara yazılım günlükleme veya kimlik denetimi yapabilir.
Veri biçimleri|Markdown|Başlık ve liste gibi biçimleri düz metin işaretleriyle yazmayı sağlayan biçim nedir?|README dosyalarında Markdown sık kullanılır.
Programlama|Memoization|Fonksiyon sonucunu girdiyle eşleyip aynı girdi tekrar geldiğinde hesaplamayı atlama tekniği nedir?|Memoization tekrarlı hesaplama maliyetini azaltır.
Veritabanı|Migration|Şema değişikliklerini sırayla ve sürüm takibiyle uygulayan adımın İngilizce adı nedir?|Migration tablo ve sütun ekleme gibi değişiklikleri tanımlayabilir.
Test|Mock|Testte bir bağımlılığın yerine geçip yapılan çağrıları doğrulamaya izin veren nesneye ne denir?|Mock, bağımlılığın beklenen biçimde kullanılıp kullanılmadığını sınar.
Yazılım mimarisi|MVC|Arayüz mimarisinde model, görünüm ve kontrolcüyü ayıran desenin kısaltması nedir?|MVC farklı sorumlulukları ayrı parçalara böler.
Programlama|Mutex|Bir kaynağa aynı anda tek yürütme biriminin erişmesini sağlayan karşılıklı dışlama kilidinin kısa adı nedir?|Mutex tutan iş parçacığı kilidi bırakana kadar diğerleri bekleyebilir.
Web geliştirme|Media query|Ekran genişliği gibi cihaz koşullarına göre CSS kurallarını seçen yapı nedir?|Media query duyarlı arayüzlerde kullanılır.
`,
 N: `
Veritabanı|NoSQL|Belge, anahtar-değer veya grafik gibi ilişkisel olmayan veri modellerini kapsayan terim nedir?|NoSQL ürünleri farklı veri modelleri ve sorgu yetenekleri sunar.
Programlama|Null|Bir değerin bilerek mevcut olmadığını ifade eden yaygın sözcük nedir?|Null birçok dilde boş referansı veya değer yokluğunu belirtir.
Geliştirici araçları|npm|Node.js ekosisteminde paket yüklemek ve proje komutları çalıştırmak için kullanılan aracın adı nedir?|npm bağımlılıkları package.json üzerinden yönetebilir.
Programlama|Namespace|Aynı ada sahip öğelerin çakışmasını önlemek için kullanılan ad alanının İngilizce adı nedir?|Namespace, isimleri gruplandırır.
Ağ|NAT|Paketlerdeki ağ adreslerinin geçiş sırasında dönüştürülmesi tekniğinin kısaltması nedir?|NAT özel ağdaki cihazların dış ağa çıkmasına yardımcı olabilir.
Web geliştirme|Nginx|Ters vekil ve yük dengeleyici olarak da kullanılan yaygın açık kaynak web sunucusunun adı nedir?|Nginx istekleri arka uçlara yönlendirebilir.
Veritabanı|Normalizasyon|Veritabanında veri tekrarını ve güncelleme tutarsızlıklarını azaltmak için şemanın düzenlenmesine ne denir?|Normalizasyon bağımlılıkları uygun tablolara ayırır.
Programlama|NaN|JavaScript’te sayısal işlemin geçerli bir sayı üretmediğini belirten özel değer nedir?|NaN, Not a Number ifadesinin kısaltmasıdır.
Ağ|NTP|Ağ üzerindeki cihazların saatlerini eşlemek için kullanılan protokolün kısaltması nedir?|Network Time Protocol sistem saatlerini zaman kaynaklarına yaklaştırır.
Web geliştirme|Next.js|App Router ve sunucu tarafı render desteği sunan React çatısının adı nedir?|Next.js dosya tabanlı yönlendirme sağlar.
`,
 O: `
Yazılım mimarisi|Observer|Bir nesne değiştiğinde kayıtlı abonelerine bildirim gönderen tasarım deseni hangisidir?|Observer, yayıncıyı abonelerin somut uygulamasından ayırır.
Veritabanı|ORM|Nesnelerle ilişkisel veritabanı tabloları arasında eşleme yapan yaklaşımın kısaltması nedir?|Object-relational mapping satırları nesne olarak kullanmayı kolaylaştırır.
Programlama|Overloading|Aynı isimde fakat farklı parametre imzalarında birden fazla fonksiyon tanımlamaya ne denir?|Derleyici uygun imzayı çağrıdaki argümanlardan seçebilir.
Programlama|Overriding|Bir alt sınıfın devraldığı metodun davranışını kendi uygulamasıyla değiştirmesine ne denir?|Çağrı alt sınıfın uygulamasına yönlenebilir.
Web geliştirme|Origin|Tarayıcının protokol, alan adı ve port birleşimiyle tanımladığı güvenlik sınırına ne denir?|Aynı origin için üç bileşenin de eşleşmesi gerekir.
Veritabanı|ORDER BY|SQL’de sorgu sonuçlarının hangi alanlara göre sıralanacağını belirten ifade nedir?|ORDER BY artan veya azalan sıralamayı seçebilir.
Algoritmalar|O(1)|Girdi büyüklüğünden bağımsız sabit zaman karmaşıklığının gösterimi nedir?|Sabit sayıda işlem girdiyle birlikte büyümez.
Ağ|OSI|Ağ iletişimini yedi katmana ayıran referans modelinin kısaltması nedir?|Katmanlar fiziksel ortamdan uygulamaya kadar uzanır.
Programlama|Operand|Bir işlecin üzerinde çalıştığı sayıya veya ifadeye İngilizce ne denir?|3 + 5 ifadesinde 3 ve 5 operand’dır.
DevOps|Observability|Bir sistemin iç durumunu ürettiği günlük, metrik ve izlerden anlayabilme özelliğinin İngilizce adı nedir?|Gözlemlenebilirlik arızaların nedenini araştırmaya yardımcı olur.
`,
 P: `
Programlama|Python|Girintiyi sözdiziminin bir parçası olarak kullanan ve veri bilimiyle otomasyonda yaygın olan dil hangisidir?|Python’da girinti kod bloklarını tanımlar.
Veritabanı|Primary key|Bir tablodaki her satırı benzersiz olarak tanımlayan kısıtın İngilizce adı nedir?|Birincil anahtar bir veya birden çok sütundan oluşabilir.
Programlama|Polymorphism|Aynı arayüz çağrısının farklı nesnelerde farklı davranabilmesi ilkesinin İngilizce adı nedir?|Çok biçimlilik, çağıranın somut türü bilmesini gerektirmez.
Web geliştirme|Progressive Web App|Web üzerinden sunulan ve desteklenen cihazlarda uygulama gibi yüklenebilen deneyimin yaygın adı nedir?|PWA, web teknolojileriyle uygulama benzeri özellikler sunar.
Veri yapıları|Priority queue|İlk gelenden önce en yüksek öncelikli öğeyi çıkaran veri yapısının İngilizce adı nedir?|Öncelik kuyruğu bir heap ile uygulanabilir.
Ağ|Port|TCP veya UDP’de bir makinedeki iletişim uç noktasını ayırmak için kullanılan sayı nedir?|Aynı IP üzerinde farklı hizmetler farklı portlar kullanabilir.
Programlama|Parser|Bir komut veya kaynak kod dizisinin dilbilgisine göre yapısını çıkaran bileşenin İngilizce adı nedir?|Parser genellikle bir sözdizimi ağacı üretir.
Geliştirici araçları|Pull request|Bir dalın değişikliklerini incelemeye ve birleştirmeye açan isteğin GitHub’daki adı nedir?|Pull request, kod incelemesini ve otomatik kontrolleri bir araya getirir.
Programlama|Parameter|Fonksiyon tanımında dışarıdan gelen değeri karşılayan adlandırılmış öğenin İngilizce adı nedir?|Çağrı anında parametreye bir argüman verilir.
Programlama|Pure function|Aynı girdilerle aynı çıktıyı veren ve dış durumu değiştirmeyen fonksiyonun İngilizce adı nedir?|Saf fonksiyonlar yan etki üretmez.
`,
 R: `
Programlama|Recursion|Bir problemin, aynı fonksiyonun daha küçük girdilerle kendini çağırmasıyla çözülmesine İngilizce ne denir?|Özyinelemenin durması için bir taban durum gerekir.
Geliştirici araçları|Rebase|Git’te bir dalın commit’lerini başka bir tabanın üzerine yeniden uygulayan işlem hangisidir?|Rebase yeniden uygulanan commit’ler için yeni kimlikler üretir.
Programlama|Regex|Metindeki desenleri tanımlayan düzenli ifadelerin yaygın kısa adı nedir?|Regex metin bulma, değiştirme ve doğrulamada kullanılabilir.
Veritabanı|Redis|String, liste ve küme gibi yapıları destekleyen, bellek içi veri deposunun adı nedir?|Redis önbellek veya hızlı veri deposu olarak kullanılabilir.
Web geliştirme|REST|Kaynaklar ve tek biçimli arayüz üzerine kurulu web mimari stilinin kısaltması nedir?|Representational State Transfer durumsuz iletişim gibi kısıtlar tanımlar.
Programlama|Race condition|Sonucun eşzamanlı işlemlerin sıralamasına bağlı olarak değişmesi sorununa ne denir?|Uygun eşzamanlama paylaşılan durumu koruyabilir.
Veritabanı|Rollback|Bir veritabanı işleminin henüz kalıcılaştırılmamış değişikliklerini geri alan komut nedir?|Rollback işlemi iptal eder.
Programlama|Rust|Sahiplik ve ödünç alma kurallarıyla bellek güvenliği sağlamayı hedefleyen sistem dili nedir?|Rust, çöp toplayıcı olmadan bellek yönetebilir.
Ağ|Router|IP paketlerini hedefe giden uygun ağ yoluna ileten cihazın İngilizce adı nedir?|Yönlendirici iletim kararında yönlendirme tablosunu kullanır.
DevOps|Rate limiting|Bir istemcinin belli sürede gönderebileceği istek sayısının sınırlandırılmasına ne denir?|İstek sınırı kaynakların aşırı kullanımını azaltabilir.
`,
 S: `
Programlama|Singleton|Bir sınıfın tek bir örneğe sahip olmasını sağlayıp bu örneğe erişim sunan desen nedir?|Singleton, örnek oluşturmayı tek noktadan denetler.
Veri yapıları|Set|Aynı öğenin birden fazla kez bulunmadığı koleksiyonun İngilizce adı nedir?|Set üyelik kontrolü ve küme işlemleri için kullanılır.
Programlama|Serialization|Bir nesneyi aktarılabilir veya saklanabilir bir gösterime çevirme işleminin İngilizce adı nedir?|Serileştirme JSON gibi bir çıktı üretebilir.
Programlama|Semaphore|Bir kaynağa aynı anda erişebilecek yürütme birimlerinin sayısını izinlerle denetleyen yapı nedir?|Semaphore mevcut izin sayısını takip eder.
Geliştirici araçları|SSH|Uzak makinede güvenli komut satırı oturumu açmak için kullanılan protokolün kısaltması nedir?|Secure Shell bağlantıyı şifreler ve tarafları doğrulayabilir.
Veritabanı|SQLite|Ayrı bir sunucu süreci gerektirmeden uygulamaya gömülebilen ilişkisel veritabanı motorunun adı nedir?|SQLite bir dosyada veritabanı saklayabilir.
Kodlama|SVG|Görüntüleri XML ile vektör olarak tanımlayan web biçiminin kısaltması nedir?|SVG kalite kaybı olmadan farklı boyutlarda çizilebilir.
DevOps|SLA|Hizmetin erişilebilirliği gibi taahhütleri belirleyen anlaşmanın kısaltması nedir?|Service Level Agreement hizmet sağlayıcısıyla müşteri arasındaki yükümlülükleri tanımlar.
Web geliştirme|Service worker|Web uygulaması adına arka planda çalışıp ağ isteklerini ele alabilen tarayıcı betiğinin adı nedir?|Service worker çevrimdışı erişim için kaynak önbelleğe alabilir.
Programlama|Scope creep|Projeye plan dışında sürekli yeni iş eklenerek kapsamın büyümesine ne denir?|Kapsam genişlemesi süreyi ve maliyeti etkileyebilir.
`,
 T: `
Ağ|TCP|IP üzerinde sıralı ve güvenilir bayt akışı sağlayan taşıma protokolünün kısaltması nedir?|TCP kaybolan verileri yeniden gönderebilir.
Ağ|TLS|HTTPS bağlantılarının gizlilik ve bütünlüğünü sağlayan protokolün kısaltması nedir?|Transport Layer Security bağlantıyı şifreler ve kimlik doğrulamayı destekler.
Veri yapıları|Trie|Karakter dizilerini ortak önekleri paylaşacak biçimde ağaçta saklayan veri yapısı nedir?|Trie önek araması için uygundur.
Test|TDD|Önce başarısız test yazıp sonra testi geçecek kodu üreten geliştirme yaklaşımının kısaltması nedir?|Test-driven development döngüsü test, uygulama ve iyileştirmeden oluşur.
Programlama|Tuple|Birden çok değeri belirli bir sırayla tek bir bileşik değer olarak tutan yapının İngilizce adı nedir?|Tuple alanları farklı türlerde olabilir.
Web geliştirme|Tailwind CSS|Arayüzleri küçük yardımcı sınıfları birleştirerek biçimlendirmeye odaklanan CSS çatısı hangisidir?|Tailwind sınıfları boşluk, renk ve yerleşim gibi stiller uygular.
Yazılım mimarisi|TTL|Bir önbellek girdisinin ne kadar süre geçerli kalacağını ifade eden kısaltma nedir?|Time to live dolunca girdi eski kabul edilir.
Veritabanı|Trigger|Tabloda ekleme veya güncelleme gibi bir olay olduğunda otomatik çalışan veritabanı yapısı nedir?|Tetikleyici belirli olaylara bağlı işlemleri yürütür.
Algoritmalar|Topological sort|Yönlü ve döngüsüz grafikte her düğümü ardıllarından önce yerleştiren sıralamanın İngilizce adı nedir?|Bağımlılıkların çalıştırma sırasını bulmakta kullanılır.
Programlama|Ternary operator|Koşulun sonucuna göre iki değerden birini seçen üç işlenenli işlecin İngilizce adı nedir?|JavaScript bu işlecini koşul ? a : b biçiminde yazar.
`,
 U: `
Ağ|UDP|Bağlantı kurmadan datagram gönderen ve teslim garantisi vermeyen taşıma protokolünün kısaltması nedir?|UDP’nin kendisi sıra veya yeniden iletim garantisi vermez.
Web geliştirme|URL|Bir kaynağın nerede ve nasıl bulunacağını belirten web adresinin kısaltması nedir?|Uniform Resource Locator konum ve erişim bilgisini ifade eder.
Kodlama|UTF-8|Unicode karakterleri bir ila dört baytla kodlayan, ASCII ile uyumlu biçimin adı nedir?|ASCII karakterleri UTF-8’de bir bayt kullanır.
Programlama|Unicode|Yazı sistemleri ve semboller için kod noktaları tanımlayan standardın adı nedir?|Unicode karakterleri, UTF-8 ise bunların bir kodlamasını tanımlar.
Web geliştirme|UI|Kullanıcının uygulamayla etkileştiği düğme, form ve ekranların bütününün İngilizce kısaltması nedir?|User Interface, kullanıcıya sunulan etkileşim katmanıdır.
Veritabanı|UNION|SQL’de iki SELECT sonucunu birleştirip varsayılan olarak tekrarlanan satırları kaldıran işlem nedir?|UNION ALL tekrarları korur.
Veritabanı|UPDATE|SQL’de var olan satırların sütun değerlerini değiştiren komut hangisidir?|UPDATE çoğu zaman hangi satırların değişeceğini belirten WHERE ile kullanılır.
Geliştirici araçları|Unix|Çok kullanıcılı ve çok görevli işletim sistemleri ailesine adını veren sistem nedir?|Unix araçları ve tasarım ilkeleri birçok sisteme ilham vermiştir.
Geliştirici araçları|Undo|Son düzenleme işlemini geri alma komutunun yaygın İngilizce adı nedir?|Editörler geri alma geçmişi üzerinden önceki durumu geri yükler.
Programlama|UUID|Merkezi bir sayaç gerektirmeden tanımlayıcı üretmeye yarayan 128 bitlik kimlik türünün kısaltması nedir?|Universally Unique Identifier’ın farklı üretim sürümleri vardır.
`,
 V: `
Geliştirici araçları|Vim|Vi editörünün geliştirilmiş sürümü olan, kipli düzenlemeyle bilinen metin editörü hangisidir?|Vim düzenleme ve komut kipleri sunar.
JavaScript|V8|Chrome ve Node.js’te JavaScript çalıştıran Google motorunun adı nedir?|V8 JavaScript kodunu işler ve optimize eder.
DevOps|Vagrant|Tekrarlanabilir geliştirme ortamlarını bir yapılandırma dosyasıyla kurmaya yarayan aracın adı nedir?|Vagrant sanal makine sağlayıcılarıyla çalışabilir.
Web geliştirme|Vue|Tek dosyalı bileşenleri ve reaktif arayüzleri destekleyen JavaScript çatısı hangisidir?|Vue bileşen tabanlı arayüzler oluşturur.
Veritabanı|View|SQL’de saklanan bir sorgu tanımı üzerinden sanal tablo sunan nesnenin adı nedir?|Normal view kendi başına sonuç satırlarını saklamak zorunda değildir.
Yazılım mimarisi|Virtual machine|Sanal donanım üzerinde konuk işletim sistemi çalıştırabilen ortamın İngilizce adı nedir?|Bir hipervizör sanal makinelere kaynak ayırabilir.
Programlama|Variable|Bir değere program içinde bir adla erişmeyi sağlayan yapının İngilizce adı nedir?|Değişken tanımları dilin tür ve kapsam kurallarına uyar.
Ağ|VPN|Özel ağ erişimi sağlamak için sanal bir ağ bağlantısı kuran teknolojinin kısaltması nedir?|Virtual Private Network uzak cihazları bir özel ağa bağlayabilir.
Geliştirici araçları|Vite|Geliştirme sunucusu ve üretim derlemesi sunan modern ön yüz araç zincirinin adı nedir?|Vite geliştirme sırasında hızlı modül güncellemeleri sağlar.
Veritabanı|VARCHAR|SQL’de değişken uzunlukta karakter dizisi saklamak için kullanılan yaygın sütun türü nedir?|VARCHAR alanı belirlenen üst sınıra kadar farklı uzunluklar tutar.
`,
 W: `
Web geliştirme|WebAssembly|Tarayıcıda derlenmiş modüllerin çalıştırılmasına izin veren taşınabilir ikili komut biçiminin adı nedir?|Wasm farklı kaynak diller için derleme hedefi olabilir.
Web geliştirme|Webhook|Bir olay gerçekleşince başka bir servisin adresine otomatik HTTP isteği gönderme yöntemine ne denir?|Webhook servisler arasında olay bildirimi taşır.
Programlama|While|Koşul doğru kaldığı sürece bir kod bloğunu tekrar eden döngü anahtar sözcüğü hangisidir?|While gövdeye girmeden önce koşulu değerlendirir.
Veritabanı|WHERE|SQL’de satırları koşula göre süzmek için kullanılan ifade nedir?|WHERE yalnızca koşulu sağlayan satırları seçer.
Web geliştirme|Web Worker|Tarayıcıda JavaScript işini ana arayüz iş parçacığından ayrı yürütmeye yarayan API nedir?|Worker ana sayfayla mesajlaşabilir.
Ağ|WAN|Şehirler veya ülkeler gibi geniş coğrafi alanlara yayılan ağın İngilizce kısaltması nedir?|Wide Area Network uzak yerel ağları birbirine bağlayabilir.
Geliştirici araçları|Webpack|JavaScript modüllerini ve ilişkili kaynakları derleme paketlerinde toplayan aracın adı nedir?|Webpack bağımlılık grafiğinden çıktı dosyaları üretir.
Ağ|Wi-Fi|IEEE 802.11 standartlarıyla ilişkilendirilen yaygın kablosuz ağ teknolojisinin adı nedir?|Wi-Fi cihazların yerel ağa kablosuz bağlanmasını sağlar.
Web geliştirme|WebRTC|Tarayıcılar arasında gerçek zamanlı ses, video ve veri iletişimi sağlayan teknolojinin kısaltması nedir?|WebRTC görüşme ve veri kanalı uygulamalarında kullanılır.
Veritabanı|WAL|Değişiklikler veri dosyasına yazılmadan önce bir günlüğe kaydedildiğinde kullanılan yöntemin kısaltması nedir?|Write-ahead logging çökme sonrası kurtarmaya yardımcı olur.
`,
 Y: `
Programlama|Yapısal tipleme|İki türün uyumluluğuna adları yerine sahip oldukları üyeler üzerinden karar veren sistemin Türkçe adı nedir?|TypeScript nesne türlerinde genellikle yapısal uyumluluk kullanır.
Programlama|Yapıcı|Nesne oluşturulduğunda başlangıç değerlerini kurmak için çağrılan özel metodun Türkçe adı nedir?|Constructor nesnenin başlangıç durumunu oluşturabilir.
Test|Yük testi|Bir uygulamanın beklenen sayıda eşzamanlı kullanıcı altında nasıl çalıştığını ölçen test türü nedir?|Test yanıt süresini ve hata oranını ölçebilir.
DevOps|Yatay ölçekleme|Bir hizmetin kapasitesini tek makineyi güçlendirmek yerine daha fazla örnek ekleyerek artırmaya ne denir?|Her yeni örnek yükün bir kısmını üstlenebilir.
Veritabanı|Yalıtım|Eşzamanlı veritabanı işlemlerinin birbirlerinin ara durumlarını nasıl görebileceğini belirleyen ACID özelliği nedir?|Yalıtım düzeyi hangi eşzamanlılık durumlarının mümkün olduğunu sınırlar.
Programlama|Yield|Bir JavaScript generator fonksiyonunun değer üretip duraklamasını sağlayan anahtar sözcük nedir?|Sonraki next çağrısı fonksiyonu kaldığı yerden sürdürebilir.
Veri biçimleri|YAML|İnsan tarafından okunabilir ve girintiyle yapı kuran yapılandırma biçiminin adı nedir?|YAML Kubernetes manifestleri gibi dosyalarda kullanılabilir.
Geliştirici araçları|Yarn|JavaScript projelerinde bağımlılık yönetimi için kullanılan alternatif paket yöneticisinin adı nedir?|Yarn bağımlılıkları bir kilit dosyasıyla takip edebilir.
Programlama|Yan etki|Bir fonksiyonun dış bir değişkeni değiştirmesi veya dosyaya yazması gibi gözlemlenebilir etkisine ne denir?|Yan etkiler fonksiyonun dönüş değeri dışında oluşur.
Algoritmalar|Yaklaşım algoritması|Optimizasyon problemlerinde kesin çözüm yerine kalite garantisi olan yaklaşık çözüm üreten algoritma türü nedir?|Yaklaşım garantisi çözümün optimumdan ne kadar uzaklaşabileceğini sınırlar.
`,
 Z: `
Web geliştirme|z-index|CSS’te üst üste gelen öğelerin kendi yığın bağlamındaki çizim sırasını etkileyen özellik nedir?|z-index değerleri aynı yığın bağlamında karşılaştırılır.
Kodlama|ZIP|Birden çok dosyayı sıkıştırılmış tek arşivde saklayabilen biçimin adı nedir?|ZIP dosyaları çeşitli sıkıştırma yöntemleri kullanabilir.
Programlama|Zig|Elle bellek yönetimi ve çapraz derlemeye odaklanan, C ile birlikte çalışabilen sistem programlama dilinin adı nedir?|Zig, derleme zamanında kod çalıştırmayı destekler.
Ağ|Zero trust|Ağ içindeki konuma dayanarak otomatik güven vermeyip erişimi açıkça doğrulayan modelin İngilizce adı nedir?|Zero trust kararları kimlik ve bağlam gibi sinyallere dayandırır.
Yazılım mimarisi|Zero downtime deployment|Yeni sürümü kullanıcılar hizmet kesintisi yaşamadan yayına alma hedefinin İngilizce adı nedir?|Trafik sağlıklı örneklere aktarılırken hizmet açık kalır.
Programlama|Zombie process|Sonlanmış fakat çıkış durumu üst süreci tarafından henüz alınmamış Unix sürecinin İngilizce adı nedir?|Süreç tablosunda çıkış durumu alınana kadar bir kayıt kalır.
Ağ|Zero-copy|Verinin tamponlar arasında gereksiz kopyalanmasını azaltan aktarım tekniğinin İngilizce adı nedir?|Bazı işletim sistemi çağrıları veri kopyalama işini azaltabilir.
Programlama|Zamanlayıcı|Bir işlemin belirli bir gecikmeden sonra veya belirli aralıklarla tetiklenmesini sağlayan mekanizmanın Türkçe adı nedir?|Timer, bir çağrıyı planlayabilir.
Test|Zaman aşımı|Bir işlem izin verilen süreyi aştığında beklemenin sonlandırılmasına ne denir?|Timeout, bir testin ya da isteğin süresiz beklemesini engeller.
DevOps|Zamanlanmış görev|Her gün belirli bir saatte yedek alma gibi önceden belirlenmiş bir takvimde çalışan işe ne denir?|Cron bu tür işleri takvime göre başlatabilir.
`,
};
