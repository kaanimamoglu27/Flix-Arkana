# ARKANA'yı App Store'a yükleme rehberi

Oyun hazır: `app/` klasörü iPhone/iPad uygulamasına dönüşecek her şeyi içeriyor (oyun, internetsiz çalışan dosyalar, ikon, iPhone ve iPad için Türkçe ve İngilizce 8'er mağaza görseli, mağaza metinleri, satın alma kimlikleri, ödüllü reklam bağlantısı). Aynı klasör GitHub'da da var: `kaanimamoglu27/Flix-Arkana` reposunun `app/` klasörü.

Yükleme 4 parçadan oluşur: **hesap**, **reklam hesabı (AdMob)**, **uygulamayı derleme (GitHub'da, Mac gerekmez)**, **App Store Connect'te sayfayı doldurup incelemeye gönderme**.

## 1b. AdMob reklam hesabı (sen yapmalısın, 15 dakika)

Ölünce çıkan "Reklam izle, devam et" düğmesi uygulamada Google AdMob'dan gerçek reklam gösterir.
1. https://admob.google.com adresinde Google hesabınla AdMob hesabı aç, ödeme bilgilerini gir.
2. **Uygulamalar > Uygulama ekle > iOS**, adı ARKANA. Çıkan **uygulama kimliği** `ca-app-pub-...~...` şeklindedir.
3. Bu uygulamada **Reklam birimi ekle > Ödüllü (Rewarded)**. Çıkan **reklam birimi kimliği** `ca-app-pub-.../...` şeklindedir.
4. İki kimliği aşağıdaki 2d adımında GitHub'a `ADMOB_APP_ID` ve `ADMOB_REWARDED_ID` olarak gir. Girilmezse Google'ın test kimlikleri kullanılır: test reklamı gösterir, para kazandırmaz.
5. App Store'da yayına çıkınca AdMob'da uygulamayı mağaza sayfasına bağla.

---

## 1. Apple Developer hesabı (sen yapmalısın, 1-3 gün)

1. https://developer.apple.com/programs/enroll adresinden Apple Developer Program'a katıl. Yıllık 99 $.
2. Hangi hesap türü?
   - **Şirket (Organization)**: mağazada satıcı adı "Flix" görünür. Şirketin **D-U-N-S numarası** gerekir (ücretsiz, Apple'ın sayfasından başvurulur, birkaç gün sürebilir).
   - **Bireysel (Individual)**: daha hızlı onaylanır, satıcı adı senin adın olur.
   - Öneri: marka için **Şirket** hesabı.
3. Onay gelince https://appstoreconnect.apple.com adresine gir. **Anlaşmalar, Vergi ve Bankacılık** bölümünde "Ücretli Uygulamalar" anlaşmasını imzala, banka ve vergi bilgilerini gir. Bu olmadan uygulama içi satın alma çalışmaz.

## 2. Uygulamayı derleme ve yükleme (Mac GEREKMEZ)

Derleme GitHub'ın bulut Mac'lerinde yapılır (Flix-Arkana reposu herkese açık olduğu için ücretsiz). Senin yapacağın: 4 bilgiyi GitHub'a bir kez girmek, sonra bir düğmeye basmak.

**a) Uygulama kimliğini kaydet (5 dk)**
1. https://developer.apple.com/account > **Certificates, Identifiers & Profiles > Identifiers > +**
2. **App IDs > App**, Description: `ARKANA`, Bundle ID **Explicit**: `com.flixtoys.arkana`. Kaydet. (In-App Purchase kendiliğinden açık gelir.)

**b) App Store Connect'te uygulamayı aç (5 dk)**: aşağıdaki 3. bölümün 1. adımı (Yeni Uygulama). Yükleme bu kayıt olmadan kabul edilmez.

**c) API anahtarı oluştur (5 dk)**
1. https://appstoreconnect.apple.com > **Kullanıcılar ve Erişim > Entegrasyonlar > App Store Connect API > Ekip Anahtarları > +**
2. Ad: `GitHub`, Erişim: **Yönetici (Admin)**. Oluştur.
3. **API Anahtarını İndir** (.p8 dosyası, sadece bir kez indirilebilir). Sayfadaki **Anahtar Kimliği (Key ID)** ve üstteki **Issuer ID**'yi not al.
4. **Team ID**: https://developer.apple.com/account > Membership details > Team ID (10 karakter).

**d) Bilgileri GitHub'a gir (5 dk)**
https://github.com/kaanimamoglu27/Flix-Arkana > **Settings > Secrets and variables > Actions > New repository secret**. Şu isimlerle ekle:

| İsim | Değer |
|---|---|
| `ASC_KEY_ID` | Key ID |
| `ASC_ISSUER_ID` | Issuer ID |
| `ASC_KEY_P8` | .p8 dosyasını metin editörüyle aç, içindeki her şeyi (BEGIN ve END satırları dahil) yapıştır |
| `APPLE_TEAM_ID` | Team ID |
| `ADMOB_APP_ID` | (isteğe bağlı) AdMob uygulama kimliği `ca-app-pub-...~...` |
| `ADMOB_REWARDED_ID` | (isteğe bağlı) AdMob ödüllü reklam birimi `ca-app-pub-.../...` |

AdMob kimlikleri boş kalırsa Google'ın test reklamı çıkar (para kazandırmaz). Yayından önce gerçeklerini girmen iyi olur; kod değiştirmeye gerek yok.

**e) Yükle**
1. Repoda **Actions > iOS TestFlight > Run workflow**. Sürüm `1.0` kalsın, **Run workflow**.
2. 15-25 dakika sürer. Yeşil tik çıkınca derleme App Store Connect'e gitmiştir; Apple işledikten sonra (10-30 dk) **TestFlight** sekmesinde görünür.
3. Kırmızı çarpı çıkarsa hatanın linkini buraya at, düzeltirim.
4. Sonraki güncellemelerde sadece e) adımını tekrarla (sürümü 1.1, 1.2 diye artır). Derleme numarası kendiliğinden artar.

Her değişiklikte ayrıca **iOS build check** adlı kontrol kendiliğinden çalışır: Xcode projesinin derlendiğini gösterir, hiçbir şey yüklemez.

**Mac'in olursa** (isteğe bağlı, aynı sonuç): `app` klasöründe `export APPLE_TEAM_ID=...` sonra `./ios.sh yukle 1.0`. Simülatörde denemek için `./ios.sh simulator`. Terminalden Mac'siz yükleme: `gh workflow run ios-testflight.yml -R kaanimamoglu27/Flix-Arkana -f version=1.0`. Üç oyunun ortak rehberi: [../TESTFLIGHT_REHBERI.md](../TESTFLIGHT_REHBERI.md).

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
   - Görsellerin hepsi tek sayfada: https://claude.ai/artifact/WGVXMaiC9H4rnMSnzuFDjX (dokun, tam boyut açılır, uzun basıp kaydet).
   - **Kullanılacak set (çizgi roman tarzı):** İngilizce sayfaya `store/cizgi_roman/en/iphone_6.9/` ve `en/ipad_13/`, Türkçe sayfaya `store/cizgi_roman/tr/...` içindeki 7'şer görsel, sırayla. Uygulama ikonu: `store/icon-1024.png` (= `cizgi_roman/icon-1024.png`). Kapak: `cizgi_roman/kapak_en_3840x2160.png`. Açılış ekranı: `cizgi_roman/acilis_ekrani_2732.png`. Eski 3D tarzı set `store/pro_en/` içinde yedek.
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
