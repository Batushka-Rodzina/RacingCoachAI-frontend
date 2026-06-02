# BOLIDE - Frontend

Aplikacja webowa **BOLIDE** (React 19, TypeScript, Vite): logowanie, dashboard, wizualizacja telemetrii, AI Coach, community.

> Repozytorium techniczne: `RacingCoachAI-frontend` produkt: **BOLIDE**

---

## Dokumentacja projektu

| | Link |
| :--- | :--- |
| **GitBook** | *https://andrew93.gitbook.io/bolide* |
| **Pełna dokumentacja Offline** | [RacingCoachAI-backend/documentation/documentation.md](https://github.com/Batushka-Rodzina/RacingCoachAI-backend/blob/main/documentation/documentation.md) |

Architektura frontendu, wymagania i diagramy - w dokumentacji głównej (repozytorium backend).

---

## Repozytoria systemu

| Moduł | Repozytorium |
| :---- | :----------- |
| Frontend *(ten)* | [RacingCoachAI-frontend](https://github.com/Batushka-Rodzina/RacingCoachAI-frontend) |
| Backend | [RacingCoachAI-backend](https://github.com/Batushka-Rodzina/RacingCoachAI-backend) |
| Desktop Agent | [Desktop-App](https://github.com/Batushka-Rodzina/Desktop-App) |
| AI / ML | [RacingCoachAI-agent_AI](https://github.com/Batushka-Rodzina/RacingCoachAI-agent_AI) |

---

## Wymagania

- Node.js 20+
- Działający backend BOLIDE ([instrukcja](https://github.com/Batushka-Rodzina/RacingCoachAI-backend#uruchomienie-lokalne))

---

## Uruchomienie lokalne

```bash
cd app
npm install
npm run dev
```

Domyślnie: [http://localhost:5173](http://localhost:5173)

Backend API (domyślnie): `http://127.0.0.1:8000` - konfiguracja przez `VITE_API_URL` w `.env`.

### Build produkcyjny

```bash
cd app
npm run build
npm run preview
```

---

## Struktura

```text
app/
  src/
    pages/        # telemetry, coach, auth, community
    store/        # Zustand (auth)
    utils/        # apiFetch
  public/
```

Kod aplikacji znajduje się w katalogu **`app/`**.
