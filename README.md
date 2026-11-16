# Vigola

Ekibinle canlı yazılım passaparolası. Next.js App Router, React, TypeScript ve Socket.IO ile ayrı bir ürün olarak oluşturuldu. Kaynak `../meme-buzzer-quiz-app` değiştirilmedi.

## Yerelde çalıştırma

Node.js 22.x gerekir (dağıtım ortamıyla aynı ana sürüm).

```bash
cd vigola
npm install
npm run dev
```

`http://localhost:3000` sunucu panelidir. İlk açılışta otomatik oda oluşturulur. **Davet et** ile bağlantıyı paylaş. Oyuncular `/?room=ABCDEF` üzerinden isimleriyle katılır. İzleyici ekranı `/?room=ABCDEF&watch=1` adresidir. Telefonlar için `localhost` yerine bilgisayarın yerel ağ IP adresini açıp oradan davet bağlantısı kopyala; herkes aynı ağda olmalıdır.

```bash
npm test
npm run typecheck
npm run build
npm start
```

`npm start` derlenmiş uygulamayı özel Node HTTP sunucusu üzerinden çalıştırır. `next dev` veya `next start` doğrudan kullanılmamalı; Socket.IO da `server.mjs` üzerinden başlar. İsteğe bağlı `PORT` süreç değişkeni varsayılan 3000 portunu değiştirir. Sağlık kontrolü: `GET /api/health`.

## Oyun

1. Sunucu soru kütüphanesinden seti düzenler ve **Seti kaydet** der. Hazır havuzda 24 harf için 264 İngilizce soru vardır; cevaplar, açıklamalar ve kategoriler de İngilizcedir. Kendi havuzuna 300 soru ve 64 farklı harfe kadar ekleyebilirsin.
2. Oyuncular oda bağlantısından katılır. Sunucu **Oyunu başlat** der.
3. Üç saniyelik hazırlıktan sonra soru açılır. Buzzer’a ilk basan söz hakkını alır. Basışlar sunucuya ulaşma sırasına göre dizilir; ilk oyuncu için 150 ms toplama aralığı vardır. İstemcinin gönderdiği zaman damgasına güvenilmez.
4. Her söz hakkında **10 saniye** başlar. Oyuncu cevabı toplantıda veya aynı odada sesli söyler. Uygulama sesli görüşme sağlamaz.
5. Sunucu doğru/yanlış kararını verir. Süre aşımı sunucu tarafından otomatik yanlış sayılır. Yanlış bilen aynı soruda tekrar basamaz; kuyruktaki sıradaki oyuncu tam 10 saniye alır. Kuyruk boşsa kalan oyuncular basabilir.
6. Doğru cevap soruyu kapatır. **Pas geç**, cevabı gösterir ve soruyu puansız kapatır; harf tekrar sorulmaz. Son sorudan sonra sonuçlar gösterilir.

**Puanlama:** `Math.round(doğruPuanı × katsayı)` eklenir. Yanlışta ve süre aşımında `-Math.round(yanlışCezası × katsayı)` uygulanır. Örnek: 100 / 50, katsayı 2 → doğru +200, yanlış −100. Temel değerler 1–1000 / 0–1000, katsayı 0,5–5 aralığındadır. Kesirli puanların büyüklüğü en yakın tam sayıya yuvarlanır; yarımlar yukarı yuvarlanır.

**Kısayollar:** Oyuncu ve sunucu: boşluk → buzzer. Sunucu: D → doğru, Y → yanlış, sağ ok → başlat/sonraki. Formlarda, düğmeler odaktayken ve pencereler açıkken kısayollar çalışmaz. Ses kontrolü üst çubukta bulunur.

## Soru havuzu

**Oyunu başlat** düğmesi, her harf için kullanılmamış sorulardan rastgele birini seçer. Harfler çark sırasıyla oynanır. Son soru doğru cevaplandığında veya pas geçildiğinde çarkın tüm soruları geçmişe yazılır. Yarım kalan oyunlar soru tüketmez.

Geçmiş, bu sunucudaki odalar için ortaktır ve `.vigola-data/used-questions.json` dosyasında saklanır. Sunucuyu yeniden başlatmak geçmişi sıfırlamaz. Dağıtımda geçmişi korumak için bu klasörü kalıcı diskte tut. Herhangi bir harfin soruları tükenirse o harfe yeni soru eklemek gerekir. Oyuna başlamadan soru kütüphanesindeki **Hazır havuzu kullan** düğmesiyle kayıtlı özel setinden hazır havuza dönebilirsin.

Hazır havuz, pratik senaryolar ve kavram sorularıyla İngilizce olarak yeniden hazırlanmıştır. Her harf için 11 farklı cevap vardır; İngilizce terimler için `İ` yerine `I` kullanılır. Arayüz ve zorluk etiketleri Türkçedir. Güncellemeyi almak için sunucuyu yeniden başlat; tarayıcıda eski bir set kaydettiysen lobide **Soruları düzenle → Hazır havuzu kullan** seçeneğini kullan. Devam eden odaların seti otomatik değişmez.

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
