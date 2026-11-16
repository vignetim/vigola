# Meme Buzzer incelemesi ve Vigola uyarlaması

## İncelenen kaynak

`../meme-buzzer-quiz-app`: `server.js`, `package.json`, `README.md`, `render.yaml`, `public/index.html`, `public/host.html`, `public/common.js`, `public/style.css`. Kaynak proje Express, Socket.IO ve QRCode kullanıyor. İstemciler React olmadan HTML ve ortak JavaScript ile yazılmış. Derleme adımı yok. Render dağıtım tanımı bulunuyor.

## Kaynak uygulamanın yapısı

| Katman | Davranış |
| --- | --- |
| HTTP | Statik istemciler, `/host`, davet QR’ı, LAN adresi bilgisi, o anki soru görseli ve YouTube gömülebilirlik kontrolü |
| Odalar | Bellekte Map, dört harfli oda kodu, sunucu tokenı, oyuncu oturumları ve Socket.IO odaları |
| Soru hazırlama | Görsel yükleme/yapıştırma, dosya adından cevap çıkarma, sıralama, cevap ve video ekleme; IndexedDB’de saklama ve içe/dışa aktarma |
| Sunum | Lobi, soru, ara sıralama, final ve isteğe bağlı video; ayrı izleyici ekranı |
| Eşzamanlama | Sunucu saatine göre 3–2–1 gösterimi; görselin soru anında `/q` ile alınması |
| Buzzer | İlk basıştan sonra 400 ms toplama, istemci zamanına göre 1 saniyeye kadar gecikme telafisi, sıra kuyruğu, 1,5 saniye erken basma engeli |
| Karar | Doğruda genel ayarlardan puan ekleme ve cevap açma; yanlışta genel ceza, aynı soruda kilit ve sıradaki oyuncuya geçiş |
| Süre | Cevap için deadline yayınlama ve istemcide sayaç; kaynak sunucuda deadline dolunca otomatik yanlış kararı yok |
| Yönetim | Genel puan/süre ayarları, manuel puan düzeltme, oyuncu çıkarma, skor sıfırlama ve yeni oda |
| Kurtarma | Oyuncu kimliğiyle yeniden bağlanma; sunucunun tarayıcıdaki puan/ayar snapshot’ıyla oda yeniden oluşturması |
| Ortak UX | Üretilmiş sesler, avatarlar, skorlar, final podyumu, konfeti, kısayollar ve sürüm değişince yenileme |

## Yeniden tasarlanan ürün

Vigola, geliştirici ekiplerinin toplantıda veya aynı ortamda sözlü oynadığı yazılım bilgisi yarışmasıdır. Ana ekranın işi, soruyu ve söz hakkını açıkça göstermek ve sunucunun hızlı karar vermesini sağlamaktır. Ayrı klasörde Next.js App Router ve React ile yeniden kuruldu.

Görsel yön: açık gri çalışma alanı `#f6f7fa`, beyaz paneller `#ffffff`, mürekkep `#292939`, mor `#7657d7`, doğru için yeşil `#28a17d`, yanlış için gül `#dc727a`. Manrope başlık, DM Sans arayüz, Space Mono harf ve veri fontudur. Ürünün imzası olan harf halkası; aktif, bilinen ve pas geçilen harfleri tek bakışta gösterir. Oyun alanı ve kararlar solda; sıralama, basış kuyruğu ve akış sağdadır. Telefonlarda tek kolona geçer.

## Korunan ve değişen kararlar

| Özellik | Vigola |
| --- | --- |
| Canlı oda / davet / oyuncu / izleyici | Korundu; altı harfli oda kodu ve ayrı katılım bağlantısı |
| İlk basan ve bekleyenler | Korundu; sıralama sunucuya ulaşma sırasına göre, istemci zamanına güvenilmez |
| Hazırlık sayımı | Sabit 3 saniye |
| Cevap süresi | Sabit 10 saniye; süre aşımında sunucu otomatik ceza ve sıra geçişi uygular |
| Puan | Soruya ait temel doğru, yanlış cezası ve ayrı katsayı |
| Soru içerikleri | Meme yerine metin, harf, kategori, zorluk, açıklama ve isteğe bağlı kod |
| Soru düzenleme | Ayrı kütüphane, ekle/sil/düzenle, arama ve tarayıcıda kayıt |
| Cevap gizliliği | Varsayılan soru bankası oyuncu JavaScript’ine dahil edilmez; cevaplar çözümden önce genel yayına girmez |
| Skor ve final | Canlı sıralama, basış kuyruğu, olay akışı ve ilk üç podyumu |
| Yeniden bağlanma | Sunucu ve oyuncu tokenlarıyla süreç içi oda devamı |
| Yeniden başlatma | Otomatik snapshot kurtarması taşınmadı; kalıcı depolama sonraki altyapı adımı |
| Video/görsel | Yazılım sorusu kapsamına alınmadı |
| QR / JSON içe-dışa aktarma / oyuncu çıkarma / elle skor | Bu ilk sürüme taşınmadı; davet bağlantısı, yerel soru kaydı ve yeni tur kullanılır |

Kaynak projede tarayıcıdan iletilen zamanın 1 saniyeye kadar kabul edilmesi kötü niyetli oyuncu tarafından avantaj yaratabilir. Vigola’da sunucuya ulaşma sırası seçildi; bu seçim ağ gecikmesini telafi etmez. Coğrafi olarak uzak oyuncularda gecikme farkı sıralamayı etkileyebilir.

Kaynakta sunucu yeniden başladıktan sonra tarayıcı snapshot’ı kabul edilir. Yeni üründe puanları sunucuda tutma yönü korundu; kalıcı ve güvenilir kurtarma için veritabanı tercih edilmelidir. İlk sürümün bu sınırı README’de açıkça belirtilmiştir.
