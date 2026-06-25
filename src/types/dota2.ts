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
