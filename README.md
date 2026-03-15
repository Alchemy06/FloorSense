# 🥭🥭🥭🥭 THE MANGO TEAM 🥭🥭🥭🥭

       The Tactical Real Estate Engine
**A Gamified Approach to Property Safety | Built by The Mangos**

[![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20TypeScript-blue)](#)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green)](#)
[![AI & Audio](https://img.shields.io/badge/AI-Claude%20%7C%20ElevenLabs-purple)](#)
[![Infrastructure](https://img.shields.io/badge/Deploy-Docker%20%7C%20Vultr-orange)](#)

## The Pitch: Why We Built This
FloorSense application looks at floor plans the way a security expert would, borrowing the same spatial thinking used in tactical games like Rainbow Six Siege and CS:GO to assess real architectural vulnerabilities. How many entry points? Blind corners? Sightlines from the street?
Paste a Rightmove link, and our model analyse the floor plan automatically, scoring the property with a Defense Grade. You also get an audio briefing, voiced by ElevenLabs that walks you through exactly what makes the layout strong or exposed.

## Key Features
* **Link-to-Intel Pipeline:** Drop a Rightmove URL, and we handle the scraping, image processing, and AI analysis automatically.
* **Gamified Safety Metrics:** We calculate Choke Points, Flank Vulnerabilities, Sightline Dominance, and Defensible Positions.
* **Tactical Audio Briefings:** ElevenLabs reads out your customized property threat assessment in real-time.
* **Interactive Dashboard:** A sleek, responsive React + TypeScript frontend to visualize your stats and floor plans.

---

## The Tech Stack
* **Frontend:** React, TypeScript (Fast, type-safe web UI).
* **Backend:** Node.js, Express (API routing and Playwright data scraping).
* **AI Brain:** Anthropic Claude (Vision analysis of floor plan layouts).
* **Voice Engine:** ElevenLabs API (Text-to-speech mission briefings).
* **Database:** MongoDB Atlas (Storing property dossiers and tactical stats).
* **Infrastructure:** Vultr & Docker (Containerized for seamless, scalable deployment).

---

## Getting Started (Local Development)

Here is the step-by-step setup for our Node.js and React environments.

### 1. Database & Environment Setup
First, you'll need a MongoDB cluster. Create a `.env` file in both your `backend` and `frontend` directories.

**Backend `.env`:**
```text
PORT=80

MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/floorsense

ANTHROPIC_API_KEY=your_claude_key

ELEVENLABS_API_KEY=your_elevenlabs_key
```

**Team Members:**
Adarash Ram Sivakumar,

Adit Sharma,
 
Sai Raghav Commandur,

Ervin 
