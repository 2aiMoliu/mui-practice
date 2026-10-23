export type Game = {
    id: string;
    title: string;
    platform: string;
    status: string;
    rating: number | null;
    favorite: boolean;
    playTime: number;
};
export const initialGame: Game = {
    id: '',
    title: '',
    platform: '',
    status: '未プレイ',
    rating: 0,
    favorite: false,
    playTime: 0,
};
export const gamesForDemo: Game[] = [
    { "id": "925e288c-49bd-407c-a9ad-15b76f412284", "title": "ゼビウス", "platform": "ファミリーコンピュータ", "status": "クリア", "rating": 5, "favorite": false, "playTime": 60 },
    { "id": "a32b17f7-86fd-4ae4-89f0-e59541a72d18", "title": "ゼルダの伝説 時のオカリナ(リメイク)", "platform": "Switch", "status": "未プレイ", "rating": 0, "favorite": false, "playTime": 0 },
    { "id": "b23c44e8-e053-4800-aeaa-099e83d095e4", "title": "オーバーウォッチ2", "platform": "PS5", "status": "プレイ中", "rating": 4, "favorite": false, "playTime": 60 },
    { "id": "018d51ef-9c0c-4e6c-ad75-74dbc0f6b5b1", "title": "Minecraft", "platform": "PC", "status": "未プレイ", "rating": 0, "favorite": false, "playTime": 0 },
    { "id": "25be0f9e-c8a8-42fe-9e18-7e7211b0185d", "title": "ゼルダの伝説 ブレスオブザワイルド", "platform": "Switch", "status": "クリア", "rating": 3, "favorite": false, "playTime": 28 },
    { "id": "ff8c6b00-20e6-490a-ba94-cffd855bcd36", "title": "ピクミンブルーム", "platform": "スマートフォン", "status": "プレイ中", "rating": 3, "favorite": false, "playTime": 60 }
];
