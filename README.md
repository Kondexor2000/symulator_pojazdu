# Symulator przejazdu

Prosta aplikacja ReactJS z regulacją prędkości, animowanym postępem na trasie, czasem przejazdu, ETA i opóźnieniem względem planu.

## Uruchomienie

Wymagany jest Node.js i npm. W terminalu, w folderze projektu, uruchom:

```bash
npm install
npm run dev
```

Vite wyświetli lokalny adres aplikacji (zwykle `http://localhost:5173`).

## Zasady symulacji

- Długość trasy: 10 km.
- Czas planowy: 15 minut.
- Co sekundę odległość rośnie o `prędkość / 3600` km.
- ETA jest szacowane na podstawie aktualnej prędkości.
- Przy prędkości 0 ETA jest niewyznaczone; symulowany zegar nadal liczy czas, jeśli przejazd jest uruchomiony.
