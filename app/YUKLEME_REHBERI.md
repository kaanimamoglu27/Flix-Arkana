# ARKANA'yı App Store'a yükleme rehberi

Oyun hazır: `app/` klasörü iPhone/iPad uygulamasına dönüşecek her şeyi içeriyor (oyun, internetsiz çalışan dosyalar, ikon, iPhone ve iPad için Türkçe ve İngilizce 8'er mağaza görseli, mağaza metinleri, satın alma kimlikleri, ödüllü reklam bağlantısı). Aynı klasör GitHub'da da var: `kaanimamoglu27/Flix-Arkana` reposunun `app/` klasörü.

Yükleme 4 parçadan oluşur: **hesap**, **reklam hesabı (AdMob)**, **uygulamayı derleme**, **App Store Connect'te sayfayı doldurup incelemeye gönderme**.

## 1b. AdMob reklam hesabı (sen yapmalısın, 15 dakika)

Ölünce çıkan "Reklam izle, devam et" düğmesi uygulamada Google AdMob'dan gerçek reklam gösterir.
1. https://admob.google.com adresinde Google hesabınla AdMob hesabı aç, ödeme bilgilerini gir.
2. **Uygulamalar > Uygulama ekle > iOS**, adı ARKANA. Çıkan **uygulama kimliği** `ca-app-pub-...~...` şeklindedir.
3. Bu uygulamada **Reklam birimi ekle > Ödüllü (Rewarded)**. Çıkan **reklam birimi kimliği** `ca-app-pub-.../...` şeklindedir.
4. İki kimliği geliştiriciye (ya da bana) ver. Uygulama kimliği `tools/ios_setup.sh` komutuna, reklam birimi `www/native-bridge.js` içindeki `AD_UNIT` satırına girer. Şu an Google'ın test kimlikleri duruyor: test reklamı gösterir, para kazandırmaz.
5. App Store'da yayına çıkınca AdMob'da uygulamayı mağaza sayfasına bağla.

---

## 1. Apple Developer hesabı (sen yapmalısın, 1-3 gün)

1. https://developer.apple.com/programs/enroll adresinden Apple Developer Program'a katıl. Yıllık 99 $.
2. Hangi hesap türü?
   - **Şirket (Organization)**: mağazada satıcı adı "Flix" görünür. Şirketin **D-U-N-S numarası** gerekir (ücretsiz, Apple'ın sayfasından başvurulur, birkaç gün sürebilir).
   - **Bireysel (Individual)**: daha hızlı onaylanır, satıcı adı senin adın olur.
   - Öneri: marka için **Şirket** hesabı.
3. Onay gelince https://appstoreconnect.apple.com adresine gir. **Anlaşmalar, Vergi ve Bankacılık** bölümünde "Ücretli Uygulamalar" anlaşmasını imzala, banka ve vergi bilgilerini gir. Bu olmadan uygulama içi satın alma çalışmaz.

## 2. Uygulamayı derleme (Mac gerekir; yoksa bir geliştiriciye ver)

Bu adım Xcode ister, Xcode sadece Mac'te çalışır. Üç yol var:

| Yol | Kime uygun | Maliyet |
|---|---|---|
| Kendi Mac'in | Mac'in varsa | Ücretsiz |
| Serbest çalışan iOS/Capacitor geliştirici | Mac yoksa, en kolayı | Genelde 1 günlük iş |
| Bulutta derleme (Codemagic, Ionic Appflow) | Mac yoksa, kendin yapmak istersen | Ücretsiz kotalar var |

Geliştiriciye vereceğin tek şey bu klasör ve şu cümle: *"Capacitor 6 projesi, README'deki adımlarla iOS'a derle, TestFlight'a yükle."*

Mac'te adımlar (Terminal'de, `app` klasörünün içinde):

```
npm install
npx cap add ios
ADMOB_APP_ID=ca-app-pub-XXXX~YYYY sh tools/ios_setup.sh
npm run sync
npx cap open ios
```

Xcode açılınca:
1. Sol üstte **App** projesine tıkla. **Signing & Capabilities** sekmesinde Team olarak Apple hesabını seç.
2. **+ Capability** ile **In-App Purchase** ekle.
3. **Assets > AppIcon** içine `store/icon-1024.png` dosyasını sürükle.
4. Üst menüden **Product > Archive**. Bitince **Distribute App > App Store Connect > Upload**.

## 3. App Store Connect'te uygulama sayfası

1. **Uygulamalarım > + > Yeni Uygulama**
   - Platform: iOS
   - Ad: **ARKANA: Flix Kahramanları**
   - Dil: Türkçe
   - Paket kimliği: **com.flixtoys.arkana**
   - SKU: `arkana1`
2. **Uygulama İçi Satın Almalar**: `app/README.md` içindeki tablodaki 17 ürünü **aynı kimliklerle** oluştur (ör. `gems_500`, `starter`, `noads`).
   - Türleri tabloda yazıyor: tüketilebilir ya da tüketilemez.
   - Fiyatları tablodaki dolar seviyelerinden seç. Türkiye fiyatını Apple TL'ye kendisi çevirir.
   - `noads` ürününün mağaza adı: **"Reklamsız VIP"**. Ölünce reklam izlemeden devam ettirir ve günlük hediyeyi 2 katına çıkarır.
3. **TestFlight**: yüklenen sürüm 10-30 dakikada burada görünür.
   - Kendini test kullanıcısı olarak ekle, iPhone'a TestFlight uygulamasını indir, oyunu kur.
   - **Ayarlar > App Store > Sandbox Hesabı** ile bir paketi satın almayı ve "Satın alımları geri yükle"yi dene. Sandbox'ta para çekilmez.
4. **Uygulama Gizliliği**: reklam olduğu için artık "Veri toplanmıyor" seçilemez. `app/README.md` içindeki "Gizlilik politikası" bölümünde neyin işaretleneceği yazıyor (Cihaz Kimliği, Yaklaşık Konum, Reklam Verileri, Tanılama). Politika metnini flixtoysofficial.com'da bir sayfaya koy ve linkini gir. Oyun açılışta iPhone'un "takip izni" sorusunu sorar; Apple bunu ister.
5. **Yaş derecelendirmesi**: "Çizgi film veya fantastik şiddet: Seyrek/Hafif" seç. Sonuç 9+ olur.
6. **Sürüm sayfası**:
   - Ekran görüntüleri: iPhone "6,9 inç" bölümüne `store/screenshots/phone_tr/` (Türkçe) ve `phone_en/` (İngilizce), iPad "13 inç" bölümüne `ipad_tr/` ve `ipad_en/` içindeki 8'er görseli sırayla yükle.
   - Ad, alt başlık, tanıtım metni, açıklama, anahtar kelimeler ve yenilikler: `store/MAGAZA_METINLERI.md` dosyasından kopyala (Türkçe ve İngilizce hazır, karakter sınırlarına uygun).
   - Destek URL'si: flixtoysofficial.com.
   - Kategori: Oyunlar > Aksiyon. İkinci kategori: Oyunlar > Arcade.
7. **Derleme** bölümünden TestFlight'taki sürümü seç, satın alma ürünlerini bu sürüme ekle.
8. **İncelemeye Gönder**. Apple genelde 1-2 günde cevap verir. Ret gelirse sebebini buraya yaz, düzeltirim.

## Web sürümü (hemen, ücretsiz)

App Store beklenirken oyun zaten internette:

- https://kaanimamoglu27.github.io/flix-kick-up/lootback/

Safari'de açıp **Paylaş > Ana Ekrana Ekle** dersen telefonda uygulama gibi tam ekran açılır.

## Sonra (isteğe bağlı)

- **Google Play**: tek seferlik 25 $. Aynı klasörden `npx cap add android` ile Android sürümü çıkar, Mac gerekmez.
- **Sunucu doğrulaması**: satın alma hilesini azaltmak için RevenueCat gibi bir servis eklenebilir.
