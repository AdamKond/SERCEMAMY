# Handoff: Strona główna — Stowarzyszenie „Serce Mamy"

## Overview
Jednostronicowa, animowana strona (landing) stowarzyszenia wspierającego kobiety w ciąży, mamy po porodzie, wcześniaki, noworodki i ich rodziny. Strona prowadzi użytkownika przez: hero z animowanym tłem → poziomo przewijany blok „Tam, gdzie medycyna spotyka się z troską" → misja → „Kogo wspieramy" (dwie karty) → moment „Realne Wsparcie" → kinetyczny nagłówek finałowy.

## About the Design Files
Pliki w tym pakiecie to **referencje projektowe stworzone w HTML** — prototyp pokazujący docelowy wygląd i zachowanie, a **nie** kod produkcyjny do skopiowania 1:1. Zadaniem jest **odtworzenie tego projektu w docelowym środowisku** (np. React/Next.js + Tailwind, Vue itd.) zgodnie z konwencjami tego projektu. Jeśli projekt dopiero powstaje — wybierz najlepszy framework (rekomendacja: React/Next.js + Tailwind, bo to pasuje do wymienionych przez użytkownika zależności shadcn/Tailwind/TS) i tam odwzoruj design.

> Plik `Aventura Hero.dc.html` to format „Design Component" — wymaga `support.js` w tym samym katalogu, żeby otworzyć się w przeglądarce. To tylko podgląd referencyjny. Cała logika animacji jest zwykłym, czytelnym JavaScriptem na końcu pliku (w bloku `<script type="text/x-dc">`), więc można ją wprost przenieść do hooków React (`useEffect`).

## Fidelity
**High-fidelity (hifi)** — finalne kolory, typografia, odstępy i interakcje. Odtwórz UI pixel-perfect, korzystając z bibliotek i wzorców docelowego repo. Materiały graficzne (`media/*.jpg`) to placeholdery — podmień na realne zdjęcia.

## Tech / biblioteki
- Czcionki Google: **Instrument Serif** (nagłówki, też italic) + **Inter Tight** (300/400/500/600 — UI, akapity).
- Brak zależności runtime poza czcionkami. Animacje to czysty CSS (`@keyframes`) + Vanilla JS (scroll, lerp, IntersectionObserver-podobne sprawdzanie pozycji).
- Użytkownik wspomniał o komponencie z `@paper-design/shaders-react` (MeshGradient). W tym projekcie animowane tło hero zostało odtworzone **bez** tej zależności — czterema rozmytymi, dryfującymi „blobami" radialnymi w palecie marki. Jeśli chcesz, możesz w docelowym repo użyć prawdziwego MeshGradienta, ale paleta powinna pozostać ciepła (złoto/brzoskwinia), nie fioletowa.

## Design Tokens

### Kolory
| Token | Hex | Użycie |
|---|---|---|
| Tło jasne (kremowe) | `#eae8e8` | główne tło strony, hero, sekcje jasne |
| Tekst ciemny | `#14151d` | nagłówki/CTA na jasnym tle, tło sekcji ciemnych |
| Tekst ciemny (body) | `#424346` | kinetyczny nagłówek, tekst pomocniczy |
| Szary tekst | `#6f6968` | akapity, podpisy |
| Szary jasny | `#9a9492` / `#8a8b93` | etykiety, mikrokopy |
| Akcent złoty | `#b38c61` | kicker, akcent słowa „wcześniaki", selection |
| Off-white (na ciemnym) | `#f4f1ee` / `#eae8e8` | tekst na ciemnym tle |
| Szary panel | `#b8b6b4` | tło panelu „Your smile" |
| Brzoskwinia (blob) | `rgba(214,180,168,…)` | animowane tło hero |
| Błękit (blob) | `rgba(168,176,190,…)` | animowane tło hero |

### Typografia
- Nagłówki: `'Instrument Serif', serif`, weight 400, część w italic. Hero h1: `clamp(54px, 9vw, 168px)`, line-height ~0.9, letter-spacing -0.018em.
- Body: `'Inter Tight', sans-serif`. Akapity `clamp(14px,1.05vw,19px)`, line-height 1.5–1.6.
- Etykiety/kickery: Inter Tight, 11–13px, `letter-spacing: 0.18–0.24em; text-transform: uppercase`.

### Promienie / cienie
- Przyciski/pigułki: `border-radius: 999px`.
- Karty/obrazy: `border-radius: 2px`, cień `0 30px 70px rgba(20,21,29,0.18)`.

### Easing / czasy
- Główny easing wejść: `cubic-bezier(.22,1,.36,1)` (~1–1.2s).
- Clip/reveal: `cubic-bezier(.76,0,.24,1)` (~1.2–1.3s).
- Mesh blobs: `ease-in-out`, 22–30s, `infinite`.

## Screens / Views (kolejność na stronie)

### 1. Preloader
- Pełnoekranowy, ciemny radialny gradient (`#1b1c25` → `#0e0f15`). Wirujący łuk (`#b38c61`) + licznik `0%→100%` (Inter Tight, 13px, letter-spacing 0.2em). Znika po ~auto/3.4s fallback (fade+visibility). **Logo zostało usunięte** — zostaje tylko spinner i licznik.

### 2. Hero (poziomo przypięty, panel 1)
- Pełny ekran, tło `#eae8e8`.
- **Animowane tło mesh**: 4 rozmyte koła (`filter: blur(20px)`) w kolorach złoto/brzoskwinia/błękit/ciemny, każde z własną animacją `adaMesh1..4` (translate+scale, 22–30s). Na wierzchu woal `linear-gradient` (rgba(234,232,232,0.30→0.55)) dla czytelności.
- **Treść wyśrodkowana**:
  - Kicker (złoty, uppercase, z dwiema kreskami po bokach): „Stowarzyszenie Serce Mamy". Animacja fade-up, delay 1.7s.
  - H1 (Instrument Serif): linia 1 „Wspieramy", linia 2 „mamy i *wcześniaki*" (słowo „wcześniaki" italic + kolor `#b38c61`). Wejście maską od dołu (`adaMaskUp`), delaye 1.9s / 2.02s.
  - Akapit: „Od pierwszych chwil życia wspieramy kobiety w ciąży, mamy po porodzie, wcześniaki i noworodki oraz ich rodziny." (max 40ch, fade-up 2.55s).
  - Stopka wyśrodkowana (dół): etykieta „Działamy przy" + „Klinice Położnictwa · Patologii Ciąży · Neonatologii".

### 3. „Your smile" (poziomo przypięty, panel 2)
- Szeroki panel (`width: 190vw`), tło `#b8b6b4`. Przewijany poziomo (patrz Interactions).
- Po prawej panel medialny (86% szer., `border-radius` brak, clip-reveal od góry) z gradientem (placeholder po wideo) + podpis „Łączymy medycynę z empatią".
- Wielki nagłówek nowrap (Instrument Serif, `clamp(64px, 8.6vw, 150px)`, biały `#f4f1ee`): „Tam, gdzie medycyna spotyka się z troską". **Ważne:** musi być w całości widoczny przy przewijaniu — rozmiar dobrany tak, by mieścił się w panelu 190vw. Pozycja `left: 7vw`, wycentrowany pionowo.

### 4. Misja („Our goal", pionowa)
- Tło `#eae8e8` z delikatnym statycznym gradientem (placeholder po wideo, opacity wash).
- Grupa awatarów (3 nakładające się kółka „img" placeholder + kółko **„+7"**) i etykieta „Stworzone przez lekarzy". *(Liczba to +7, nie +20.)*
- H2 (Instrument Serif, `clamp(40px,5.2vw,96px)`): „Naszą misją jest poprawa jakości i komfortu opieki okołoporodowej nad mamą, dzieckiem i ich *rodziną*." (słowo „rodziną" italic).
- Akapit + CTA „O nas" (czarna pigułka `#14151d`, tekst `#eae8e8`, strzałka ↗, hover: `#000` + translateY(-2px)).
- **Portret** (`media/portrait.jpg`, 3:4, cień) wsuwa się z prawej i robi parallax w dół przy scrollu (trzymany w prawej kolumnie, nie zasłania nagłówka).

### 5. „Kogo wspieramy" (intro)
- Pełna szerokość, tło ciemne `#14151d`, wyśrodkowany ogromny nagłówek `clamp(56px,11vw,200px)` (`#f4f1ee`): „Kogo wspieramy".

### 6. Karta — „Kobiety w ciąży"
- Pełny ekran, obraz `media/service-1.jpg` (grayscale+contrast), clip-reveal, ciemny gradient na dole.
- H3 (Instrument Serif): „*Kobiety* w ciąży" (1. słowo italic). Akapit: „Pacjentki hospitalizowane na oddziale patologii ciąży, kobiety w ciąży powikłanej oraz mamy po porodzie i w okresie połogu." CTA „Więcej" (jasna pigułka `#eae8e8`).

### 7. Karta — „Wcześniaki i rodziny"
- Jak wyżej, obraz `media/service-2.jpg`. H3: „*Wcześniaki* i rodziny". Akapit: „Wcześniaki i noworodki wymagające specjalistycznej opieki oraz rodzice dzieci długo hospitalizowanych w oddziale neonatologii."

### 8. „Realne Wsparcie" (moment pełnoekranowy)
- Pełny ekran, ciemne radialne tło `#14151d` (+ subtelny złoty radial). Placeholder po wideo.
- Wielki nagłówek `data-techtitle` (Instrument Serif, `clamp(64px,11vw,200px)`, `#f4f1ee`): „Realne Wsparcie". **Animacja kluczowa:** przy scrollu nagłówek **zjeżdża z góry na dół** swojej sekcji, przepływa do sekcji niżej i **ląduje** dokładnie na kinetycznym napisie „Realne Wsparcie" (zmienia kolor na ciemny `#424346` i lekko się zmniejsza — scale do 0.78). Patrz `techScroll()` w JS.
- Dolny pasek: „Bezpieczeństwo" / „Opieka okołoporodowa: Empatia" / „Nadzieja".

### 9. Kinetyczny nagłówek finałowy
- Tło `#eae8e8`. Cztery rozrzucone w przestrzeni napisy (`Instrument Serif`, `clamp(52px,9vw,150px)`, `#424346`): „Realne Wsparcie" / „dla Mamy" / „*i* Dziecka" / „od pierwszych chwil". Wjeżdżają od dołu (`adaKineticUp`) gdy sekcja wchodzi w widok. Pierwszy napis („Realne Wsparcie") jest **niewidocznym kotwiczeniem** dla lądującego nagłówka z sekcji 8 (nie animuje się sam).

## Interactions & Behavior
- **Poziome przypięcie (pin scroll):** Sekcje 2–3 są wewnątrz `[data-pin-wrap]`/`[data-sticky]`. Wysokość wrappera = `100vh + maxX`, gdzie `maxX = track.scrollWidth - innerWidth`. Pionowy scroll przekłada się na poziomy `translateX` ścieżki `[data-track]`, wygładzany przez `lerp(current, target, 0.1)` w `requestAnimationFrame`.
- **Reveals:** elementy `[data-anim]` (fade+translateY), `[data-anim-x]` (translateX), `[data-clip]` (clip-path inset reveal) dostają klasę `.in` gdy wejdą w widok (w track liczone poziomo, poza track pionowo).
- **Mesh tło hero:** czysto CSS, ciągłe.
- **Portret parallax:** wsuwa się gdy sekcja blisko, przesuwa w dół proporcjonalnie do scrolla.
- **Descend-and-land nagłówka „Realne Wsparcie":** patrz `techScroll()` — interpolacja pozycji od `secTop` do pozycji docelowego kinetycznego napisu, z dryfem w poziomie (dx) i skalą; zmiana koloru po przekroczeniu granicy sekcji.
- **Scroll hint:** pigułka „Przewiń" prawy-dół, znika po scrollu > 40px.
- Pozycja scrolla zapisywana do `localStorage('ada_scroll')` (do odtworzenia po reloadzie — opcjonalne w docelowym repo).

## State Management (do odwzorowania w React)
- `scrollY` → `target` (poziomy offset) z `lerp` do `current` w rAF.
- `maxX` przeliczane na resize/load/fonts-ready (`ResizeObserver` na track).
- Stany „in" dla reveali (można zrobić `IntersectionObserver`).
- Postęp animacji „descend-and-land" liczony z `scrollY`.
- Preloader: licznik % + dismiss.

## Assets (placeholdery — podmień na realne)
- `media/portrait.jpg` — zdjęcie zespołu/lekarzy (3:4).
- `media/service-1.jpg` — kobieta w ciąży / oddział.
- `media/service-2.jpg` — wcześniak / neonatologia.
- (pozostałe `media/tech-*.jpg`, `solution.jpg` — z usuniętej sekcji; można pominąć.)
- **Wideo:** brak — wszystkie miejsca po wideo zastąpione gradientami. Jeśli pojawią się filmy, można je tam wstawić.

## Files
- `Aventura Hero.dc.html` — kompletny prototyp (markup + style inline + cała logika JS na końcu). To główne źródło prawdy.
- `support.js` — runtime potrzebny tylko do otwarcia prototypu w przeglądarce (nie przenoś do produkcji).
- `media/` — placeholdery graficzne.

## Uwagi końcowe
- Nazwa pliku „Aventura Hero" jest historyczna (projekt startował od innego szablonu) — treść jest w 100% dla „Serce Mamy".
- Strona była projektowana jako desktopowe doświadczenie z poziomym scrollem; responsywność mobilną trzeba dopracować w docelowym repo (np. zamienić poziomy pin na pionowy układ na wąskich ekranach).
