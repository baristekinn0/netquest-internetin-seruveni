import { Module } from '../types';

export const MODULES: Module[] = [
  {
    id: 'internet-nedir',
    title: 'İnternet Nedir?',
    subtitle: 'Cihazlar nasıl birbirine bağlanır?',
    emoji: '🌐',
    color: '#6C63FF',
    gradientColors: ['#6C63FF', '#9B59B6'],
    slides: [
      {
        id: 's1',
        title: 'İnternet Bir Ağdır',
        emoji: '🕸️',
        body: 'İnternet, dünya genelinde milyarlarca cihazı birbirine bağlayan devasa bir ağdır. Tıpkı şehirleri birbirine bağlayan yollar gibi, internet de bilgilerin seyahat ettiği bir yol ağıdır.',
      },
      {
        id: 's2',
        title: 'Cihazlar Nasıl Bağlanır?',
        emoji: '🔌',
        body: 'Bilgisayarın, tabletin veya telefonun internete bağlanabilmesi için bir ağa katılması gerekir. Bu ağ genellikle Wi-Fi (kablosuz) veya kablo ile sağlanır. Evdeki modem, seni bu büyük ağa bağlayan kapıdır!',
      },
      {
        id: 's3',
        title: 'Sunucular ve İstemciler',
        emoji: '🏢',
        body: 'İnternette iki tür bilgisayar vardır: Sunucular (server) bilgi depolar ve paylaşır. İstemciler (client) — senin cihazın gibi — bu bilgileri ister ve alır. Bir web sitesi açtığında sen istemcisin, siteyi barındıran bilgisayar ise sunucu!',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'İnternet en iyi hangisi ile tanımlanır?',
        options: [
          'Tek bir büyük bilgisayar',
          'Dünya genelinde cihazları birbirine bağlayan ağ',
          'Sadece sosyal medya platformları',
          'Bir telefon şebekesi',
        ],
        correctIndex: 1,
      },
      {
        id: 'q2',
        question: 'Evdeki hangi cihaz seni internete bağlar?',
        options: ['Televizyon', 'Klavye', 'Modem/Router', 'Kulaklık'],
        correctIndex: 2,
      },
      {
        id: 'q3',
        question: 'Web sitesi açarken senin cihazın hangi roldedir?',
        options: ['Sunucu', 'İstemci', 'Modem', 'Kablo'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'ip-adresi',
    title: 'IP Adresi Nedir?',
    subtitle: 'Her cihazın posta adresi',
    emoji: '📮',
    color: '#FF6B6B',
    gradientColors: ['#FF6B6B', '#FF8E53'],
    slides: [
      {
        id: 's1',
        title: 'Cihazların Adresi',
        emoji: '🏠',
        body: 'Her evin bir posta adresi olduğu gibi, internetteki her cihazın da bir IP adresi vardır. IP, "İnternet Protokolü" anlamına gelir. Bu adres sayesinde veriler doğru cihaza ulaşır.',
      },
      {
        id: 's2',
        title: 'IP Adresi Nasıl Görünür?',
        emoji: '🔢',
        body: 'Bir IPv4 adresi şöyle görünür: 192.168.1.1\n\nDört grup rakamdan oluşur, her biri 0-255 arasındadır. Bunlar nokta ile ayrılır. Yeni nesil IPv6 ise çok daha uzundur çünkü dünyadaki her cihaza yetecek kadar adres gerekiyor!',
      },
      {
        id: 's3',
        title: 'Genel ve Özel IP',
        emoji: '🌍',
        body: 'Özel (Private) IP: Evindeki ağdaki adresin (örn. 192.168.x.x). Sadece ev içinde geçerlidir.\n\nGenel (Public) IP: İnternette seni temsil eden adres. Modeminin dış dünyaya açılan adresidir.',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'IP adresi ne işe yarar?',
        options: [
          'İnternet hızını artırır',
          'Cihazların birbirini tanımasını sağlar',
          'Şifreyi korur',
          'Ekranı parlatır',
        ],
        correctIndex: 1,
      },
      {
        id: 'q2',
        question: 'Hangisi geçerli bir IPv4 adresi örneğidir?',
        options: ['abc.def.ghi', '192.168.1.1', '999.999.999.999', 'internet.ev'],
        correctIndex: 1,
      },
      {
        id: 'q3',
        question: '192.168.x.x adresleri genellikle ne tür IP\'dir?',
        options: ['Genel (Public) IP', 'Özel (Private) IP', 'DNS adresi', 'Sunucu adresi'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'paketler-yolda',
    title: 'Paketler Yolda',
    subtitle: 'Veri nasıl taşınır?',
    emoji: '📦',
    color: '#2ECC71',
    gradientColors: ['#2ECC71', '#1ABC9C'],
    slides: [
      {
        id: 's1',
        title: 'Veri Paketlere Bölünür',
        emoji: '✂️',
        body: 'İnternette büyük bir dosya gönderdiğinde, o dosya küçük parçalara bölünür. Bu parçalara "paket" denir. Tıpkı büyük bir pizzayı dilim dilim kesmek gibi! Her paket ayrı ayrı yolculuk yapar.',
      },
      {
        id: 's2',
        title: 'Router — Yol Gösterici',
        emoji: '🗺️',
        body: 'Router (yönlendirici), paketlerin hangi yoldan gideceğine karar verir. Tıpkı kavşaktaki trafik levhaları gibi! Bir yol tıkalıysa, router paketi başka bir yoldan gönderir. Bu yüzden internet kesintisizdir.',
      },
      {
        id: 's3',
        title: 'Paketler Birleşir',
        emoji: '🧩',
        body: 'Tüm paketler hedefe ulaştığında, karşı taraftaki cihaz onları sıra numaralarına göre birleştirir. Böylece orijinal dosya yeniden elde edilir. Bazen paketler farklı yollardan gelebilir ama bu sorun değil!',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'İnternette "paket" nedir?',
        options: [
          'Kargo şirketi',
          'Büyük verinin bölündüğü küçük parçalar',
          'İnternet faturası',
          'Wi-Fi şifresi',
        ],
        correctIndex: 1,
      },
      {
        id: 'q2',
        question: 'Router\'ın görevi nedir?',
        options: [
          'Müzik çalmak',
          'Resimleri büyütmek',
          'Paketlerin doğru yola gitmesini sağlamak',
          'Parolayı saklamak',
        ],
        correctIndex: 2,
      },
      {
        id: 'q3',
        question: 'Paketler hedefe ulaştığında ne olur?',
        options: [
          'Silinir',
          'Sıra numarasına göre birleştirilir',
          'Router\'da bekler',
          'Tekrar bölünür',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'protokoller',
    title: 'Protokoller',
    subtitle: 'İnternetin kuralları: HTTP ve DNS',
    emoji: '📜',
    color: '#3498DB',
    gradientColors: ['#3498DB', '#2980B9'],
    slides: [
      {
        id: 's1',
        title: 'Protokol Nedir?',
        emoji: '🤝',
        body: 'Protokol, bilgisayarların birbirleriyle nasıl konuşacağını belirleyen kurallardır. Tıpkı bir telefon görüşmesindeki "Alo?" gibi — karşılıklı anlaşma sağlar. Protokol olmadan cihazlar birbirini anlayamaz.',
      },
      {
        id: 's2',
        title: 'HTTP ve HTTPS',
        emoji: '🌐',
        body: 'HTTP (HyperText Transfer Protocol): Web sayfalarını getiren protokoldür. Tarayıcın ile sunucu arasındaki anlaşmadır.\n\nHTTPS ise güvenli versiyondur — S, "Secure" yani güvenli demektir. Banka sitelerinde mutlaka HTTPS kullanılır! 🔒',
      },
      {
        id: 's3',
        title: 'DNS — İnternetin Telefon Rehberi',
        emoji: '📖',
        body: '"google.com" yazdığında aslında bir IP adresi aranır. DNS (Domain Name System) bunu yapar! "google.com → 142.250.185.46" gibi dönüşüm sağlar.\n\nDNS olmadan her siteye IP adresiyle girmek zorunda kalırdın — düşün bir dünya!',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Protokol ne anlama gelir?',
        options: [
          'İnternet hızı ölçer',
          'Bilgisayarların nasıl iletişim kuracağına dair kurallar',
          'Web sitesinin rengi',
          'Şifre sistemi',
        ],
        correctIndex: 1,
      },
      {
        id: 'q2',
        question: 'HTTPS\'deki "S" harfi ne anlama gelir?',
        options: ['Speed (hız)', 'System (sistem)', 'Secure (güvenli)', 'Server (sunucu)'],
        correctIndex: 2,
      },
      {
        id: 'q3',
        question: 'DNS ne işe yarar?',
        options: [
          'İnternet hızını artırır',
          'Alan adını (google.com) IP adresine çevirir',
          'Şifreyi şifreler',
          'Router\'ı yönetir',
        ],
        correctIndex: 1,
      },
    ],
  },
];
