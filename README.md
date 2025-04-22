# beije Frontend Assignment

Bu proje, beije'nin frontend geliştirici pozisyonu için hazırlanmış bir ödev projesidir. Proje, beije'nin web sitesinin login ve paket seçim sayfalarını içermektedir.

## 🚀 Özellikler

### Login Sayfası
- Kullanıcı girişi
- Form validasyonu
- Hata mesajları
- Yükleme durumu göstergesi
- Responsive tasarım
- Ürünler menüsü hover animasyonu

### Paketler Sayfası
- Menstrual ve Destekleyici ürünlerin kategorize edilmiş listesi
- Ürün seçimi ve miktar ayarlama (10'ar adetlik paketler halinde)
- Seçilen ürünlerin özet paneli
- Toplam fiyat hesaplama
- Sepete ekleme fonksiyonu
- Responsive tasarım
- LocalStorage entegrasyonu ile seçimlerin saklanması
- Yükleme durumu göstergesi

## 🛠️ Teknolojiler

- **Next.js** - React framework
- **TypeScript** - Tip güvenliği
- **Material-UI** - UI komponentleri
- **Redux Toolkit** - State yönetimi
- **Axios** - HTTP istekleri
- **React Hook Form** - Form yönetimi
- **Sonner** - Toast bildirimleri
- **Jest** - Test framework
- **React Testing Library** - Komponent testleri

## 📦 Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/your-username/beije-assignment.git
```

2. Bağımlılıkları yükleyin:
```bash
npm install
# veya
yarn install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
# veya
yarn dev
```

4. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 🏗️ Proje Yapısı

```
src/
├── app/                    # Next.js app router
│   ├── login/             # Login sayfası
│   │   └── __tests__/    # Login sayfası testleri
│   └── packets/           # Paketler sayfası
│       └── __tests__/    # Paketler sayfası testleri
├── components/            # Yeniden kullanılabilir komponentler
├── store/                 # Redux store
│   ├── slices/           # Redux slice'ları
│   └── store.ts          # Store konfigürasyonu
├── services/             # API servisleri
├── types/                # TypeScript tipleri
└── utils/                # Yardımcı fonksiyonlar
```

## 🔑 API Endpoints

### Auth
- **POST** `/sign-in-request` - Kullanıcı girişi
- **GET** `/profile` - Kullanıcı profili

### Products
- **GET** `/packets-and-products` - Ürün ve paket listesi
- **POST** `/verify-packet-price` - Paket fiyat doğrulama

## 🎨 Tasarım

Proje, beije'nin Figma tasarımına uygun olarak geliştirilmiştir. Tasarım dosyasına [buradan](https://www.figma.com/design/eDBOfVaqiWYbeQc0pfsyuq/Untitled?node-id=0-1&p=f&t=uEMVjSwx3gKgCpQC-0) ulaşabilirsiniz.

## 📱 Responsive Tasarım

Proje, aşağıdaki ekran boyutlarına uyumlu olarak tasarlanmıştır:
- Mobil: 320px - 480px
- Tablet: 481px - 768px
- Laptop: 769px - 1024px
- Desktop: 1025px ve üzeri

## 🔒 Güvenlik

- Token'lar localStorage'da güvenli bir şekilde saklanmaktadır
- API isteklerinde token doğrulaması yapılmaktadır
- Form validasyonları hem client hem de server tarafında gerçekleştirilmektedir

## 🧪 Test

Projede test yazımı için Jest ve React Testing Library kullanılmıştır. Testleri çalıştırmak için:

```bash
npm test
# veya
yarn test
```

### Test Senaryoları

#### Paketler Sayfası (`PacketsPage.test.tsx`)
- ✓ Başlangıçta yükleme durumunu gösterir
- ✓ Yükleme tamamlandığında ürünleri gösterir
- ✓ Ürün seçimini yönetir
- ✓ Miktar değişikliklerini yönetir
- ✓ Toplam fiyatı doğru hesaplar

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız.

## 🤝 Katkıda Bulunma

1. Fork'layın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun
