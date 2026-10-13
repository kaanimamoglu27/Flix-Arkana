# ARKANA: App Store paketi

Bu klasör ARKANA'yı iPhone (ve istersen Android) uygulamasına çeviren hazır iskelettir. Oyun `www/` içinde, internet olmadan çalışır: three.js, efekt dosyaları ve Fredoka ve Bangers (çizgi roman) yazı tipleri yanında.

## Klasörler
- `www/index.html` oyunun kendisi. Elle düzenleme: web sürümü (`../index.html`) değişince `python3 tools/build_www.py` çalıştır, bu dosyayı yeniden üretir ve dış bağlantı kalmadığını kontrol eder.
- `www/native-bridge.js` gerçek satın alma (App Store / Google Play) ve titreşim bağlantısı. Web'de hiçbir şey yapmaz.
- `capacitor.config.json` uygulama kimliği `com.flixtoys.arkana`, adı ARKANA.
- `tools/ios_setup.sh` iOS projesini yatay ekrana kilitler, durum çubuğunu gizler, şifreleme sorusunu kapatır.
- `store/icon-1024.png` uygulama ikonu (oyundaki FLIX karakterinden). İstersen tasarımcı son halini çizebilir.
- `store/screenshots/` 2796x1290 ekran görüntüleri (iPhone 6.7" yatay). App Store 6.9" için de kabul eder.

## Yayına çıkmak için adımlar (bir geliştirici, Mac ile 1-2 gün)
1. Mac'e Xcode ve Node 20 kur. Bu klasörde: `npm install`, `npx cap add ios`, `sh tools/ios_setup.sh`, `npm run sync`.
2. Apple Developer hesabı (yıllık 99 $), Flix şirketi adına. App Store Connect'te yeni uygulama: paket kimliği `com.flixtoys.arkana`.
3. App Store Connect > Uygulama İçi Satın Alma bölümünde aşağıdaki 11 ürünü **aynı kimliklerle** oluştur. Oyun fiyatları mağazadan okur, Türkiye'de TL gösterir.
4. Xcode'da `ios/App` projesini aç, Signing'de ekibi seç, Capabilities'e "In-App Purchase" ekle. App ikonunu `store/icon-1024.png` ile değiştir.
5. Gizlilik politikasını (aşağıda) flixtoysofficial.com'da yayınla, linkini App Store Connect'e gir.
6. TestFlight ile gerçek telefonda dene: Sandbox hesabıyla her paketi bir kez satın al, "Satın alımları geri yükle" düğmesini dene, titreşimi hisset.
7. Yaş derecelendirmesi anketi: "Seyrek/hafif çizgi film şiddeti" seç. Beklenen yaş: 9+.
8. Ekran görüntülerini, metinleri yükle ve incelemeye gönder.

## Uygulama içi ürünler
| Kimlik | Tür | Fiyat | İçerik |
|---|---|---|---|
| bundle_mini | Tüketilebilir | 0,99 $ | Mini Paket: 1.000 altın + 60 elmas |
| gems_80 | Tüketilebilir | 0,99 $ | 80 elmas |
| gems_500 | Tüketilebilir | 4,99 $ | 500 elmas |
| gems_1200 | Tüketilebilir | 9,99 $ | 1.200 elmas |
| gems_2600 | Tüketilebilir | 19,99 $ | 2.600 elmas |
| gems_7000 | Tüketilebilir | 49,99 $ | 7.000 elmas |
| gems_15000 | Tüketilebilir | 99,99 $ | 15.000 elmas |
| coins_1000 | Tüketilebilir | 0,99 $ | 1.000 altın |
| coins_6000 | Tüketilebilir | 4,99 $ | 6.000 altın |
| coins_15000 | Tüketilebilir | 9,99 $ | 15.000 altın |
| coins_40000 | Tüketilebilir | 19,99 $ | 40.000 altın |
| starter | Tüketilemez | 2,99 $ | KICK kahramanı + 5.000 altın + 150 elmas (tek sefer, geri yüklenebilir) |
| bundle_hero | Tüketilemez | 4,99 $ | FLICK + Kardan Adam (FLICK) ve Ninja (KICK) kostümleri + 4.000 altın + 300 elmas |
| bundle_adv | Tüketilemez | 9,99 $ | Lav Vadisi, Buz Çağı ve Deprem Şehri haritaları + 8.000 altın + 700 elmas |
| bundle_legend | Tüketilemez | 19,99 $ | KICK, FLICK ve 3 Mythic kostüm + 20.000 altın + 1.500 elmas |
| bundle_god | Tüketilemez | 49,99 $ | KICK, FLICK ve 3 Godlike kostüm + 50.000 altın + 4.000 elmas |
| noads | Tüketilemez | 2,99 $ | Reklamsız + VIP: günlük hediye 2 katı |

Oyun içi ekonomi iki para birimiyle çalışır. Altın her koşudan (yenilen düşman, dalga, patron, toplanan Flix'ler) ve günlük hediyeden gelir; kahramanlar (KICK 2.500, FLICK 4.000), Common-Legendary kostümler, yol arkadaşları ve haritalar altınla açılır. Elmas patron yenince, her 10 dalgada, hikayeyi bitirince (+120) ve günlük hediyeyle gelir; Mythic (1.200 💎) ve Godlike (6.500 💎) kostümler elmasla açılır, elmas altına da çevrilebilir. Kostüm nadirlikleri: Common, Rare, Epic, Legendary, Mythic, Godlike. Hiçbir şey sadece parayla açılmaz; para yalnızca hızlandırır. Oyunda şu an reklam yok; "Reklamsız + VIP" bugün günlük hediyeyi 2 katına çıkarır, reklam eklenirse onları da kapatır. App Store incelemesinde reklamsız oyunda "reklamsız" satmak sorun çıkarabilir: reklam eklenene kadar ürünün mağaza adını "VIP" yapmak daha güvenli.

Not: satın alma şu an telefonun içinde onaylanıyor. İleride hileyi azaltmak için sunucu doğrulaması (ör. RevenueCat) eklenebilir.

## Görüntü ve hız
- Ayarlardaki "💎 Ultra" ekranın tam çözünürlüğünde çizer (iPhone'da ekranın kendi piksel sayısı, 4K ekranda en fazla 4K). "🎬 2K" daha hafif, "⚡ Hızlı" eski telefonlar için.
- Oyun 60 fps hedefler: telefon zorlanırsa çözünürlüğü kademeli düşürür (3 saniyelik ölçüm, sakin basamaklar, ileri geri zıplamaz), rahatlayınca geri yükseltir. Çözünürlük değişimi artık malzemeleri yeniden derlemez; eskiden ara ara görülen takılmanın ana sebebi buydu.
- Şehir blokları tek karede değil, ekran dışında kare başına bir blok olarak kurulur. Patron ve yardımcı kahraman çizimleri menüdeyken önceden derlenir (ilk patron artık oyunu dondurmaz). Gölgeler kahramanı takip eder.
- Kontrol: ⚙️ Ayarlar'dan Analog (sürükle), Dokunmatik (dokunduğun yere yürür) veya Yön tuşları (sol altta 8 yönlü tuş takımı).

## Mağaza metni (TR)
**Ad:** ARKANA: Flix Kahramanları
**Alt başlık:** Kıyamet ordusuna karşı tek kahraman!
**Açıklama:**
New York'ta yarıklar açıldı ve Kıyamet Lordu'nun ordusu sokaklara döküldü. İskeletler, zombiler, robotlar ve uçan yarasalar her yerde! FLIX meşalelerini yaktı, pelerinini taktı ve şehri kurtarmaya geldi.

• Çizgi roman hikaye: tabletlere kapılan şehir renksizleşti; ruhları kurtar, New York'u bölge bölge yeniden renklendir.
• Tek parmakla oyna: sen kaç, kahramanın otomatik saldırır.
• Her seviyede güç kartı seç: ateş topları, şimşek, meteor, dönen yıldızlar ve daha fazlası.
• 4 mod: Hikaye (50 dalga, 5 dev patron, epik final), Sonsuz, Patron Koşusu ve Flix Avı.
• Şehre dağılmış Flix figürlerini topla, kombo yap, rekor kır.
• Yarıkları kapat, elit düşmanları devir, altın Flix'leri kap.
• FLIX, KICK ve FLICK: 3 kahraman, her birine Common'dan Godlike'a 9 kostüm. 8 yol arkadaşı, 5 harita.
• Hikayede arada açtığın diğer kahramanlar yardıma koşar.
• Güçlü vuruş hissi: titreşim, parlamalar, ekran sarsıntısı.
• Reklam yok.

**Anahtar kelimeler:** kahraman, hayatta kalma, aksiyon, zombi, iskelet, robot, roguelike, flix, şehir, patron

## Store listing (EN)
**Name:** ARKANA: Flix Heroes
**Subtitle:** One hero against the doom army!
**Description:**
Rifts have torn open across New York and the Doom Lord's army is pouring into the streets. Skeletons, zombies, robots and swooping bats are everywhere! FLIX lit his torches, threw on his cape and came to save the city.

• Comic-book story: the city lost its colour to tablets; free the souls and paint New York back, district by district.
• One-thumb play: you dodge, your hero attacks on his own.
• Pick a power card every level: fireballs, lightning, meteors, spinning stars and more.
• 4 modes: Story (50 waves, 5 giant bosses, epic finale), Endless, Boss Rush and Flix Hunt.
• Collect Flix figures scattered across the city, chain combos, chase high scores.
• Close rifts, topple elite enemies, grab golden Flix.
• FLIX, KICK and FLICK: 3 heroes with 9 skins each, from Common to Godlike. 8 companions, 5 maps.
• In story mode your other unlocked heroes sometimes drop in to help.
• Punchy hit feel: haptics, flashes, screen shake.
• No ads.

## Gizlilik politikası (yayınlanacak metin)
ARKANA (Flix) hesap oluşturmaz; ad, e-posta, konum veya reklam kimliği toplamaz. Oyun ilerlemesi yalnızca cihazınızda saklanır. Uygulama içi satın alımlar Apple App Store tarafından işlenir; ödeme bilgilerinizi görmeyiz. Oyunda reklam ve analiz aracı yoktur. İletişim: flixtoysofficial.com.

App Store "Uygulama Gizliliği" bölümünde: **Veri toplanmıyor** seçilebilir.

## Lisanslar
three.js (MIT), Fredoka ve Bangers yazı tipleri (SIL Open Font License). Hepsi ticari kullanıma açık.
