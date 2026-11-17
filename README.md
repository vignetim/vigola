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

1. Sunucu soru kütüphanesinden seti düzenler ve **Seti kaydet** der. Hazır havuzda 24 harf için Türkçe 1.056, İngilizce 264 soru vardır. Sorular, açıklamalar ve kategoriler seçilen dilde gösterilir; teknik cevaplar özgün adlarıyla kalır. Kendi havuzuna 1.200 soru ve 64 farklı harfe kadar ekleyebilirsin.
2. Oyuncular oda bağlantısından katılır. Sunucu **Oyunu başlat** der.
3. Üç saniyelik hazırlıktan sonra soru açılır. Buzzer’a ilk basan söz hakkını alır. Basışlar sunucuya ulaşma sırasına göre dizilir; ilk oyuncu için 150 ms toplama aralığı vardır. İstemcinin gönderdiği zaman damgasına güvenilmez.
4. Her söz hakkında **10 saniye** başlar. Oyuncu cevabı toplantıda veya aynı odada sesli söyler. Uygulama sesli görüşme sağlamaz.
5. Sunucu doğru/yanlış kararını verir. Süre aşımı sunucu tarafından otomatik yanlış sayılır. Yanlış bilen aynı soruda tekrar basamaz; kuyruktaki sıradaki oyuncu tam 10 saniye alır. Kuyruk boşsa kalan oyuncular basabilir.
6. Doğru cevap soruyu kapatır. **Pas geç**, cevabı gösterir ve soruyu puansız kapatır; harf tekrar sorulmaz. Son sorudan sonra sonuçlar gösterilir.

**Puanlama:** `Math.round(doğruPuanı × katsayı)` eklenir. Yanlışta ve süre aşımında `-Math.round(yanlışCezası × katsayı)` uygulanır. Örnek: 100 / 50, katsayı 2 → doğru +200, yanlış −100. Temel değerler 1–1000 / 0–1000, katsayı 0,5–5 aralığındadır. Kesirli puanların büyüklüğü en yakın tam sayıya yuvarlanır; yarımlar yukarı yuvarlanır.

**Kısayollar:** Oyuncu ve sunucu: boşluk → buzzer. Sunucu: D → doğru, Y → yanlış, sağ ok → başlat/sonraki. Formlarda, düğmeler odaktayken ve pencereler açıkken kısayollar çalışmaz. Ses kontrolü üst çubukta bulunur.

## 30 Soru Yarışı

Yeni oda oluştururken **30 Soru Yarışı** seç. Bu mod harf çarkından bağımsızdır: her yarışmada rastgele sırayla **30 farklı soru** ve her soruda konuyla ilişkili **dört yakın seçenek** gelir. Harf veya cevap başlangıcı ipucu verilmez. Hazır soru bankası **660 Türkçe**, **120 İngilizce** senaryo, kod okuma ve mantık sorusu içerir. Türkçe bankadaki ilk 60 sorunun İngilizce karşılıkları ve geçmiş kimlikleri korunur; 540 yeni soru yalnız Türkçe havuza eklenir. AI ve Cloud için 30’ar iki dilli soru daha bulunur.

30 Soru Yarışı kurulurken isteğe bağlı sekiz kategori seçilebilir: AI · Yapay zekâ, Cloud, Algoritma ve Mantık, Programlama, Veritabanı, Ağ ve Güvenlik, Sistem Tasarımı, Test ve Kalite. Varsayılan Karışık tüm havuzdan 30 farklı soru seçer. Kategori maçında yalnız ilgili alandan sorular gelir; soru setleri dil ve kategori bazında ayrı saklanır. Türkçe katalog 660, İngilizce katalog 120 sorudur; AI ve Cloud için her iki dilde 30’ar yeni soru eklenmiştir. En az 30 sorusu bulunmayan dil/kategori birleşimleri seçim ekranında pasif gösterilir.

- Her soruda 3 saniye hazırlık, ardından 15 saniye cevap süresi vardır. Herkes tamamlayınca veya Bomba patlayınca soru erken kapanır.
- Hız puanı, ilk doğru ×1,5, tek cevap ×2 ve beş jokerin birlikte kullanımı harfli çoktan seçmeli modla aynıdır. ×2 ceza etkisi, Bomba yarışı ve Kalkan koruması da geçerlidir.
- Harf çarkının yerini soru numarası, süre çubuğu ve 30 adımlık ilerleme ekranı alır. Sonuçları görüp sonraki soruya geçilir; 30. sorunun ardından final tablosu açılır.
- Daha önce tamamlanmamış sorulara öncelik verilir. Kalan yeni soru sayısı 30'a yetmiyorsa önceki sorular yeniden karıştırılarak havuz tamamlanır; aynı yarışmada bir soru iki kez gelmez. Soru geçmişine yalnız tamamlanan 30 soruluk yarışma yazılır.
- Yarışma soru seti dil başına ayrı kaydedilir; harfli modların özel havuzuyla karışmaz. Özel sette en az 30 farklı soru, her soruda tam dört seçenek ve tek bir doğru cevap gerekir. Yanlış seçenekleri sunucu rastgele terimlerle doldurmaz; sunucuya verilen seçenekler kullanılır ve sıraları karıştırılır.

## Çoktan seçmeli oyun

1. Oda oluştururken **Çoktan seçmeli** seç. Hazır havuzdaki her soruya aynı harfle başlayan dört farklı seçenek hazırlanır ve sıraları karıştırılır. Sunucu bu modda yönetici olarak izler; katılımcılar davet bağlantısıyla katılır.
2. **Oyunu başlat** sonrası üç saniyelik hazırlık tamamlanınca seçenekler sorunun altında açılır. Her katılımcı normalde bir seçenek seçer; **Çift cevap** jokeri iki farklı seçim hakkı verir. Kaydedilen seçimler değiştirilemez ve yeniden bağlanınca geri gelir. Ekran kimin cevapladığını gösterir, hangi seçeneği seçtiğini göstermez.
3. Sunucu **Next · Cevapları göster** dediğinde doğru cevap, herkesin seçimi, doğru/yanlış durumu ve bu sorudan aldığı puan açılır. O ana kadar puan değişmez. Bomba patlamadığı sürece cevap vermeyen oyuncuya ceza uygulanmaz. Soru açıldığında **15 saniyelik** sayaç başlar. Tüm oyuncular cevaplarını tamamladığında süre beklenmeden sonuçlar açılır. Çift cevap kullanan oyuncunun ikinci seçimi de beklenir; tek seçimle kalırsa soru süre dolduğunda kapanır. Süre dolunca sonuçlar otomatik açılır; sunucu Next ile daha erken açabilir. Bomba kullananlar arasından biri doğru cevap gönderdiğinde de soru anında kapanır. Süre dolduktan sonra seçim kabul edilmez.
4. Sonuçlar ekranda kalır. **Sonraki soru** yeni soruya, son sorunun ardından **Sonuçlar** final tablosuna geçer. Sunucunun sağ ok kısayolu da önce cevapları açar, sonraki basışta ilerler.

**Soruları düzenle → Seçenekler ve ağırlıklar** bölümünde seçenek metinlerini, doğru seçeneği ve her seçeneğin puan ağırlığını düzenleyebilirsin. Boş ağırlık doğru seçenekte sorunun **Doğru puanı**, yanlış seçenekte **−Yanlış cezası** değerini kullanır. Özel ağırlık doğru seçenek için 0–1000, yanlış seçenek için −1000–0 olabilir. Doğru cevap puanı `Math.round(ağırlık × katsayı × (1 − cevapSüresiMs / 30000))` olarak hesaplanır: soru açıldığında tam puan, 7,5. saniyede %75, 15 saniye dolmadan hemen önce yaklaşık %50. Örneğin 100 puanlık soruda 3 saniyede +90, 7,5 saniyede +75 kazanılır. Cevap süresi sunucunun seçimi aldığı andan hesaplanır; aynı cevap süresi aynı temel hız puanını verir; ilk doğru bonusu ise sunucunun ilk kabul ettiği doğru cevaba aittir. Yanlış cezası hızdan bağımsız `−Math.round(abs(ağırlık) × katsayı)` olur; −35 ve 2,5 katsayı → −88. Başka bir oyuncu bu soruda ×2 puan jokeri açmışsa yanlış cezanın bu yuvarlanmış değeri ikiyle çarpılır. Birden fazla rakip açsa da çarpan en fazla ×2 olur; Kalkan puan kesilmesini önler. Tam sayıya yuvarlama nedeniyle birbirine çok yakın süreler eşit puan verebilir. Sıfır ağırlıklı cevap doğru/yanlış sayacına yansır, puanı değiştirmez. Seçenek ağırlıkları da cevaplar açılana kadar katılımcılardan gizlenir.

**İlk doğru bonusu:** Sunucunun ilk kabul ettiği doğru cevabın sahibi **×1,5** bonus alır. Aynı milisaniyeye gelen cevaplarda sunucudaki işlem sırası belirleyicidir; oyuncu listesindeki sıra etkili değildir. Çift cevapta önce yanlış seçmek bonusu kazandırmaz; doğru seçenek gönderildiği anda yarışa girer. Her soruda yeniden belirlenir ve sonuçlar açılana kadar gizlidir.

**Tek cevap bonusu:** Soru kapanırken yalnız bir oyuncu cevap göndermiş ve doğru bilmişse **×2** bonus alır. Başka bir oyuncu yanlış da olsa cevap verdiyse bu bonus uygulanmaz. Çift cevap jokeriyle iki seçenek işaretleyen tek bir oyuncu, bir cevap veren oyuncu sayılır.

**Bonusların birleşmesi:** Önce hız puanı tam sayıya yuvarlanır: `B = Math.round(ağırlık × katsayı × hızOranı)`. Son puan `Math.round(B × (ilkDoğru ? 1.5 : 1) × (tekCevap ? 2 : 1) × (çiftPuanJokeri ? 2 : 1))` olur. Bonuslar arasında ara yuvarlama yapılmaz. Örneğin 100 temel puanlık soruda 3 saniyede B=90: ilk doğru +135, ayrıca tek cevap +270, ayrıca ×2 puan jokeri +540 verir. Bomba cezası alan veya Kalkan ile başka bir bombadan korunan oyuncuya bu ödüller uygulanmaz.

### Kişisel jokerler

Çoktan seçmeli modda her oyuncu aşağıdaki beş jokerin her birini oyun boyunca **bir kez** kullanabilir. Soru açıldıktan sonra, ilk cevabını vermeden önce istediği kadar farklı jokeri birlikte etkinleştirebilir. İlk seçimi gönderdikten sonra, Çift cevap ile ikinci seçim hakkı olsa bile, yeni joker açamaz. Joker etkinleştirildiğinde hakkı kullanılmış sayılır. Seçim yapmadan süre dolsa da hak geri verilmez. Bomba diğer oyuncuları da etkiler; diğer jokerler kişiseldir. Kalan haklar ve aktif jokerlerin tamamı yeniden bağlanınca korunur.

- **Yarı yarıya:** Doğru seçenek ile rastgele bir yanlış seçenek bırakır; diğer yanlışlar yalnız o oyuncuda elenmiş görünür. İki seçenekli sorularda kullanılamaz ve hak düşmez.
- **Çift cevap:** Süre bitmeden iki farklı seçenek işaretleyebilir. En az biri doğruysa doğru seçeneğin sunucuya ulaştığı andaki hız puanını kazanır. İkisi de yanlışsa yalnız ilk seçiminin cezasını bir kez alır. Tek seçimle de soruyu tamamlayabilir. Doğruluk, sonuçlar açılana kadar bildirilmez.
- **Kalkan:** Yanlış cevabın puan cezasını sıfırlar ve bombadan korur. Başkasının bombası kazandığında, cevap doğru olsa bile bu sorunun puanı 0 olur. Kendi bombası kazanırsa doğru cevabının normal ödülünü alır. Bomba yoksa doğru cevapta hız puanı, uygunsa ilk doğru/tek cevap bonusları ve aktif ×2 puan jokeri geçerlidir. Verilen cevap yanlışsa yanlış sayacı yine artar.
- **×2 puan:** Doğru puanına ×2 uygular; aynı soruda diğer oyuncuların yanlış cevap cezalarını da ikiye katlar. Jokeri etkinleştirmek yeterlidir; sahibi cevap vermese veya yanlış cevap verse de bu etki geçerlidir. Kendi jokerin kendi yanlış cezanı artırmaz, ama rakip de ×2 açmışsa seni etkiler. Birden fazla ×2 kullanıcısı cezada ×4 veya daha fazla çarpan oluşturmaz; en fazla ×2 uygulanır. Kalkan cezayı sıfırlar. İlk doğru ve tek cevap bonuslarıyla kendi doğru ödülün toplam ×6 olabilir; örneğin 90 hız puanı +540 olur. ×2 ile Bomba birlikte kullanılıp bomba kazanırsa, bombanın tüm korunmasız hedefleri iki kat soru cezası alır. Başkasının bombası kazanırsa kendi ×2 jokerin bombanın cezasını artırmaz; kazanan bombacının ×2 jokeri esas alınır.
- **Bomba:** İlk cevabından önce etkinleştir. Bomba kullanan oyuncular arasından sunucuya ilk doğru cevabı ulaştıran kazanır ve soru anında kapanır; sonraki cevaplar ve joker kullanımları kabul edilmez. Aynı milisaniyeye denk gelen cevaplarda sunucunun ilk kabul ettiği işlem kazanır. Bomba kullanıp yanlış cevap veren ilk oyuncu soruyu kapatmaz; başka bir bomba kullanıcısı doğru cevapla kazanabilir. Kazanan normal hız puanını, uygunsa ilk doğru/tek cevap bonuslarını ve aktif ×2 puan jokerinin çarpanını alır. Bomba, Çift cevap ile birlikte kullanılırsa doğru olan ikinci seçim de bombayı patlatabilir. Başka bir oyuncu daha önce normal doğru cevap vermişse Bomba kazananı ilk doğru bonusunu alamaz. Bomba ve Kalkan birlikte kullanılırsa başkasının bombası kazandığında Kalkan korur.

**Bomba cezası:** Kazanan dışındaki tüm oyuncuların bu sorudaki normal puanı yerine `−Math.round(soru.yanlışCezası × katsayı)` uygulanır. Kazanan bombacının ×2 puan jokeri aktifse bu yuvarlanmış ceza ikiyle çarpılır; başka oyuncuların ×2 jokerleri bomba hasarını artırmaz. Bu ceza seçeneğin özel ağırlığına bağlı değildir; önce doğru cevap gönderen ve hiç cevap vermeyen oyunculara da uygulanır. Kazanan dışındaki önceden Kalkan etkinleştirmiş oyuncunun puanı 0 olur; doğru cevaptan ayrıca ödül almaz. Bomba patladıktan sonra Kalkan açılamaz. Örneğin soru cezası 25 ve katsayı 2 ise etkilenen her oyuncu −50, Kalkan açmış oyuncu 0 alır. Kazanan bombacı ×2 de açmışsa aynı örnekte ceza −100 olur. Kazanamayan oyuncuların daha önce etkinleştirdikleri Bomba hakları da harcanmış kalır; geç cevap reddedilse de iade edilmez.

Bomba sonucu puandan ayrı gösterilir: **Bomba kazandı**, **Bombadan etkilendi**, **Kalkan korudu**. Doğru/yanlış sayaçları gerçek gönderilen cevaba göre artar; cevap vermeyen oyuncunun sayacı bomba cezası alsa da değişmez.

Sonuçlarda oyuncunun seçtiği tüm seçenekler, kullanılan tüm jokerler ve varsa **İlk doğru · ×1,5** / **Tek cevap · ×2** bonusları ve varsa **Ceza ×2** etkisi gösterilir. Jokerler, elenen seçenekler ve kişisel seçimler soru açıkken yalnız ilgili oyuncunun oturumuna gönderilir. Bomba kazananı ve etkileri sonuçlar açılınca herkese gösterilir.

Özel bir soruda seçenekler tanımlanmamışsa sunucu seçenekleri otomatik hazırlar. El ile tanımlanan sorularda 2–6 farklı seçenek ve bunlardan tam biriyle eşleşen bir doğru cevap gerekir. Hazır havuz dışındaki özel harflerde aynı harften yeterli alternatif yoksa diğer harflerden de seçenek seçilebilir.

## Soru havuzu

**Oyunu başlat** düğmesi, her harf için kullanılmamış sorulardan rastgele birini seçer. Harfler çark sırasıyla oynanır. Son soru doğru cevaplandığında veya pas geçildiğinde çarkın tüm soruları geçmişe yazılır. Yarım kalan oyunlar soru tüketmez.

Geçmiş, bu sunucudaki odalar için ortaktır ve `.vigola-data/used-questions.json` dosyasında saklanır. Sunucuyu yeniden başlatmak geçmişi sıfırlamaz. Dağıtımda geçmişi korumak için bu klasörü kalıcı diskte tut. Herhangi bir harfin soruları tükenirse o harfe yeni soru eklemek gerekir. Oyuna başlamadan soru kütüphanesindeki **Hazır havuzu kullan** düğmesiyle kayıtlı özel setinden hazır havuza dönebilirsin.

Hazır havuz, pratik senaryolar ve kavram sorularından oluşur. Türkçe havuzda her harf için 44, İngilizce havuzda 11 soru vardır. Türkçeye 792 yeni soru eklenmiştir; teknik cevaplar iki dilde de aynı olduğundan `İ` yerine `I` kullanılır. Arayüz ve zorluk etiketleri Türkçedir. Güncellemeyi almak için sunucuyu yeniden başlat; tarayıcıda eski bir set kaydettiysen lobide **Soruları düzenle → Hazır havuzu kullan** seçeneğini kullan. Devam eden odaların seti otomatik değişmez.

## Soru dili ve Türkçe içerik kuralı

Dil oda kurulurken seçilir ve odanın tüm katılımcıları aynı soru dilini görür. Her iki oyun modu da Türkçe ve İngilizce havuzları destekler. Seçim yalnızca soru içeriğini değiştirir; arayüzün dili Türkçedir.

Türkçe içerik otomatik kelime değişimiyle üretilmez; her soru ve açıklama ayrıca yazılır. Yazım yaklaşımı:

- `call stack`, `event loop`, `closure`, `Promise`, `thread`, `cache` gibi yerleşik geliştirici terimleri, API adları, kod ve kısaltmalar korunur. Cevaplar ve çoktan seçmeli seçeneklerdeki teknik adlar çevrilmez.
- Cümle, Türkçenin söz dizimiyle yeniden kurulur. İngilizcedeki isim dizilerini birebir taşımak yerine somut davranış anlatılır; yabancı terimlere art arda ek getirmekten kaçınılır.
- Soru, kavramı ele veren bir çeviri yerine ayırt edici bir senaryo sunar. Açıklama da mekanizmayı Türkçe anlatır; teknik terim gerektiği yerde özgün adıyla kullanılır.
- Örnek: “Bir fonksiyon, dış fonksiyonun çalışması bittikten sonra da onun değişkenlerini kullanabiliyor. Bunu sağlayan mekanizma nedir?” → `Closure`. `call stack` gibi kavramlar için de yaygın İngilizce terim korunur.

İki dilde ortak olan 264 sorunun Türkçe ve İngilizce sürümleri aynı soru kimliğini kullanır. Türkçeye özel 792 soru kendi metin tabanlı kimlikleriyle geçmişe kaydedilir. Tamamlanan bir soru dil değiştirerek yeniden tüketilemez; eski İngilizce soru geçmişi geçerliliğini korur. Soru düzenleyicisinde **Hazır havuzu kullan**, odanın dilindeki havuza döner.

Özel setler tarayıcıda dile göre ayrı saklanır. Önceden kaydedilmiş, dil bilgisi olmayan setler İngilizce kabul edilir; Türkçe oda oluştururken yanlışlıkla kullanılmaz. Kullanıcının yazdığı özel sorular otomatik çevrilmez; seçilen dil için girilen metin korunur. Ortak soruların Türkçe çevirileri `lib/question-locales-tr.mjs`, Türkçeye özel ek sorular `lib/question-locales-tr-extra-al.mjs` ve `lib/question-locales-tr-extra-mz.mjs` içinde düzenlenir; yeni sorunun Türkçe metni veya açıklaması eksikse sessizce İngilizceye dönmek yerine doğrulama hatası oluşur.

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
