// ============================================================
// Dota2 Match Record 类型定义
// 基于 Stratz API (https://stratz.com/api)
// ============================================================

/** 位置枚举 */
export enum Position {
	POSITION_1 = "POSITION_1",
	POSITION_2 = "POSITION_2",
	POSITION_3 = "POSITION_3",
	POSITION_4 = "POSITION_4",
	POSITION_5 = "POSITION_5",
	UNKNOWN = "UNKNOWN",
	FILTERED = "FILTERED",
	ALL = "ALL",
}

/** 游戏模式枚举 */
export enum GameMode {
	NONE = "NONE",
	ALL_PICK = "ALL_PICK",
	CAPTAINS_MODE = "CAPTAINS_MODE",
	RANDOM_DRAFT = "RANDOM_DRAFT",
	SINGLE_DRAFT = "SINGLE_DRAFT",
	ALL_RANDOM = "ALL_RANDOM",
	INTRO = "INTRO",
	THE_DIRETIDE = "THE_DIRETIDE",
	REVERSE_CAPTAINS_MODE = "REVERSE_CAPTAINS_MODE",
	THE_GREEVILING = "THE_GREEVILING",
	TUTORIAL = "TUTORIAL",
	MID_ONLY = "MID_ONLY",
	LEAST_PLAYED = "LEAST_PLAYED",
	NEW_PLAYER_POOL = "NEW_PLAYER_POOL",
	COMPENDIUM_MATCHMAKING = "COMPENDIUM_MATCHMAKING",
	CUSTOM = "CUSTOM",
	CAPTAINS_DRAFT = "CAPTAINS_DRAFT",
	BALANCED_DRAFT = "BALANCED_DRAFT",
	ABILITY_DRAFT = "ABILITY_DRAFT",
	EVENT = "EVENT",
	ALL_RANDOM_DEATH_MATCH = "ALL_RANDOM_DEATH_MATCH",
	SOLO_MID = "SOLO_MID",
	ALL_PICK_RANKED = "ALL_PICK_RANKED",
	TURBO = "TURBO",
	MUTATION = "MUTATION",
	UNKNOWN = "UNKNOWN",
}

/** 英雄 */
export type Hero = {
	id: number;
	name: string;
	displayName: string;
	shortName: string;
};

/** Steam 账号 */
export type SteamAccount = {
	id: number;
	name: string;
};

/** 比赛中的玩家数据 */
export type MatchPlayer = {
	steamAccount: SteamAccount;
	hero: Hero;
	isRadiant: boolean;
	position: Position;
	kills: number;
	deaths: number;
	assists: number;
	networth: number;
};

/** 比赛 */
export type Match = {
	id: number;
	endDateTime: number;
	durationSeconds: number;
	didRadiantWin: boolean;
	players: MatchPlayer[];
};

/** Stratz GraphQL 响应 — player 查询 */
export type StratzPlayerResponse = {
	data?: {
		player?: {
			steamAccount?: SteamAccount;
			matches?: Match[];
		};
	};
	errors?: Array<{ message: string }>;
};
