require("dotenv").config();

const mongoose = require("mongoose");

const WeatherService = require("../src/services/weather.service");
const Circuit = require("../src/models/circuit.model");
const Race = require("../src/models/race.model");
const Driver = require("../src/models/driver.model");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in .env");
  process.exit(1);
}

/**
 * Connect to MongoDB
 */
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log("=================================");
    console.log("MongoDB connected");
    console.log("=================================");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

/**
 * =========================================================
 * CIRCUITS
 * =========================================================
 */
const seedCircuits = async () => {
  console.log("Seeding circuits...");

  const circuits = [
    {
      name: "Albert Park Circuit",
      location: {
        city: "Melbourne",
        country: "Australia",
      },
      length: 5.278,
      laps: 58,
      characteristics: [
        "semi-street",
        "smooth-asphalt",
        "fast-flowing",
        "medium-downforce",
      ],
      activeAeroZones: 5,
      safetyCarFrequency: "high",
      typicalWeather: {
        temperature: 22,
        humidity: 60,
        windSpeed: 15,
        condition: "mild",
        rainProbability: 30,
      },
      lapRecord: {
        time: "1:19.813",
        driver: "Charles Leclerc",
        year: 2022,
      },
    },

    {
      name: "Shanghai International Circuit",
      location: {
        city: "Shanghai",
        country: "China",
      },
      length: 5.451,
      laps: 56,
      characteristics: [
        "high-tyre-degradation",
        "long-straight",
        "heavy-braking",
      ],
      activeAeroZones: 3,
      safetyCarFrequency: "medium",
      typicalWeather: {
        temperature: 16,
        humidity: 70,
        windSpeed: 10,
        condition: "cool",
        rainProbability: 40,
      },
      lapRecord: {
        time: "1:32.238",
        driver: "Michael Schumacher",
        year: 2004,
      },
    },

    {
      name: "Suzuka International Racing Course",
      location: {
        city: "Suzuka",
        country: "Japan",
      },
      length: 5.807,
      laps: 53,
      characteristics: [
        "figure-eight",
        "high-speed-sweepers",
        "technical",
        "high-downforce",
      ],
      activeAeroZones: 2,
      safetyCarFrequency: "medium",
      typicalWeather: {
        temperature: 18,
        humidity: 65,
        windSpeed: 14,
        condition: "mild",
        rainProbability: 35,
      },
      lapRecord: {
        time: "1:30.983",
        driver: "Lewis Hamilton",
        year: 2019,
      },
    },

    {
      name: "Bahrain International Circuit",
      location: {
        city: "Sakhir",
        country: "Bahrain",
      },
      length: 5.412,
      laps: 57,
      characteristics: [
        "abrasive-asphalt",
        "traction-limited",
        "night-race",
        "hot",
      ],
      activeAeroZones: 4,
      safetyCarFrequency: "low",
      typicalWeather: {
        temperature: 29,
        humidity: 40,
        windSpeed: 18,
        condition: "dry-and-windy",
        rainProbability: 5,
      },
      lapRecord: {
        time: "1:31.447",
        driver: "Pedro de la Rosa",
        year: 2005,
      },
    },

    {
      name: "Jeddah Corniche Circuit",
      location: {
        city: "Jeddah",
        country: "Saudi Arabia",
      },
      length: 6.174,
      laps: 50,
      characteristics: [
        "fastest-street-track",
        "blind-corners",
        "high-speed",
        "night-race",
      ],
      activeAeroZones: 4,
      safetyCarFrequency: "very-high",
      typicalWeather: {
        temperature: 28,
        humidity: 55,
        windSpeed: 11,
        condition: "warm",
        rainProbability: 0,
      },
      lapRecord: {
        time: "1:30.734",
        driver: "Lewis Hamilton",
        year: 2021,
      },
    },

    {
      name: "Miami International Autodrome",
      location: {
        city: "Miami Gardens",
        country: "USA",
      },
      length: 5.412,
      laps: 57,
      characteristics: ["temporary-circuit", "tight-chicane", "hot", "humid"],
      activeAeroZones: 4,
      safetyCarFrequency: "medium",
      typicalWeather: {
        temperature: 31,
        humidity: 75,
        windSpeed: 13,
        condition: "hot-and-humid",
        rainProbability: 30,
      },
      lapRecord: {
        time: "1:29.708",
        driver: "Max Verstappen",
        year: 2023,
      },
    },

    {
      name: "Circuit Gilles Villeneuve",
      location: {
        city: "Montreal",
        country: "Canada",
      },
      length: 4.361,
      laps: 70,
      characteristics: [
        "stop-and-go",
        "heavy-braking",
        "harsh-kerbs",
        "wall-of-champions",
      ],
      activeAeroZones: 4,
      safetyCarFrequency: "high",
      typicalWeather: {
        temperature: 21,
        humidity: 50,
        windSpeed: 12,
        condition: "changeable",
        rainProbability: 40,
      },
      lapRecord: {
        time: "1:13.078",
        driver: "Valtteri Bottas",
        year: 2019,
      },
    },

    {
      name: "Circuit de Monaco",
      location: {
        city: "Monte Carlo",
        country: "Monaco",
      },
      length: 3.337,
      laps: 78,
      characteristics: [
        "narrow-street-track",
        "slowest-circuit",
        "zero-margin-for-error",
        "low-grip",
      ],
      activeAeroZones: 1,
      safetyCarFrequency: "very-high",
      typicalWeather: {
        temperature: 23,
        humidity: 65,
        windSpeed: 8,
        condition: "sunny",
        rainProbability: 15,
      },
      lapRecord: {
        time: "1:12.909",
        driver: "Lewis Hamilton",
        year: 2021,
      },
    },

    {
      name: "Circuit de Barcelona-Catalunya",
      location: {
        city: "Montmeló",
        country: "Spain",
      },
      length: 4.657,
      laps: 66,
      characteristics: [
        "aerodynamic-benchmark",
        "long-right-handers",
        "high-tyre-wear",
      ],
      activeAeroZones: 3,
      safetyCarFrequency: "medium",
      typicalWeather: {
        temperature: 26,
        humidity: 55,
        windSpeed: 10,
        condition: "warm",
        rainProbability: 20,
      },
      lapRecord: {
        time: "1:15.743",
        driver: "Oscar Piastri",
        year: 2025,
      },
    },

    {
      name: "Red Bull Ring",
      location: {
        city: "Spielberg",
        country: "Austria",
      },
      length: 4.318,
      laps: 71,
      characteristics: [
        "short-lap-time",
        "elevation-changes",
        "heavy-braking",
        "high-altitude",
      ],
      activeAeroZones: 3,
      safetyCarFrequency: "medium",
      typicalWeather: {
        temperature: 24,
        humidity: 50,
        windSpeed: 9,
        condition: "mild",
        rainProbability: 35,
      },
      lapRecord: {
        time: "1:05.619",
        driver: "Carlos Sainz",
        year: 2020,
      },
    },

    {
      name: "Silverstone Circuit",
      location: {
        city: "Silverstone",
        country: "United Kingdom",
      },
      length: 5.891,
      laps: 52,
      characteristics: [
        "ultra-high-speed",
        "historic",
        "high-lateral-g-forces",
      ],
      activeAeroZones: 3,
      safetyCarFrequency: "high",
      typicalWeather: {
        temperature: 20,
        humidity: 60,
        windSpeed: 16,
        condition: "windy-and-unpredictable",
        rainProbability: 45,
      },
      lapRecord: {
        time: "1:27.097",
        driver: "Max Verstappen",
        year: 2020,
      },
    },

    {
      name: "Circuit de Spa-Francorchamps",
      location: {
        city: "Stavelot",
        country: "Belgium",
      },
      length: 7.004,
      laps: 44,
      characteristics: [
        "longest-track",
        "extreme-elevation-changes",
        "micro-climate",
        "high-speed",
      ],
      activeAeroZones: 5,
      safetyCarFrequency: "high",
      typicalWeather: {
        temperature: 18,
        humidity: 75,
        windSpeed: 11,
        condition: "highly-unstable-rain",
        rainProbability: 55,
      },
      lapRecord: {
        time: "1:46.286",
        driver: "Valtteri Bottas",
        year: 2018,
      },
    },

    {
      name: "Hungaroring",
      location: {
        city: "Mogyoród",
        country: "Hungary",
      },
      length: 4.381,
      laps: 70,
      characteristics: [
        "tight-and-twisty",
        "monaco-without-walls",
        "low-average-speed",
        "hot",
      ],
      activeAeroZones: 2,
      safetyCarFrequency: "low",
      typicalWeather: {
        temperature: 32,
        humidity: 40,
        windSpeed: 7,
        condition: "scorching",
        rainProbability: 15,
      },
      lapRecord: {
        time: "1:16.627",
        driver: "Lewis Hamilton",
        year: 2020,
      },
    },

    {
      name: "Circuit Zandvoort",
      location: {
        city: "Zandvoort",
        country: "Netherlands",
      },
      length: 4.259,
      laps: 72,
      characteristics: [
        "banked-corners",
        "narrow-old-school",
        "coastal-sand-on-track",
      ],
      activeAeroZones: 2,
      safetyCarFrequency: "high",
      typicalWeather: {
        temperature: 19,
        humidity: 70,
        windSpeed: 22,
        condition: "gusty-coastal",
        rainProbability: 40,
      },
      lapRecord: {
        time: "1:11.097",
        driver: "Lewis Hamilton",
        year: 2021,
      },
    },

    {
      name: "Autodromo Nazionale Monza",
      location: {
        city: "Monza",
        country: "Italy",
      },
      length: 5.793,
      laps: 53,
      characteristics: [
        "temple-of-speed",
        "lowest-downforce",
        "long-straights",
        "slipstream-heavy",
      ],
      activeAeroZones: 4,
      safetyCarFrequency: "medium",
      typicalWeather: {
        temperature: 28,
        humidity: 50,
        windSpeed: 8,
        condition: "warm-and-clear",
        rainProbability: 20,
      },
      lapRecord: {
        time: "1:21.046",
        driver: "Rubens Barrichello",
        year: 2004,
      },
    },

    {
      name: "Madrid Circuit (IFEMA)",
      location: {
        city: "Madrid",
        country: "Spain",
      },
      length: 5.474,
      laps: 55,
      characteristics: [
        "brand-new-circuit",
        "hybrid-street-permanent",
        "tunnels",
        "technical-sections",
      ],
      activeAeroZones: 4,
      safetyCarFrequency: "high",
      typicalWeather: {
        temperature: 25,
        humidity: 45,
        windSpeed: 11,
        condition: "pleasant",
        rainProbability: 15,
      },
      lapRecord: {
        time: "TBD",
        driver: "New Circuit",
        year: 2026,
      },
    },

    {
      name: "Baku City Circuit",
      location: {
        city: "Baku",
        country: "Azerbaijan",
      },
      length: 6.003,
      laps: 51,
      characteristics: [
        "ultra-long-main-straight",
        "extremely-narrow-castle-section",
        "90-degree-turns",
      ],
      activeAeroZones: 3,
      safetyCarFrequency: "very-high",
      typicalWeather: {
        temperature: 23,
        humidity: 60,
        windSpeed: 19,
        condition: "gusty-winds",
        rainProbability: 10,
      },
      lapRecord: {
        time: "1:43.009",
        driver: "Charles Leclerc",
        year: 2019,
      },
    },

    {
      name: "Marina Bay Street Circuit",
      location: {
        city: "Singapore",
        country: "Singapore",
      },
      length: 4.94,
      laps: 62,
      characteristics: [
        "physically-demanding",
        "extremely-humid",
        "bumpy-street-surface",
        "night-race",
      ],
      activeAeroZones: 4,
      safetyCarFrequency: "very-high",
      typicalWeather: {
        temperature: 30,
        humidity: 80,
        windSpeed: 6,
        condition: "stifling-humidity",
        rainProbability: 40,
      },
      lapRecord: {
        time: "1:35.867",
        driver: "Lewis Hamilton",
        year: 2023,
      },
    },

    {
      name: "Circuit of the Americas",
      location: {
        city: "Austin",
        country: "USA",
      },
      length: 5.513,
      laps: 56,
      characteristics: [
        "massive-elevation-at-turn-1",
        "bumpy-subsoil",
        "counter-clockwise",
        "flowing-sector-1",
      ],
      activeAeroZones: 3,
      safetyCarFrequency: "medium",
      typicalWeather: {
        temperature: 24,
        humidity: 55,
        windSpeed: 12,
        condition: "mild",
        rainProbability: 20,
      },
      lapRecord: {
        time: "1:36.169",
        driver: "Charles Leclerc",
        year: 2019,
      },
    },

    {
      name: "Autódromo Hermanos Rodríguez",
      location: {
        city: "Mexico City",
        country: "Mexico",
      },
      length: 4.304,
      laps: 71,
      characteristics: [
        "high-altitude",
        "thin-air",
        "cooling-limited",
        "low-mechanical-grip",
      ],
      activeAeroZones: 3,
      safetyCarFrequency: "medium",
      typicalWeather: {
        temperature: 23,
        humidity: 45,
        windSpeed: 9,
        condition: "thin-air-sunny",
        rainProbability: 25,
      },
      lapRecord: {
        time: "1:17.774",
        driver: "Valtteri Bottas",
        year: 2021,
      },
    },

    {
      name: "Autódromo José Carlos Pace (Interlagos)",
      location: {
        city: "São Paulo",
        country: "Brazil",
      },
      length: 4.309,
      laps: 71,
      characteristics: [
        "counter-clockwise",
        "undulating",
        "short-lap",
        "historic",
      ],
      activeAeroZones: 2,
      safetyCarFrequency: "high",
      typicalWeather: {
        temperature: 25,
        humidity: 65,
        windSpeed: 13,
        condition: "highly-unpredictable-storms",
        rainProbability: 50,
      },
      lapRecord: {
        time: "1:10.540",
        driver: "Valtteri Bottas",
        year: 2018,
      },
    },

    {
      name: "Las Vegas Strip Circuit",
      location: {
        city: "Las Vegas",
        country: "USA",
      },
      length: 6.201,
      laps: 50,
      characteristics: [
        "massive-strip-straight",
        "extremely-cold-tyre-temperatures",
        "night-race",
        "low-grip",
      ],
      activeAeroZones: 3,
      safetyCarFrequency: "high",
      typicalWeather: {
        temperature: 12,
        humidity: 35,
        windSpeed: 10,
        condition: "cold-desert-night",
        rainProbability: 5,
      },
      lapRecord: {
        time: "1:33.365",
        driver: "Max Verstappen",
        year: 2025,
      },
    },

    {
      name: "Lusail International Circuit",
      location: {
        city: "Lusail",
        country: "Qatar",
      },
      length: 5.419,
      laps: 57,
      characteristics: [
        "relentless-high-speed-corners",
        "physically-punishing",
        "g-force-heavy",
        "night-race",
      ],
      activeAeroZones: 2,
      safetyCarFrequency: "medium",
      typicalWeather: {
        temperature: 27,
        humidity: 60,
        windSpeed: 16,
        condition: "warm-and-humid",
        rainProbability: 0,
      },
      lapRecord: {
        time: "1:22.384",
        driver: "Lando Norris",
        year: 2024,
      },
    },

    {
      name: "Yas Marina Circuit",
      location: {
        city: "Abu Dhabi",
        country: "UAE",
      },
      length: 5.281,
      laps: 58,
      characteristics: [
        "sunset-to-night-race",
        "hotel-underpass",
        "technical-final-sector",
      ],
      activeAeroZones: 3,
      safetyCarFrequency: "low",
      typicalWeather: {
        temperature: 26,
        humidity: 55,
        windSpeed: 8,
        condition: "clear-night",
        rainProbability: 0,
      },
      lapRecord: {
        time: "1:26.103",
        driver: "Max Verstappen",
        year: 2021,
      },
    },
  ];

  // IMPORTANT:
  // Only the seed script deletes existing circuit data.
  await Circuit.deleteMany({});

  const createdCircuits = await Circuit.insertMany(circuits);

  console.log(`✅ ${createdCircuits.length} circuits seeded`);

  return createdCircuits;
};

/**
 * =========================================================
 * DRIVERS
 * =========================================================
 */
const seedDrivers = async () => {
  console.log("Seeding drivers...");

  const drivers = [
    {
      name: "Lando Norris",
      shortName: "NOR",
      number: 1,
      nationality: "British",
      team: "McLaren",
      rating: 1.08,
      attributes: {
        racecraft: 91,
        qualifying: 94,
        tireManagement: 88,
        wetWeather: 89,
        consistency: 91,
      },
      status: "active",
      active: true,
    },

    {
      name: "Oscar Piastri",
      shortName: "PIA",
      number: 81,
      nationality: "Australian",
      team: "McLaren",
      rating: 1.06,
      attributes: {
        racecraft: 89,
        qualifying: 92,
        tireManagement: 91,
        wetWeather: 86,
        consistency: 92,
      },
      status: "active",
      active: true,
    },

    {
      name: "Max Verstappen",
      shortName: "VER",
      number: 3,
      nationality: "Dutch",
      team: "Red Bull Racing",
      rating: 1.12,
      attributes: {
        racecraft: 98,
        qualifying: 96,
        tireManagement: 96,
        wetWeather: 98,
        consistency: 97,
      },
      status: "active",
      active: true,
    },

    {
      name: "Isack Hadjar",
      shortName: "HAD",
      number: 6,
      nationality: "French",
      team: "Red Bull Racing",
      rating: 1.0,
      attributes: {
        racecraft: 84,
        qualifying: 87,
        tireManagement: 82,
        wetWeather: 84,
        consistency: 81,
      },
      status: "active",
      active: true,
    },

    {
      name: "Charles Leclerc",
      shortName: "LEC",
      number: 16,
      nationality: "Monegasque",
      team: "Ferrari",
      rating: 1.09,
      attributes: {
        racecraft: 91,
        qualifying: 98,
        tireManagement: 87,
        wetWeather: 91,
        consistency: 88,
      },
      status: "active",
      active: true,
    },

    {
      name: "Lewis Hamilton",
      shortName: "HAM",
      number: 44,
      nationality: "British",
      team: "Ferrari",
      rating: 1.06,
      attributes: {
        racecraft: 95,
        qualifying: 92,
        tireManagement: 95,
        wetWeather: 97,
        consistency: 94,
      },
      status: "active",
      active: true,
    },

    {
      name: "George Russell",
      shortName: "RUS",
      number: 63,
      nationality: "British",
      team: "Mercedes",
      rating: 1.05,
      attributes: {
        racecraft: 88,
        qualifying: 94,
        tireManagement: 86,
        wetWeather: 88,
        consistency: 90,
      },
      status: "active",
      active: true,
    },

    {
      name: "Kimi Antonelli",
      shortName: "ANT",
      number: 12,
      nationality: "Italian",
      team: "Mercedes",
      rating: 1.08,
      attributes: {
        racecraft: 91,
        qualifying: 93,
        tireManagement: 88,
        wetWeather: 87,
        consistency: 89,
      },
      status: "active",
      active: true,
    },

    {
      name: "Fernando Alonso",
      shortName: "ALO",
      number: 14,
      nationality: "Spanish",
      team: "Aston Martin",
      rating: 1.04,
      attributes: {
        racecraft: 97,
        qualifying: 89,
        tireManagement: 96,
        wetWeather: 95,
        consistency: 94,
      },
      status: "active",
      active: true,
    },

    {
      name: "Lance Stroll",
      shortName: "STR",
      number: 18,
      nationality: "Canadian",
      team: "Aston Martin",
      rating: 0.96,
      attributes: {
        racecraft: 78,
        qualifying: 77,
        tireManagement: 79,
        wetWeather: 82,
        consistency: 76,
      },
      status: "active",
      active: true,
    },

    {
      name: "Pierre Gasly",
      shortName: "GAS",
      number: 10,
      nationality: "French",
      team: "Alpine",
      rating: 0.99,
      attributes: {
        racecraft: 83,
        qualifying: 88,
        tireManagement: 82,
        wetWeather: 85,
        consistency: 84,
      },
      status: "active",
      active: true,
    },

    {
      name: "Franco Colapinto",
      shortName: "COL",
      number: 43,
      nationality: "Argentine",
      team: "Alpine",
      rating: 0.95,
      attributes: {
        racecraft: 79,
        qualifying: 81,
        tireManagement: 77,
        wetWeather: 78,
        consistency: 75,
      },
      status: "active",
      active: true,
    },

    {
      name: "Esteban Ocon",
      shortName: "OCO",
      number: 31,
      nationality: "French",
      team: "Haas",
      rating: 0.97,
      attributes: {
        racecraft: 82,
        qualifying: 80,
        tireManagement: 84,
        wetWeather: 86,
        consistency: 82,
      },
      status: "active",
      active: true,
    },

    {
      name: "Oliver Bearman",
      shortName: "BEA",
      number: 87,
      nationality: "British",
      team: "Haas",
      rating: 0.98,
      attributes: {
        racecraft: 81,
        qualifying: 85,
        tireManagement: 80,
        wetWeather: 82,
        consistency: 79,
      },
      status: "active",
      active: true,
    },

    {
      name: "Nico Hulkenberg",
      shortName: "HUL",
      number: 27,
      nationality: "German",
      team: "Audi",
      rating: 0.97,
      attributes: {
        racecraft: 85,
        qualifying: 89,
        tireManagement: 82,
        wetWeather: 87,
        consistency: 85,
      },
      status: "active",
      active: true,
    },

    {
      name: "Gabriel Bortoleto",
      shortName: "BOR",
      number: 5,
      nationality: "Brazilian",
      team: "Audi",
      rating: 0.94,
      attributes: {
        racecraft: 78,
        qualifying: 80,
        tireManagement: 76,
        wetWeather: 79,
        consistency: 75,
      },
      status: "active",
      active: true,
    },

    {
      name: "Carlos Sainz",
      shortName: "SAI",
      number: 55,
      nationality: "Spanish",
      team: "Williams",
      rating: 1.02,
      attributes: {
        racecraft: 90,
        qualifying: 87,
        tireManagement: 91,
        wetWeather: 88,
        consistency: 91,
      },
      status: "active",
      active: true,
    },

    {
      name: "Alexander Albon",
      shortName: "ALB",
      number: 23,
      nationality: "Thai",
      team: "Williams",
      rating: 0.99,
      attributes: {
        racecraft: 85,
        qualifying: 86,
        tireManagement: 84,
        wetWeather: 86,
        consistency: 84,
      },
      status: "active",
      active: true,
    },

    {
      name: "Liam Lawson",
      shortName: "LAW",
      number: 30,
      nationality: "New Zealander",
      team: "Racing Bulls",
      rating: 0.96,
      attributes: {
        racecraft: 80,
        qualifying: 82,
        tireManagement: 78,
        wetWeather: 81,
        consistency: 77,
      },
      status: "active",
      active: true,
    },

    {
      name: "Arvid Lindblad",
      shortName: "LIN",
      number: 41,
      nationality: "British",
      team: "Racing Bulls",
      rating: 0.94,
      attributes: {
        racecraft: 77,
        qualifying: 82,
        tireManagement: 76,
        wetWeather: 78,
        consistency: 73,
      },
      status: "active",
      active: true,
    },

    {
      name: "Sergio Perez",
      shortName: "PER",
      number: 11,
      nationality: "Mexican",
      team: "Cadillac",
      rating: 1.0,
      attributes: {
        racecraft: 91,
        qualifying: 82,
        tireManagement: 94,
        wetWeather: 90,
        consistency: 88,
      },
      status: "active",
      active: true,
    },

    {
      name: "Valtteri Bottas",
      shortName: "BOT",
      number: 77,
      nationality: "Finnish",
      team: "Cadillac",
      rating: 0.99,
      attributes: {
        racecraft: 86,
        qualifying: 91,
        tireManagement: 88,
        wetWeather: 85,
        consistency: 86,
      },
      status: "active",
      active: true,
    },
  ];

  await Driver.deleteMany({});

  const createdDrivers = await Driver.insertMany(drivers);

  console.log(`✅ ${createdDrivers.length} drivers seeded`);

  return createdDrivers;
};

/**
 * =========================================================
 * RACES
 * =========================================================
 */
const seedRaces = async (circuits) => {
  console.log("Seeding races...");

  const circuitMap = {};

  circuits.forEach((circuit) => {
    circuitMap[circuit.name] = circuit;
  });

  const raceDefinitions = [
    {
      name: "Australian Grand Prix",
      circuit: "Albert Park Circuit",
      round: 1,
      date: "2026-03-08T05:00:00.000Z",
    },
    {
      name: "Chinese Grand Prix",
      circuit: "Shanghai International Circuit",
      round: 2,
      date: "2026-03-15T07:00:00.000Z",
    },
    {
      name: "Japanese Grand Prix",
      circuit: "Suzuka International Racing Course",
      round: 3,
      date: "2026-03-29T05:00:00.000Z",
    },
    {
      name: "Bahrain Grand Prix",
      circuit: "Bahrain International Circuit",
      round: 4,
      date: "2026-04-12T15:00:00.000Z",
    },
    {
      name: "Saudi Arabian Grand Prix",
      circuit: "Jeddah Corniche Circuit",
      round: 5,
      date: "2026-04-19T17:00:00.000Z",
    },
    {
      name: "Miami Grand Prix",
      circuit: "Miami International Autodrome",
      round: 6,
      date: "2026-05-03T20:00:00.000Z",
    },
    {
      name: "Canadian Grand Prix",
      circuit: "Circuit Gilles Villeneuve",
      round: 7,
      date: "2026-05-24T18:00:00.000Z",
    },
    {
      name: "Monaco Grand Prix",
      circuit: "Circuit de Monaco",
      round: 8,
      date: "2026-06-07T13:00:00.000Z",
    },
    {
      name: "Spanish Grand Prix (Barcelona)",
      circuit: "Circuit de Barcelona-Catalunya",
      round: 9,
      date: "2026-06-14T13:00:00.000Z",
    },
    {
      name: "Austrian Grand Prix",
      circuit: "Red Bull Ring",
      round: 10,
      date: "2026-06-28T13:00:00.000Z",
    },
    {
      name: "British Grand Prix",
      circuit: "Silverstone Circuit",
      round: 11,
      date: "2026-07-05T14:00:00.000Z",
    },
    {
      name: "Belgian Grand Prix",
      circuit: "Circuit de Spa-Francorchamps",
      round: 12,
      date: "2026-07-19T13:00:00.000Z",
    },
    {
      name: "Hungarian Grand Prix",
      circuit: "Hungaroring",
      round: 13,
      date: "2026-07-26T13:00:00.000Z",
    },
    {
      name: "Dutch Grand Prix",
      circuit: "Circuit Zandvoort",
      round: 14,
      date: "2026-08-23T13:00:00.000Z",
    },
    {
      name: "Italian Grand Prix",
      circuit: "Autodromo Nazionale Monza",
      round: 15,
      date: "2026-09-06T13:00:00.000Z",
    },
    {
      name: "Spanish Grand Prix (Madrid)",
      circuit: "Madrid Circuit (IFEMA)",
      round: 16,
      date: "2026-09-13T13:00:00.000Z",
    },
    {
      name: "Azerbaijan Grand Prix",
      circuit: "Baku City Circuit",
      round: 17,
      date: "2026-09-20T11:00:00.000Z",
    },
    {
      name: "Singapore Grand Prix",
      circuit: "Marina Bay Street Circuit",
      round: 18,
      date: "2026-10-04T12:00:00.000Z",
    },
    {
      name: "United States Grand Prix",
      circuit: "Circuit of the Americas",
      round: 19,
      date: "2026-10-18T19:00:00.000Z",
    },
    {
      name: "Mexico City Grand Prix",
      circuit: "Autódromo Hermanos Rodríguez",
      round: 20,
      date: "2026-10-25T20:00:00.000Z",
    },
    {
      name: "São Paulo Grand Prix",
      circuit: "Autódromo José Carlos Pace (Interlagos)",
      round: 21,
      date: "2026-11-08T17:00:00.000Z",
    },
    {
      name: "Las Vegas Grand Prix",
      circuit: "Las Vegas Strip Circuit",
      round: 22,
      date: "2026-11-21T06:00:00.000Z",
    },
    {
      name: "Qatar Grand Prix",
      circuit: "Lusail International Circuit",
      round: 23,
      date: "2026-11-29T16:00:00.000Z",
    },
    {
      name: "Abu Dhabi Grand Prix",
      circuit: "Yas Marina Circuit",
      round: 24,
      date: "2026-12-06T13:00:00.000Z",
    },
  ];

  const races = raceDefinitions.map((race) => {
    const circuit = circuitMap[race.circuit];

    if (!circuit) {
      throw new Error(`Circuit not found while creating race: ${race.circuit}`);
    }

    return {
      name: race.name,
      season: 2026,
      round: race.round,
      circuit: circuit._id,
      date: new Date(race.date),
      laps: circuit.laps,
      status: "upcoming",

      weather: {
        condition: WeatherService.normalizeCondition(
          circuit.typicalWeather.condition,
        ),
        temperature: circuit.typicalWeather.temperature,
        humidity: circuit.typicalWeather.humidity,
        windSpeed: circuit.typicalWeather.windSpeed,
        rainProbability: circuit.typicalWeather.rainProbability,
      },
    };
  });

  // IMPORTANT:
  // Only the seed script deletes existing race data.
  await Race.deleteMany({});

  const createdRaces = await Race.insertMany(races);

  console.log(`✅ ${createdRaces.length} races seeded`);

  return createdRaces;
};

/**
 * =========================================================
 * MAIN SEED FUNCTION
 * =========================================================
 */
const seed = async () => {
  try {
    await connectDB();

    const circuits = await seedCircuits();

    await seedDrivers();

    await seedRaces(circuits);

    console.log("");
    console.log("=================================");
    console.log("✅ 2026 F1 SEED COMPLETED");
    console.log("=================================");
    console.log("Teams:    11");
    console.log("Drivers:  22");
    console.log("Circuits: 24");
    console.log("Races:    24");
    console.log("=================================");

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("");
    console.error("❌ SEED FAILED");
    console.error(error);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seed();
