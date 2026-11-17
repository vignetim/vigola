# Vigola

Ekibinle canlı yazılım passaparolası. Next.js App Router, React, TypeScript ve Socket.IO ile ayrı bir ürün olarak oluşturuldu. Kaynak `../meme-buzzer-quiz-app` değiştirilmedi.

## Yerelde çalıştırma

Node.js 22.x gerekir (dağıtım ortamıyla aynı ana sürüm).

```bash
cd vigola
npm install
npm run dev
```

`http://localhost:3000` sunucu panelidir. İlk açılışta oyun modunu (**Buzzer · Sözlü cevap** / **Çoktan seçmeli**) ve soru dilini (**Türkçe** / **English**) seçerek oda oluştur. **Davet et** ile bağlantıyı paylaş. Oyuncular `/?room=ABCDEF` üzerinden isimleriyle katılır. İzleyici ekranı `/?room=ABCDEF&watch=1` adresidir. Telefonlar için `localhost` yerine bilgisayarın yerel ağ IP adresini açıp oradan davet bağlantısı kopyala; herkes aynı ağda olmalıdır.

```bash
npm test
npm run typecheck
npm run build
npm start
```

`npm start` derlenmiş uygulamayı özel Node HTTP sunucusu üzerinden çalıştırır. `next dev` veya `next start` doğrudan kullanılmamalı; Socket.IO da `server.mjs` üzerinden başlar. İsteğe bağlı `PORT` süreç değişkeni varsayılan 3000 portunu değiştirir. Sağlık kontrolü: `GET /api/health`.

## Oyun

Aşağıdaki söz hakkı akışı **Buzzer · Sözlü cevap** modunda geçerlidir. Mod oda kurulurken seçilir; mevcut oda için değiştirilmez.

1. Sunucu soru kütüphanesinden seti düzenler ve **Seti kaydet** der. Hazır havuzda 24 harf için 264 sorunun Türkçe ve İngilizce sürümleri vardır. Sorular, açıklamalar ve kategoriler seçilen dilde gösterilir; teknik cevaplar özgün adlarıyla kalır. Kendi havuzuna 300 soru ve 64 farklı harfe kadar ekleyebilirsin.
2. Oyuncular oda bağlantısından katılır. Sunucu **Oyunu başlat** der.
3. Üç saniyelik hazırlıktan sonra soru açılır. Buzzer’a ilk basan söz hakkını alır. Basışlar sunucuya ulaşma sırasına göre dizilir; ilk oyuncu için 150 ms toplama aralığı vardır. İstemcinin gönderdiği zaman damgasına güvenilmez.
4. Her söz hakkında **10 saniye** başlar. Oyuncu cevabı toplantıda veya aynı odada sesli söyler. Uygulama sesli görüşme sağlamaz.
5. Sunucu doğru/yanlış kararını verir. Süre aşımı sunucu tarafından otomatik yanlış sayılır. Yanlış bilen aynı soruda tekrar basamaz; kuyruktaki sıradaki oyuncu tam 10 saniye alır. Kuyruk boşsa kalan oyuncular basabilir.
6. Doğru cevap soruyu kapatır. **Pas geç**, cevabı gösterir ve soruyu puansız kapatır; harf tekrar sorulmaz. Son sorudan sonra sonuçlar gösterilir.

**Puanlama:** `Math.round(doğruPuanı × katsayı)` eklenir. Yanlışta ve süre aşımında `-Math.round(yanlışCezası × katsayı)` uygulanır. Örnek: 100 / 50, katsayı 2 → doğru +200, yanlış −100. Temel değerler 1–1000 / 0–1000, katsayı 0,5–5 aralığındadır. Kesirli puanların büyüklüğü en yakın tam sayıya yuvarlanır; yarımlar yukarı yuvarlanır.

**Kısayollar:** Oyuncu ve sunucu: boşluk → buzzer. Sunucu: D → doğru, Y → yanlış, sağ ok → başlat/sonraki. Formlarda, düğmeler odaktayken ve pencereler açıkken kısayollar çalışmaz. Ses kontrolü üst çubukta bulunur.

## Çoktan seçmeli oyun

1. Oda oluştururken **Çoktan seçmeli** seç. Hazır havuzdaki 264 sorunun her birine aynı harfle başlayan dört farklı seçenek hazırlanır ve sıraları karıştırılır. Sunucu bu modda yönetici olarak izler; katılımcılar davet bağlantısıyla katılır.
2. **Oyunu başlat** sonrası üç saniyelik hazırlık tamamlanınca seçenekler sorunun altında açılır. Her katılımcı bir kez seçim yapar; kayıtlı seçim değiştirilemez ve yeniden bağlanınca geri gelir. Ekran kimin cevapladığını gösterir, hangi seçeneği seçtiğini göstermez.
3. Sunucu **Next · Cevapları göster** dediğinde doğru cevap, herkesin seçimi, doğru/yanlış durumu ve bu sorudan aldığı puan açılır. O ana kadar puan değişmez. Cevap vermeyen oyuncuya ceza uygulanmaz. Soru açıldığında **10 saniyelik** sayaç başlar. Süre dolunca sonuçlar otomatik açılır; sunucu Next ile daha erken açabilir. Süre dolduktan sonra seçim kabul edilmez.
4. Sonuçlar ekranda kalır. **Sonraki soru** yeni soruya, son sorunun ardından **Sonuçlar** final tablosuna geçer. Sunucunun sağ ok kısayolu da önce cevapları açar, sonraki basışta ilerler.

**Soruları düzenle → Seçenekler ve ağırlıklar** bölümünde seçenek metinlerini, doğru seçeneği ve her seçeneğin puan ağırlığını düzenleyebilirsin. Boş ağırlık doğru seçenekte sorunun **Doğru puanı**, yanlış seçenekte **−Yanlış cezası** değerini kullanır. Özel ağırlık doğru seçenek için 0–1000, yanlış seçenek için −1000–0 olabilir. Doğru cevap puanı `Math.round(ağırlık × katsayı × (1 − cevapSüresiMs / 20000))` olarak hesaplanır: soru açıldığında tam puan, 5. saniyede %75, 10 saniye dolmadan hemen önce yaklaşık %50. Örneğin 100 puanlık soruda 2 saniyede +90, 5 saniyede +75 kazanılır. Cevap süresi sunucunun seçimi aldığı andan hesaplanır; aynı anda ulaşan cevaplar eşit puan alır. Yanlış cezası hızdan bağımsız `−Math.round(abs(ağırlık) × katsayı)` olur; −35 ve 2,5 katsayı → −88. Tam sayıya yuvarlama nedeniyle birbirine çok yakın süreler eşit puan verebilir. Sıfır ağırlıklı cevap doğru/yanlış sayacına yansır, puanı değiştirmez. Seçenek ağırlıkları da cevaplar açılana kadar katılımcılardan gizlenir.

Özel bir soruda seçenekler tanımlanmamışsa sunucu seçenekleri otomatik hazırlar. El ile tanımlanan sorularda 2–6 farklı seçenek ve bunlardan tam biriyle eşleşen bir doğru cevap gerekir. Hazır havuz dışındaki özel harflerde aynı harften yeterli alternatif yoksa diğer harflerden de seçenek seçilebilir.

## Soru havuzu

**Oyunu başlat** düğmesi, her harf için kullanılmamış sorulardan rastgele birini seçer. Harfler çark sırasıyla oynanır. Son soru doğru cevaplandığında veya pas geçildiğinde çarkın tüm soruları geçmişe yazılır. Yarım kalan oyunlar soru tüketmez.

Geçmiş, bu sunucudaki odalar için ortaktır ve `.vigola-data/used-questions.json` dosyasında saklanır. Sunucuyu yeniden başlatmak geçmişi sıfırlamaz. Dağıtımda geçmişi korumak için bu klasörü kalıcı diskte tut. Herhangi bir harfin soruları tükenirse o harfe yeni soru eklemek gerekir. Oyuna başlamadan soru kütüphanesindeki **Hazır havuzu kullan** düğmesiyle kayıtlı özel setinden hazır havuza dönebilirsin.

Hazır havuz, pratik senaryolar ve kavram sorularından oluşur. Her harf için 11 farklı cevap vardır; teknik cevaplar iki dilde de aynı olduğundan `İ` yerine `I` kullanılır. Arayüz ve zorluk etiketleri Türkçedir. Güncellemeyi almak için sunucuyu yeniden başlat; tarayıcıda eski bir set kaydettiysen lobide **Soruları düzenle → Hazır havuzu kullan** seçeneğini kullan. Devam eden odaların seti otomatik değişmez.

## Soru dili ve Türkçe içerik kuralı

Dil oda kurulurken seçilir ve odanın tüm katılımcıları aynı soru dilini görür. Her iki oyun modu da Türkçe ve İngilizce havuzları destekler. Seçim yalnızca soru içeriğini değiştirir; arayüzün dili Türkçedir.

Türkçe içerik otomatik kelime değişimiyle üretilmez; her soru ve açıklama ayrıca yazılır. Yazım yaklaşımı:

- `call stack`, `event loop`, `closure`, `Promise`, `thread`, `cache` gibi yerleşik geliştirici terimleri, API adları, kod ve kısaltmalar korunur. Cevaplar ve çoktan seçmeli seçeneklerdeki teknik adlar çevrilmez.
- Cümle, Türkçenin söz dizimiyle yeniden kurulur. İngilizcedeki isim dizilerini birebir taşımak yerine somut davranış anlatılır; yabancı terimlere art arda ek getirmekten kaçınılır.
- Soru, kavramı ele veren bir çeviri yerine ayırt edici bir senaryo sunar. Açıklama da mekanizmayı Türkçe anlatır; teknik terim gerektiği yerde özgün adıyla kullanılır.
- Örnek: “Bir fonksiyon, dış fonksiyonun çalışması bittikten sonra da onun değişkenlerini kullanabiliyor. Bunu sağlayan mekanizma nedir?” → `Closure`. `call stack` gibi kavramlar için de yaygın İngilizce terim korunur.

Türkçe ve İngilizce sürümler aynı soru kimliğini kullanır. Tamamlanan bir soru dil değiştirerek yeniden tüketilemez; eski İngilizce soru geçmişi geçerliliğini korur. Soru düzenleyicisinde **Hazır havuzu kullan**, odanın dilindeki havuza döner.

Özel setler tarayıcıda dile göre ayrı saklanır. Önceden kaydedilmiş, dil bilgisi olmayan setler İngilizce kabul edilir; Türkçe oda oluştururken yanlışlıkla kullanılmaz. Kullanıcının yazdığı özel sorular otomatik çevrilmez; seçilen dil için girilen metin korunur. Hazır Türkçe havuz `lib/question-locales-tr.mjs` içinde düzenlenir; yeni sorunun Türkçe metni veya açıklaması eksikse sessizce İngilizceye dönmek yerine doğrulama hatası oluşur.

## Oyun masası ve tema

Masaüstünde oyun ekranı tüm genişliği kullanır: solda kaydırılabilir soru/cevap geçmişi, ortada harf çarkı ve basış kuyruğu, sağda canlı puan tablosu, gerçek bağlı izleyiciler ve büyük yuvarlak **BAS** butonu vardır. Sunucunun cevap anahtarı ve doğru/yanlış/pas/sonraki kontrolleri sol panelde aynı ekrandadır. Soru düzenleyici ayrı bir pencerede açılır. Telefonlarda paneller alt alta dizilir; **BAS** butonu sağ altta sabit kalır.

Buton her rolde görünür. Sunucu soruyu başlattıktan sonra butona basarak **Sunucu** adıyla katılır ve yönetim yetkisini korur; puanı ve oyuncu kimliği yeniden bağlanınca geri yüklenir. İzleyici butona basınca isim girerek oyuncuya dönüşür. İzleyiciler puan almaz, oyuncu sayısına eklenmez ve bağlantıları bitince izleyici listesinden çıkarılır.

Aktif sorunun cevabı sunucuya açıktır; oyuncular ve izleyiciler cevabı yalnızca soru kapandıktan sonra görür. Soru geçmişine yalnızca tamamlanmış sorular eklenir.

Üst çubuktaki ay/güneş düğmesi açık ve koyu temayı değiştirir. Tercih tarayıcıda saklanır. İlk kullanımda sistem teması izlenir. Tema; çarkı, soru akışını, listeleri, soru düzenleyiciyi, formları ve bildirimleri kapsar.

Sunucu olayları da değiştiğinden bu güncellemeden sonra geliştirme sunucusunu yeniden başlat: `npm run dev`.

## Mimari

- `app/`: Next.js App Router kabuğu, metadata, duyarlı tasarım.
- `components/game.tsx`: sunucu, oyuncu, izleyici ve soru düzenleyici ekranları.
- `components/game-wheel.tsx`: harf çarkı ve cevap sayacı.
- `components/theme-toggle.tsx`: sistem tercihi ve kayıtlı açık/koyu tema seçimi.
- `lib/questions.mjs`: 24 harfli hazır soru havuzu. Yalnız sunucu tarafından içe aktarılır; cevaplar oyuncunun istemci paketine dahil edilmez.
- `lib/question-locales.mjs` ve `lib/question-locales-tr.mjs`: soru dili, ayrıca yazılmış Türkçe içerik ve iki dil arasında ortak soru kimliği. Yalnız sunucu tarafından yüklenir.
- `lib/room-preferences.mjs`: istemcide dile göre özel set ve hazır havuz tercihi; soru içeriğini içe aktarmaz.
- `lib/types.ts`: ortak görünüm tipleri.
- `server/engine.mjs`: arayüzden bağımsız, test edilebilir oyun durum makinesi.
- `server.mjs`: Next.js + Socket.IO sunucusu, oturum yetkilendirme, oran sınırları, oda yayınları ve zamanlayıcı.
- `tests/engine.test.mjs`: yarış sırası, süre aşımı, katsayı, yeniden bağlanma, cevap gizliliği, pas ve hatalı veri testleri.

Oyun akışı: `lobby → countdown → open → answering → resolved → … → final`. Yanlış cevapta `answering → answering` veya `open` olur. İstemci saati sunucuyla eşlenir; süre ve puan hesaplamasında otorite sunucudur. Oyuncu tokenları ve sunucu tokenı ayrı, tahmin edilemez kimliklerdir. Oda kodu yalnızca katılım içindir. Genel yayınlarda tokenlar ve açılmamış cevaplar bulunmaz. Soru metni hazırlık sayımı sırasında genel yayında gizlenir. Sunucu yanıtları yalnız yetkili sunucu oturumuna gider.

Oyuncu aynı tarayıcıdan yeniden bağlandığında tokenıyla aynı puana döner. Sunucu paneli yenilense de oda oturumu geri alınır. Kayıtlı soru seti ve oturum kimlikleri tarayıcıda tutulur. Tarayıcı verilerini silmek oturum kimliklerini kaldırır. Google Fonts yüklenemediğinde sistem fontları kullanılır; oyun font servisinden bağımsız çalışır.

## Dağıtım sınırları

Bu sürüm tek Node süreci için bir başlangıç altyapısıdır. Odalar, oyun ilerlemesi ve puanlar sunucu belleğindedir; **sunucu yeniden başlarsa kaybolur**. Tarayıcıda kaydedilmiş soru setiyle yeni oyun açılabilir. Oyunlar 12 saat etkinlik olmazsa temizlenir. Bellek sınırlaması için en fazla 200 oda, odada 100 oyuncu vardır.

Canlı kullanıma uygun hedef: WebSocket destekleyen sürekli bir Node sunucusu (ör. Docker/VM/PaaS), TLS ve reverse proxy. Sunucusuz kısa ömürlü işlevlere veya statik barındırmaya doğrudan uygun değildir. Çoklu süreç ve kalıcı oturumlar için Redis/kalıcı veritabanı, Socket.IO adapter ve dağıtık zamanlayıcı koordinasyonu eklenmelidir. Hesap sistemi, herkese açık soru pazarı ve sesli görüşme bu kapsamda yoktur. Bu sürümde sunucu IP’si üzerinden yeni oda oluşturma ve bağlantı başına olay oranı sınırlandırılır; internete açıldığında proxy/IP politikasını dağıtımına göre ayarla.

Kaynak uygulamanın ayrıntılı incelemesi ve uyarlama kararları: [ANALYSIS.md](ANALYSIS.md).

## Bu geliştirme oturumunda doğrulama

- `npm test`: 20/20 test geçti; sunucu buzzer katılımı, tekrar bağlanma, izleyici listesi ve soru geçmişinin cevap gizliliği dahil.
- `npm run typecheck`: geçti; üretim derlemesinin TypeScript kontrolü de geçti.
- `npm run build`: Node.js 22.22.2 ve Next.js 16.4.6 / Webpack ile temiz ortamda üretim derlemesi geçti.
- Kaynak meme-buzzer deposunda değişiklik yok.
- `package-lock.json` temiz bir klasörde npm registry paketlerinden yeniden üretildi; başka projelere işaret eden yerel bağlantılar kaldırıldı. Ayrı geçici klasörde `npm ci` ile temiz kurulum doğrulandı; build ve testler bu kurulumda çalıştırıldı.
- Yerel HTTP sunucusu açma girişimi ortam tarafından `listen EPERM` ile engellendi. Bu yüzden tarayıcıda görsel kontrol ve çoklu cihaz Socket.IO uçtan uca doğrulaması yapılmadı. Başarılı üretim derlemesi, bu kontrollerin yerine geçmez.
