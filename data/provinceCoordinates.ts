// data/provinceCoordinates.ts

export interface ProvinceCoord {
    name: string;
    lat: number;
    lng: number;
}

export const provinceCoordinates: ProvinceCoord[] = [
    { name: "Ulaanbaatar", lat: 47.9188, lng: 106.9176 },
    { name: "Arkhangai", lat: 47.3796, lng: 101.4603 },
    { name: "Bayan-Ölgii", lat: 48.3975, lng: 90.4265 }, // Bayan-Ulgii
    { name: "Bayankhongor", lat: 45.3080, lng: 100.1245 },
    { name: "Bulgan", lat: 48.8125, lng: 103.5228 },
    { name: "Darkhan-Uul", lat: 49.4867, lng: 105.9228 },
    { name: "Dornod", lat: 48.0717, lng: 114.5290 },
    { name: "Dornogovi", lat: 44.2000, lng: 110.1000 },
    { name: "Dundgovi", lat: 45.7667, lng: 106.2833 },
    { name: "Govi-Altai", lat: 45.5000, lng: 96.2500 },
    { name: "Govisümber", lat: 46.3000, lng: 108.4000 },
    { name: "Khentii", lat: 48.0000, lng: 110.0000 },
    { name: "Khovd", lat: 47.5000, lng: 92.5000 },
    { name: "Khövsgöl", lat: 50.5000, lng: 100.0000 },
    { name: "Orkhon", lat: 49.0333, lng: 104.1500 }, // Erdenet
    { name: "Ömnögovi", lat: 43.0000, lng: 104.2500 },
    { name: "Övörkhangai", lat: 45.7500, lng: 102.7500 },
    { name: "Selenge", lat: 49.6000, lng: 106.2500 },
    { name: "Sükhbaatar", lat: 46.1000, lng: 113.5000 },
    { name: "Töv", lat: 47.7000, lng: 106.9000 }, // Central
    { name: "Uvs", lat: 49.5000, lng: 93.0000 },
    { name: "Zavkhan", lat: 48.1000, lng: 96.5000 }
];