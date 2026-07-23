# Audit Portofolio — Bayu Praditya

> Audit menyeluruh untuk menilai apakah website masih terasa "generic AI", plus rekomendasi konkret menuju kualitas pemenang Awwwards. Ditulis 22 Juli 2026.
> Cakupan: Hero, seluruh section (About, Stack, Projects, Journey, Certificates, GitHub, Contact), shell (Nav/Footer/Loading), sistem motion, UI primitives, aksesibilitas, dan copywriting.

---

## Daftar Isi

1. [Ringkasan Eksekutif (skor + verdict)](#1-ringkasan-eksekutif)
2. [Kelebihan Website Kamu](#2-kelebihan-website-kamu)
3. [Kekurangan Website Kamu](#3-kekurangan-website-kamu)
4. [Kenapa Masih Terasa "Generic AI"](#4-kenapa-masih-terasa-generic-ai)
5. [Desktop vs Mobile](#5-desktop-vs-mobile)
6. [Aksesibilitas & Code Smell (Prioritas)](#6-aksesibilitas--code-smell)
7. [Rekomendasi Menuju Awwwards-tier](#7-rekomendasi-menuju-awwwards-tier)
8. [Perbaikan Copywriting (paling cepat, dampak besar)](#8-perbaikan-copywriting)
9. [Roadmap Upgrade Bertahap](#9-roadmap-upgrade-bertahap)

---

## 1. Ringkasan Eksekutif

**Verdict singkat:** Ini **BUKAN** template murahan. Secara teknis website-mu di atas rata-rata portofolio developer — ada canvas scroll-sequence buatan sendiri, theme toggle dengan morph + suara Web Audio sintetis, dan easter-egg game Space Invaders di kalender GitHub. Itu semua bukti craft nyata.

**TAPI**, website ini masih **terbaca sebagai "strong developer template yang dikerjakan dengan bantuan AI"**, bukan karya yang *art-directed*. Alasannya bukan pada teknis, melainkan pada tiga hal:

1. **Kosakata animasinya standar** — fade-up, mask-reveal nama, blur-in subtitle, magnetic button, mouse parallax, logo marquee, timeline garis-kiri. Semua eksekusinya benar, tapi juri Awwwards sudah lihat masing-masing ratusan kali.
2. **Copywriting-nya khas AI** — penghindaran kontraksi ("Let us build", "I will reply"), list tiga/empat item dengan em-dash, dan buzzword ("Technology Ecosystem", "comprehensive archive").
3. **Ada artefak proses AI yang tertinggal di source code** — komentar "optimized for 90+ Lighthouse", "Opsi 3: Pure Natural Flow" (campuran Indonesia), tombol kedua yang dihapus tapi scaffolding-nya masih ada.

### Skor perkiraan (skala 1–10)

| Dimensi | Skor | Catatan |
|---|---|---|
| Craft teknis / engineering | **8** | Canvas sequence, theme toggle, game — nyata dan solid |
| Sistem desain (token, konsistensi) | **7** | Token bagus, tapi banyak `rgba(34,197,94,...)` hardcoded bocor |
| Orisinalitas motion | **5** | Kompeten tapi genre-standard; hanya 2 momen benar-benar khas |
| Copywriting / voice | **3** | Ini yang paling menyeret ke kesan "AI" |
| Aksesibilitas | **5** | Form & modal bagus; heatmap, marquee, game bermasalah |
| Konsistensi brand | **4** | Nama brand beda-beda di 3 tempat (lihat §3) |
| **Awwwards-readiness keseluruhan** | **5.5** | Fondasi kuat, tapi belum ada "wow" yang art-directed + voice masih generik |

**Kesimpulan:** Kamu 60% jalan. Sisanya BUKAN soal nambah animasi lagi — justru soal **memangkas yang generik, memperkuat 2-3 momen signature, dan menulis ulang semua teks dengan suaramu sendiri.**

---

## 2. Kelebihan Website Kamu

Ini yang harus kamu **pertahankan dan perkuat**, jangan dibuang saat refactor:

### Craft teknis yang tulus
- **Hero canvas scroll-sequence** (`components/hero/`): 113 frame desktop / 124 frame mobile di-scrub ke posisi scroll lewat canvas `drawImage`, dengan *staged loading* untuk LCP (frame 1 dulu → keyframe tiap 10 → sisanya via `requestIdleCallback`), *nearest-frame fallback* biar tidak pernah balik ke frame 0, dan **background blending yang adaptif tema**. Ini engineering betulan, bukan library drop-in.
- **Theme toggle** (`components/shell/theme-toggle.tsx`): morph matahari→bulan dari SVG `<mask>` (bukan tukar ikon), animasi mount pertama disuppress (`isFirst` ref), **plus bunyi klik yang disintesis Web Audio** (sine 3400Hz + noise, envelope `(1-t)^3`). Ini standout — mayoritas toggle cuma pakai mp3 atau diam.
- **Easter-egg game Space Invaders** di kalender GitHub (`components/sections/github/github-calendar.tsx`): kapal nembak sel kontribusi level demi level, ada partikel & parallax bintang. Ini benar-benar memorable — persis jenis kejutan yang disukai Awwwards.
- **Morphing text metaball** di hero (`hero-morphing-text.tsx`): cross-fade dua teks dengan `feColorMatrix` threshold filter yang bikin efek "gooey" cair. Non-trivial.
- **Nav 3D flip-card** (`components/shell/nav.tsx`): tiap item nav punya `preserve-3d` dengan dua muka (`backfaceVisibility: hidden`) yang berputar `rotateX` saat hover. Ambisius dan taktil.
- **SectionOverlap** (`components/ui/section-overlap.tsx`): "light seam" gradient + halo blur sebagai jahitan transisi hero→konten. Detail bespoke yang bagus.
- **Navbar morph** dari full-width jadi "floating pill" (`top-4 max-w-5xl rounded-full backdrop-blur-xl`) yang digerakkan `heroProgress` lewat custom event `hero-scroll`.

### Fondasi rekayasa yang sehat
- Stack modern & tepat: Next 16, React 19, Tailwind v4, GSAP+ScrollTrigger, Lenis (di-wire ke GSAP ticker dengan benar), Motion, Supabase.
- **Sistem token warna** rapi (`--background`, `--card`, `--accent`, dst.) dengan dukungan light/dark.
- **Reduced-motion dihormati** di primitives JS (`Reveal`, `Counter`, `MagicText`, `LoadingScreen`, `SmoothScroll`) dan transisi CSS.
- **Contact form** (`contact-form.tsx`): react-hook-form + zod, `aria-invalid`, `aria-describedby`, `<Label htmlFor>` — bagian paling aksesibel di seluruh situs.
- **Project detail modal** punya `role="dialog"`, `aria-modal`, Escape-to-close, body scroll lock + Lenis stop/start.
- Performa dipikirkan: preload LCP responsif (`media` query per breakpoint), `priority` pada cover project awal, WebP di mana-mana.

---

## 3. Kekurangan Website Kamu

Diurut dari yang **paling merusak kesan premium** ke yang minor.

### A. Copywriting terbaca AI (dampak persepsi TERBESAR)
Lihat §8 untuk daftar lengkap + perbaikan. Ringkasnya: penghindaran kontraksi, list em-dash, buzzword.

### B. Inkonsistensi brand — nama kamu muncul 3 versi berbeda
- Logo (`components/ui/logo.tsx`) menampilkan **"Uyab."**
- Loading screen (`loading-screen.tsx`) menampilkan **"BayuPraditya."**
- `aria-label` logo berbunyi **"Bayu Praditya"**

Tiga string brand berbeda di halaman yang sama = langsung terasa belum matang. **Pilih satu wordmark dan pakai konsisten.**

### C. Data & klaim yang "bau" placeholder / fiktif
- **Stats di About di-hardcode**, bukan dari data (`defaultStats` selalu dirender). Komentarnya sendiri mengakui: `// Fallback stats — these can be moved to Supabase later`.
- **Angka aneh secara UX:** `{ label: "Business active since", value: 2023 }` — counter menghitung `0 → 2023`. Tahun di-*count-up* dari nol terbaca seperti bug. Label "Happy Gamers / Orders" (5000+) membingungkan.
- **"Now building" card di GitHub di-hardcode & kemungkinan fiktif:** *"An on-device retrieval layer for personal knowledge tools..."* + *"Follow along on GitHub for weekly commits."* Ini bukan data-driven; kalau tidak benar, hapus.
- Ada jalur `activity.isPlaceholder` yang bisa menampilkan **sample data ke publik** kalau URL GitHub belum diisi — risiko ketahuan.
- `githubUser` fallback di-hardcode dua kali ke `"bayupradityaa"`.

### D. Motion repetitif & satu kurva "default premium"
- Hampir semua section pakai `Reveal` fade-up yang sama (`y:22 → 0`, `ease:[0.16,1,0.3,1]`, stagger `delay={i*0.06}`). Kohesif tapi monoton.
- **Easing `[0.16, 1, 0.3, 1]` (easeOutExpo) dipakai di mana-mana** — Reveal, Counter, LoadingScreen, Lenis. Ini "kurva premium default internet"; terbaca *tasteful-generic*, bukan khas.
- Hanya ~4 primitive motion nyata. Momen yang benar-benar distinctive cuma 2: MagicText bio & game GitHub.

### E. Section yang paling generik
- **Journey** = timeline garis-kiri + titik dot. Pola portofolio paling umum sedunia. Tanpa line-draw, tanpa animasi node.
- **Tech Stack** = logo marquee dua baris. Trope portofolio yang sangat umum (walau ikon custom-nya bagus).

### F. Hero terasa sedikit "belum selesai"
- Cuma **satu CTA** ("View Projects"). Kode jelas menganggarkan dua tombol: ada `btnSecondary` yang didefinisikan tapi tak dipakai, `GithubIcon` di-import tanpa dipakai, dan penamaan singular `button1Ref` / `buttonWraps: [button1]`. Scaffolding tombol kedua yang dihapus masih tertinggal.
- **Parallax mouse cuma ~3px efektif** — nyaris tak terlihat; effort besar, payoff kecil.
- Ada **dua ScrollTrigger fade yang overlap** di range mirip (timeline fade di 88% + fade sticky terpisah di 70%).

### G. Artefak proses AI di source code
- Komentar self-congratulatory: `"optimized for 90+ Google Lighthouse performance scores"`, `"instant sub-second LCP"`, `"0ms TBT spike"` (bahkan diulang di dua file).
- `"Opsi 3: Pure Natural Flow"` — campur Bahasa Indonesia, sisa eksplorasi prompt.
- Komentar posisi timeline **tidak sinkron** dengan nilai kode (komentar bilang `37%–44%`, kode `0.30`).
- Over-dokumentasi komponen sepele: `"Dumb component — zero animation logic."`

### H. Bug fungsional kecil
- **`useLenis()` praktis selalu `null`** (`smooth-scroll.tsx`): context value diisi dari mutasi `ref`, bukan state — tidak pernah trigger re-render. Konsumen hook dapat `null`.
- `getContext("2d", { alpha: false })` tapi kode tetap menggambar gradient ke transparan — alpha diabaikan, potensi blend-to-opaque yang tak diinginkan.
- `navItemConfig` punya 6 entri gradient **identik** (fake configurability).
- `offset: hash === "#hero" ? 0 : 0` — ternary no-op.
- Footer memilih ikon via tangga `if/else-if` string, bukan menyimpan komponen di data.

---

## 4. Kenapa Masih Terasa "Generic AI"

Ini inti pertanyaanmu. Tiga sumber utama:

### 4.1 Voice/copy (penyebab #1)
Pembaca manusia langsung merasa "ini ditulis mesin" dari pola berikut:
- **Anti-kontraksi konsisten:** "Let us build", "I will reply", "I am working", "I ship". Manusia nulis "Let's", "I'll".
- **Triad em-dash:** *"...web development, artificial intelligence, and digital business—each built with a focus on performance, scalability, and meaningful user experiences."*
- **Buzzword inflation:** "Technology Ecosystem", "comprehensive archive" (untuk portofolio pribadi), "Building thoughtful digital experiences through modern web engineering, backend systems, and artificial intelligence".

### 4.2 Motion yang aman & seragam
Semua efek benar, tapi tidak ada yang mengambil **risiko estetis**. Awwwards menghargai *point of view*, bukan kelengkapan. Fade-up + easeOutExpo di semua tempat = "premium tapi anonim".

### 4.3 Jejak proses di kode
Komentar Lighthouse, "Opsi 3", scaffolding tombol yang mati — ini semua sinyal "di-generate lalu ditinggal", bukan diukir.

> **Insight kunci:** Yang bikin terasa AI **bukan** kekurangan fitur — justru website ini *terlalu lengkap secara seragam*. Yang hilang adalah **kekhasan** (voice + 1-2 momen art-directed) dan **kebersihan** (buang artefak & data palsu).

---

## 5. Desktop vs Mobile

### Yang sudah baik
- Hero punya aset & tuning terpisah: tinggi section `160vh` (mobile) vs `200vh` (desktop); folder frame beda; `scrub: 0.2` (mobile) vs `0.5` (desktop); DPR dipaksa `1` di mobile demi perf.
- Layout section responsif standar (grid 1→2→3 kolom, mask marquee menyesuaikan).
- Nav punya drawer mobile dengan Escape-to-close.

### Masalah / risiko di mobile
- **DPR dipaksa `1` di mobile** → portrait hero bisa terlihat *soft/buram* di HP retina. Pertimbangkan `min(dpr, 1.5)`.
- **Teks hero tidak punya layout khusus mobile** — kolom kiri yang sama dipakai; cek apakah `clamp(3rem, 7.5vw, 6.5rem)` tidak kepanjangan di layar sempit.
- **`text-justify` pada MagicText bio** → "sungai" spasi jelek, paling parah di mobile. Ganti ke rata kiri.
- **Marquee menggandakan item ×4** dan tiap pill `tabIndex={0}` → di mobile screen reader membaca tiap teknologi 4×, dan jadi banyak tab-stop.
- **Game GitHub & heatmap mouse-only** — di layar sentuh, tooltip `onMouseEnter` tak berfungsi; sel tak punya `role`/keyboard access.
- **Loading screen memblok 1.5s** di kunjungan pertama — di koneksi mobile terasa lama; ini gate flat, bukan choreography.

---

## 6. Aksesibilitas & Code Smell

### Aksesibilitas — urutan prioritas
1. **Modal project tanpa focus trap** — fokus tidak dipindah ke dialog saat buka, tidak dikembalikan ke trigger saat tutup, Tab bisa "bocor" ke halaman belakang. (Ini miss utama.)
2. **Marquee ×4 + `tabIndex={0}`** di tiap duplikat → tab-stop & pembacaan berulang. Solusi: bungkus marquee `aria-hidden`, sediakan satu list teknologi yang aksesibel.
3. **Kartu "All Projects" adalah `<article onClick>`** tanpa `role="button"`/`tabIndex`/handler keyboard → tidak bisa dioperasikan keyboard.
4. **Heatmap & game GitHub mouse-only** — sel tanpa `role`, tanpa `aria-label`, tanpa fokus keyboard.
5. **MagicText render teks dobel** (ghost + aktif) tanpa `aria-hidden` di layer dekoratif → berpotensi dibaca dua kali; + `select-none` bikin bio tak bisa dicopy.
6. **`ScrollFloat` & morphing text & game abaikan `prefers-reduced-motion`** (jalur GSAP/rAF/canvas tidak kena override CSS).
7. **Morphing text hero:** dua div teks absolut keduanya di a11y tree → screen reader baca "text1" dan "text2" bersamaan. Beri `aria-hidden` pada layer non-aktif + satu label kanonik.

### Code smell — urutan dampak
1. `useLenis()` mengembalikan `null` (bug context/ref). 
2. Stats About hardcoded + tahun di-count-up dari 0.
3. Data "now building" & fallback GitHub hardcoded/fiktif.
4. `rgba(34,197,94,...)` & hex GitHub (`#24292e`, `#161b22`, `bg-neutral-800`) hardcoded → **light theme akan pecah** di kalender/game.
5. Dead code hero (`btnSecondary`, `GithubIcon`, scaffolding tombol ke-2).
6. `github-calendar.tsx` ~1.070 baris mencampur kalender+game+fetch+deteksi tema; game memutasi SVG lewat `document.getElementById().setAttribute("fill")` — melanggar model render React.
7. Komentar posisi timeline drift; komentar marketing Lighthouse; `"Opsi 3"`.
8. `navItemConfig` 6 entri identik; `offset ? 0 : 0`; easing lambda Lenis diduplikasi 3×.

---

## 7. Rekomendasi Menuju Awwwards-tier

Prinsipnya: **bukan menambah, tapi mempertajam.** Awwwards menilai *point of view*, orisinalitas, dan eksekusi yang bersih — bukan jumlah animasi.

### 7.1 Tetapkan "Art Direction" — satu ide besar
Portofolio pemenang selalu punya **konsep**. Pilih satu sudut dan komit:
- **Editorial / Swiss** — tipografi besar, grid kelihatan, ruang kosong berani, warna minim. Cocok karena token-mu sudah bersih.
- **Terminal / Engineering** — mono font, motif command-line, "boot sequence" alih-alih splash nama. Cocok dengan persona developer + game GitHub.
- **Playful / Toylike** — perbanyak easter egg (kamu sudah punya 1 game!), kursor kustom, interaksi fisik.

Pilih **satu**, lalu buang elemen yang tidak mendukungnya. Konsistensi konsep > kelengkapan fitur.

### 7.2 Perkuat 2-3 momen "signature", buang sisanya
- **Jadikan game GitHub bintang utama** — beri teaser/hint biar orang menemukannya; ini pembeda nyatamu.
- **MagicText bio** — pertahankan, tapi perbaiki (rata kiri, bisa diselect, `aria-hidden` ghost).
- Ganti **Journey timeline generik** dengan sesuatu yang bermerek: scroll-pinned horizontal, atau "line-draw" SVG yang tergambar saat scroll, atau kartu yang menumpuk.
- Ganti **marquee stack** dengan grid interaktif (hover mengungkap proyek yang pakai tech itu) — atau setidaknya buat 1 baris yang lebih pelan & elegan.

### 7.3 Perkaya kosakata motion (lawan keseragaman)
- **Berhenti pakai easeOutExpo untuk segalanya.** Tetapkan 2-3 kurva dengan peran berbeda: satu untuk teks (tegas), satu untuk elemen besar (lembut/pegas), satu untuk mikro-interaksi.
- Tambah **transisi antar-section** (bukan cuma reveal per-elemen) — misal warna background bergeser halus, atau elemen "diserahkan" dari satu section ke berikutnya (kamu sudah mulai dengan SectionOverlap).
- **Kursor kustom** yang reaktif (membesar di link, label "view" di project) — murah, dampak besar untuk kesan "interaktif tidak basic".
- **View Transitions API** (Next 16 mendukung) untuk navigasi ke `/projects` biar terasa seperti app, bukan reload.

### 7.4 Detail yang mengangkat ke "premium"
- **Custom cursor + magnetic** yang benar-benar terasa (bukan 3px).
- **Sound design opsional** (kamu sudah punya Web Audio di toggle — perluas: hover halus, submit form) dengan tombol mute global.
- **Loading yang bercerita**, bukan gate 1.5s: preload progress nyata, atau "boot sequence" bertema terminal.
- **Hover state proyek yang kaya** — video/GIF preview, atau reveal warna dominan proyek.
- **Micro-copy hidup** — 404 kustom, empty state yang lucu, easter egg di console.

### 7.5 Bersih-bersih yang menaikkan persepsi "handmade"
- Hapus semua komentar Lighthouse/"Opsi 3"/self-praise.
- Hapus dead code (tombol hero ke-2, `navItemConfig` duplikat).
- Satukan wordmark brand.
- Pindahkan warna hardcoded ke token (perbaiki light theme kalender).

### 7.6 Referensi belajar (pola pemenang)
- **awwwards.com** → filter "Portfolio" + "Developer" → pelajari *transisi antar-halaman* dan *art direction*, bukan efeknya per-satu.
- Studio yang jadi acuan interaksi: **Basement Studio**, **Locomotive**, **Active Theory**, **Cuberto** (kursor & motion).
- Untuk voice/copy: baca portofolio developer yang teksnya terasa manusiawi (mis. situs pribadi yang menulis seperti ngobrol).

---

## 8. Perbaikan Copywriting

**Ini upgrade dengan rasio dampak-per-menit TERTINGGI.** Tulis ulang semua teks dengan suaramu sendiri. Aturan: **pakai kontraksi, buang em-dash triad, buang buzzword, tulis seperti kamu ngomong.**

| Lokasi | Sekarang (terasa AI) | Arah perbaikan (contoh) |
|---|---|---|
| Hero desc | "Building thoughtful digital experiences through modern web engineering, backend systems, and artificial intelligence." | "I build web apps, backends, and small AI tools — and I run a clothing brand on the side." |
| Contact heading | "Let us build / something good." | "Let's build something." / "Got an idea? Let's talk." |
| Contact sub | "...Send a note and I will reply within a day or two." | "...Drop a note, I'll reply in a day or two." |
| Toast sukses | "Message sent. I will get back to you soon." | "Got it — I'll be in touch soon." |
| Projects lead | "A collection of real-world projects spanning web development, artificial intelligence, and digital business—each built with a focus on performance, scalability..." | "Stuff I've actually shipped — web, AI experiments, and my own store." |
| All Projects | "A comprehensive archive of software engineering projects across web development, backend microservices, AI applications, and digital products." | "Everything I've built, in one place." |
| Stack | "Technology Ecosystem" / "The tools behind every product I build." | "What I build with" / "Tools I reach for." |
| GitHub | "Building in public" + "now building" fiktif | Pakai data commit nyata, atau tulis 1 kalimat jujur soal apa yang lagi dikerjakan. |

**Prinsip voice:** Kamu punya cerita menarik yang jarang dimiliki developer lain — **founder brand (CLT.STORE) + developer + AI**. Angkat itu. Ceritakan seperti manusia. Itu otomatis membedakanmu dari 90% portofolio.

---

## 9. Roadmap Upgrade Bertahap

Diurut supaya kamu bisa mulai dari yang cepat & berdampak.

### Fase 1 — Quick wins (1-2 hari, dampak persepsi besar)
- [ ] **Tulis ulang semua copy** dengan suaramu (§8). Ini yang paling menghapus kesan "AI".
- [ ] **Satukan wordmark brand** (pilih "Uyab" atau "Bayu Praditya", pakai konsisten).
- [ ] **Ganti stats About** jadi data nyata; hapus count-up tahun (2023 jangan dianimasikan dari 0).
- [ ] **Hapus data fiktif** "now building" & pastikan fallback GitHub tak tampil ke publik.
- [ ] **Bersihkan artefak AI di source**: komentar Lighthouse, "Opsi 3", dead code tombol hero.
- [ ] **`text-justify` → rata kiri** di MagicText; izinkan select text.

### Fase 2 — Perbaikan fondasi (3-5 hari)
- [ ] **Focus trap di modal** + kembalikan fokus ke trigger.
- [ ] **Perbaiki aksesibilitas marquee** (aria-hidden + list tersembunyi yang aksesibel).
- [ ] **Kartu "All Projects"** → jadikan `<a>`/`<button>` yang keyboard-operable.
- [ ] **Pindahkan warna hardcoded ke token** → perbaiki light theme di kalender/game.
- [ ] **Perbaiki bug `useLenis()`** (pakai state, bukan mutasi ref) atau hapus jika tak dipakai.
- [ ] Beri `prefers-reduced-motion` guard untuk ScrollFloat, morphing text, dan game.

### Fase 3 — Naik kelas estetis (1-2 minggu)
- [ ] **Tetapkan art direction** (§7.1) dan audit ulang tiap section terhadap konsep itu.
- [ ] **Tetapkan 2-3 kurva easing berperan**, hentikan easeOutExpo universal.
- [ ] **Custom cursor** reaktif.
- [ ] **View Transitions** untuk navigasi ke /projects.
- [ ] **Redesign Journey** jadi sesuatu yang bermerek (bukan timeline garis-kiri).
- [ ] **Perkaya hover proyek** (preview media / reveal warna).

### Fase 4 — Signature & polish (ongoing)
- [ ] Angkat **game GitHub** jadi fitur yang ditemukan orang (hint/teaser).
- [ ] **Sound design** opsional dengan mute global.
- [ ] **Loading bercerita** (ganti gate 1.5s).
- [ ] Easter egg tambahan (console, 404, empty states).
- [ ] Uji Lighthouse + axe DevTools; target a11y 100 & performa tetap 90+.

---

## Penutup

Website ini **fondasinya kuat** — kamu jelas bisa ngoding hal yang sulit. Yang memisahkanmu dari portofolio pemenang bukan skill teknis, tapi **tiga hal yang lebih murah dikerjakan**: (1) tulis dengan suaramu sendiri, (2) pilih satu art direction dan komit, (3) bersihkan jejak proses. Kerjakan Fase 1 dulu — dalam 1-2 hari, kesan "generic AI" akan turun drastis tanpa menyentuh satu baris pun logika animasi.

Craft-nya sudah ada. Sekarang kasih **kepribadian**.
