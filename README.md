# Anielski Styl - React Native

✨ Aplikacja mobilna do zarządzania sprzedażą live boutique.

## 🎯 Funkcje

- ✅ Zarządzanie klientkami
- ✅ Dodawanie/edycja przedmiotów i cen
- ✅ Obsługa wysyłki
- ✅ Promocja 2+1 (co 3. najtańsza sztuka gratis)
- ✅ Raporty i podsumowania
- ✅ Eksport danych JSON (backup)
- ✅ Wydruk PDF
- ✅ Offline storage (AsyncStorage) - wszystkie dane na telefonie
- ✅ Autouzupełnianie imion klientek

## 📦 Instalacja i uruchomienie

### Wymagania
- Node.js 16+
- Expo CLI: `npm install -g expo-cli`
- Telefon Android z zainstalowaną aplikacją Expo Go

### Kroki

1. **Klonuj/pobierz projekt**
```bash
git clone https://github.com/sylwesterwpl1-art/Teeel.git
cd Teeel
```

2. **Przełącz na gałąź React Native**
```bash
git checkout react-native-conversion
```

3. **Zainstaluj zależności**
```bash
npm install
```

4. **Uruchom na telefonie (Expo Go)**
```bash
npm start
```

Następnie:
- Zainstaluj aplikację **Expo Go** na telefonie (z Google Play lub App Store)
- Skanuj kod QR wyświetlony w terminalu kamerą telefonu
- Aplikacja załaduje się na Twoim telefonie

## 🏗️ Build na Google Play

### 1. Przygotowanie
```bash
npm install -g eas-cli
eas login
```

### 2. Budowanie APK
```bash
eas build --platform android
```

### 3. Pobranie i instalacja APK
Po zakończeniu budowy, pobierz APK i zainstaluj na telefonie.

### 4. Publikacja na Google Play
- Stwórz konto w [Google Play Console](https://play.google.com/console) (~12 USD)
- Wygeneruj klucz wydawcy
- Prześlij APK do Play Store

## 📁 Struktura projektu

```
src/
├── screens/          # Ekrany aplikacji
│   ├── HomeScreen.tsx        (Dodawanie klientek)
│   ├── ClientsScreen.tsx     (Lista klientek)
│   ├── ReportsScreen.tsx     (Raporty i wydruk)
│   └── SettingsScreen.tsx    (Ustawienia)
├── components/       # Komponenty
│   └── ClientCard.tsx        (Karta klientki)
├── contexts/         # Zarządzanie stanem
│   ├── ClientsContext.tsx    (Klientki)
│   └── DataContext.tsx       (Dane globalne)
└── utils/            # Funkcje pomocnicze
    └── helpers.ts
```

## 💾 Przechowywanie danych

Wszystkie dane przechowywane są **lokalnie** w `AsyncStorage`:
- `as_clients` - lista klientek z ich zakupami
- `as_savedNames` - zapisane imiona klientek
- `started` - czas rozpoczęcia live

**Brak żadnych danych wysyłanych do chmury!**

## 🚀 Cechy

### Ekran główny (Home)
- Statystyki: liczba klientek, przychód
- Formularz dodawania nowej klientki
- Autouzupełnianie z historii
- Opcja promocji 2+1

### Klientki (Clients)
- Lista wszystkich klientek
- Edycja/usuwanie klientek
- Podgląd zakupionych przedmiotów

### Raporty (Reports)
- Podsumowanie sprzedaży
- Drukowanie (PDF)
- Export danych (JSON)

### Ustawienia (Settings)
- Informacje o aplikacji
- Backup danych
- Czyszczenie bazy danych

## 📱 Technologia

- **React Native** - kod mobilny
- **Expo** - framework dla React Native
- **React Navigation** - nawigacja
- **AsyncStorage** - baza danych offline
- **TypeScript** - typowanie

## 📝 Licencja

MIT

## 🆘 Pomoc

Jeśli masz pytania lub problemy:
1. Sprawdź dokumentację: https://docs.expo.dev
2. Sprawdź GitHub: https://github.com/sylwesterwpl1-art/Teeel
