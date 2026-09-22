# Karta Serce Mamy w Apple Wallet — jak dokończyć (jednorazowo, ok. 5 minut)

Wszystko poza certyfikatem Apple jest gotowe: `pass.json` (treść karty), `assets/` (grafiki),
`build-pass.mjs` (podpisywanie i pakowanie), klucz i wniosek CSR w `certs/`.

## 1. Zarejestruj Pass Type ID
1. Wejdź na https://developer.apple.com/account/resources/identifiers/list/passTypeId
2. Kliknij **+** → wybierz **Pass Type IDs** → Continue.
3. Description: `Serce Mamy wizytówka`, Identifier: `pass.com.serce-mamy.wizytowka` → Continue → Register.

## 2. Wygeneruj certyfikat dla tego Pass Type ID
1. Na liście kliknij `pass.com.serce-mamy.wizytowka` → **Create Certificate**.
2. Wgraj plik **`wallet/certs/pass.csr`** (jest już wygenerowany na tym komputerze) → Continue.
3. Pobierz certyfikat (plik `pass.cer`) i zapisz go jako **`wallet/certs/pass.cer`**.

## 3. Zbuduj kartę
W terminalu, w katalogu strony (`serce-mamy`):
```
node wallet/build-pass.mjs
```
Skrypt sam odczyta Team ID z certyfikatu i utworzy `serce-mamy.pkpass`. Potem wdrożenie strony
jak zwykle (git push albo `npx vercel --prod`). Przycisk „Dodaj do Apple Wallet” na
serce-mamy.com/wizytowka zacznie działać.

## Zmiana treści karty (np. prawdziwy numer telefonu)
Edytuj `wallet/pass.json` → `node wallet/build-pass.mjs` → wdrożenie. Karty już dodane do Wallet
nie zaktualizują się same (to wymagałoby serwera aktualizacji); użytkownik dodaje kartę ponownie.

## Uwagi
- Certyfikat Pass Type ID jest ważny rok. Po wygaśnięciu: nowy CSR → nowy certyfikat → build.
- Pliki w `certs/` są w `.gitignore` i nie trafiają do repozytorium.
- Google Wallet: wymaga konta Google Wallet API (Issuer ID) — osobny etap.
