<script lang="ts">
	import { onMount } from "svelte";
	import I18nKey from "@/i18n/i18nKey";
	import { i18n } from "@/i18n/translation";
	import type { Match, MatchPlayer, StratzPlayerResponse } from "@/types/dota2";
	import { Position } from "@/types/dota2";

	interface Props {
		// 静态模式：直接传入数据
		matches?: Match[];
		playerName?: string;
		// 动态模式：传入获取配置
		fetchConfig?: {
			playerId: number;
			matchCount: number;
			apiToken: string;
		};
	}

	const {
		matches: staticMatches,
		playerName: staticPlayerName,
		fetchConfig,
	}: Props = $props();

	const isDynamic = $derived(!!fetchConfig);

	let matches = $state<Match[]>(staticMatches || []);
	let playerName = $state<string>(staticPlayerName || "");
	let loading = $state(false);
	let error = $state(false);
	let errorMsg = $state("");

	// 英雄头像 URL
	function heroImageUrl(shortName: string): string {
		return `https://cdn.stratz.com/images/dota2/heroes/${shortName}_horz.png`;
	}

	// 英雄中文名映射 (shortName → 中文名)
	const heroNameMap: Record<string, string> = {
		"antimage": "敌法师",
		"axe": "斧王",
		"bane": "祸乱之源",
		"bloodseeker": "血魔",
		"crystal_maiden": "水晶室女",
		"drow_ranger": "卓尔游侠",
		"earthshaker": "撼地者",
		"juggernaut": "主宰",
		"mirana": "米拉娜",
		"morphling": "变体精灵",
		"nevermore": "影魔",
		"phantom_lancer": "幻影长矛手",
		"puck": "帕克",
		"pudge": "帕吉",
		"razor": "剃刀",
		"sand_king": "沙王",
		"shadow_shaman": "暗影萨满",
		"storm_spirit": "风暴之灵",
		"sven": "斯温",
		"tidehunter": "潮汐猎人",
		"vengefulspirit": "复仇之魂",
		"windrunner": "风行者",
		"witch_doctor": "巫医",
		"zuus": "宙斯",
		"lina": "莉娜",
		"lion": "莱恩",
		"shadow_demon": "暗影恶魔",
		"slardar": "斯拉达",
		"beastmaster": "兽王",
		"enigma": "谜团",
		"faceless_void": "虚空假面",
		"furion": "先知",
		"life_stealer": "噬魂鬼",
		"night_stalker": "暗夜魔王",
		"omniknight": "全能骑士",
		"rattletrap": "发条技师",
		"skeleton_king": "冥魂大帝",
		"broodmother": "育母蜘蛛",
		"dark_seer": "黑暗贤者",
		"huskar": "哈斯卡",
		"invoker": "祈求者",
		"jakiro": "杰奇洛",
		"lone_druid": "德鲁伊",
		"magnataur": "马格纳斯",
		"ogre_magi": "食人魔魔法师",
		"alchemist": "炼金术士",
		"batrider": "蝙蝠骑士",
		"bounty_hunter": "赏金猎人",
		"centaur": "半人马战行者",
		"chen": "陈",
		"clinkz": "克林克兹",
		"doom_bringer": "末日使者",
		"dragon_knight": "龙骑士",
		"earth_spirit": "大地之灵",
		"elder_titan": "上古巨神",
		"ember_spirit": "灰烬之灵",
		"enchantress": "魅惑魔女",
		"gyrocopter": "矮人直升机",
		"io": "艾欧",
		"keeper_of_the_light": "光之守卫",
		"kunkka": "昆卡",
		"legion_commander": "军团指挥官",
		"leshrac": "拉席克",
		"lich": "巫妖",
		"lifestealer": "噬魂鬼",
		"luna": "露娜",
		"lycan": "狼人",
		"medusa": "美杜莎",
		"meepo": "米波",
		"monkey_king": "齐天大圣",
		"naga_siren": "娜迦海妖",
		"necrolyte": "瘟疫法师",
		"nyx_assassin": "司夜刺客",
		"obsidian_destroyer": "殁境神蚀者",
		"oracle": "神谕者",
		"phantom_assassin": "幻影刺客",
		"phoenix": "凤凰",
		"pugna": "帕格纳",
		"queenofpain": "痛苦女王",
		"riki": "力丸",
		"rubick": "拉比克",
		"shadow_fiend": "影魔",
		"silencer": "沉默术士",
		"skywrath_mage": "天怒法师",
		"slark": "斯拉克",
		"sniper": "狙击手",
		"spectre": "幽鬼",
		"spirit_breaker": "裂魂人",
		"techies": "工程师",
		"templar_assassin": "圣堂刺客",
		"terrorblade": "恐怖利刃",
		"timbersaw": "伐木机",
		"tinker": "修补匠",
		"tiny": "小小",
		"treant": "树精卫士",
		"troll_warlord": "巨魔战将",
		"tusk": "巨牙海民",
		"undying": "不朽尸王",
		"ursa": "熊战士",
		"venomancer": "剧毒术士",
		"viper": "冥界亚龙",
		"visage": "维萨吉",
		"warlock": "术士",
		"weaver": "编织者",
		"winter_wyvern": "寒冬飞龙",
		"wisp": "艾欧",
		"abaddon": "亚巴顿",
		"abyssal_underlord": "孽主",
		"ancient_apparition": "远古冰魄",
		"arc_warden": "天穹守望者",
		"brewmaster": "酒仙",
		"bristleback": "钢背兽",
		"chaos_knight": "混沌骑士",
		"dark_willow": "邪影芳灵",
		"dawnbreaker": "破晓辰星",
		"death_prophet": "死亡先知",
		"disruptor": "干扰者",
		"dazzle": "戴泽",
		"grimstroke": "天涯墨客",
		"hoodwink": "森海飞霞",
		"mars": "玛尔斯",
		"marci": "玛西",
		"muerta": "琼英碧灵",
		"pangolier": "石鳞剑士",
		"primal_beast": "兽",
		"ringmaster": "百戏大王",
		"snapfire": "电炎绝手",
		"void_spirit": "虚无之灵",
		"kez": "凯",
	};

	/** 获取英雄中文名，未知则返回 shortName 原文 */
	function heroChineseName(shortName: string): string {
		return heroNameMap[shortName] || shortName;
	}

	/** 位置 → SVG 图标路径，不存在则返回 null（UI 回落数字圆点） */
	function positionIcon(pos: Position): string | null {
		switch (pos) {
			case Position.POSITION_1: return "/assets/images/dota2pos/pos1.svg";
			case Position.POSITION_2: return "/assets/images/dota2pos/pos2.svg";
			case Position.POSITION_3: return "/assets/images/dota2pos/pos3.svg";
			case Position.POSITION_4: return "/assets/images/dota2pos/pos4.svg";
			case Position.POSITION_5: return "/assets/images/dota2pos/pos5.svg";
			default: return null;
		}
	}

	// 格式化比赛时长 (秒 → mm:ss)
	function formatDuration(seconds: number): string {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}:${s.toString().padStart(2, "0")}`;
	}

	// 格式化日期时间 (Unix timestamp 秒)
	function formatDateTime(ts: number): string {
		const d = new Date(ts * 1000);
		return d.toLocaleDateString("zh-CN", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		});
	}

	// 获取玩家数据
	function getPlayer(match: Match): MatchPlayer | undefined {
		return match.players?.[0];
	}

	// 动态获取数据
	async function fetchMatches() {
		if (!fetchConfig) return;

		loading = true;
		error = false;
		errorMsg = "";

		const query = `
			query($steamAccountId: Long!, $take: Int!) {
				player(steamAccountId: $steamAccountId) {
					steamAccount { id name }
					matches(request: { take: $take }) {
						id
						endDateTime
						durationSeconds
						didRadiantWin
						players(steamAccountId: $steamAccountId) {
							steamAccount { id name }
							hero { id name displayName shortName }
							isRadiant
							kills
							deaths
							assists
							networth
							position
						}
					}
				}
			}
		`;

		try {
			const resp = await fetch("https://api.stratz.com/graphql", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${fetchConfig.apiToken}`,
				},
				body: JSON.stringify({
					query,
					variables: {
						steamAccountId: fetchConfig.playerId,
						take: fetchConfig.matchCount,
					},
				}),
			});

			if (!resp.ok) {
				throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
			}

			const json: StratzPlayerResponse = await resp.json();

			if (json.errors?.length) {
				throw new Error(json.errors.map((e) => e.message).join("; "));
			}

			const p = json.data?.player;
			matches = p?.matches || [];
			playerName = p?.steamAccount?.name || String(fetchConfig.playerId);
		} catch (e) {
			error = true;
			errorMsg = e instanceof Error ? e.message : String(e);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		if (isDynamic) {
			fetchMatches();
		}
	});
</script>

<div class="dota2-match-list">
	<!-- 加载中 -->
	{#if loading}
		<div class="text-center py-12">
			<div class="inline-block w-8 h-8 border-3 border-(--primary)/30 border-t-(--primary) rounded-full animate-spin"></div>
			<p class="mt-3 text-sm text-neutral-500 dark:text-neutral-400">Loading...</p>
		</div>
	{:else if error}
		<div class="text-center py-16">
			<div class="inline-flex items-center justify-center w-16 h-16 bg-(--btn-regular-bg) rounded-full mb-6 border border-(--line-divider)">
				<svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
			</div>
			<h2 class="text-xl font-semibold text-black/80 dark:text-white/80 mb-3">
				{i18n(I18nKey.dota2FetchError)}
			</h2>
			<p class="text-black/60 dark:text-white/60 mb-4 max-w-md mx-auto text-sm">
				{errorMsg || i18n(I18nKey.dota2FetchErrorDesc)}
			</p>
		</div>
	{:else if matches.length === 0}
		<div class="text-center py-16">
			<div class="inline-flex items-center justify-center w-16 h-16 bg-(--btn-regular-bg) rounded-full mb-6 border border-(--line-divider)">
				<svg class="w-8 h-8 text-(--btn-content)" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
			</div>
			<h2 class="text-xl font-semibold text-black/80 dark:text-white/80 mb-3">
				{i18n(I18nKey.dota2Empty)}
			</h2>
			<p class="text-black/60 dark:text-white/60 max-w-md mx-auto text-sm">
				{i18n(I18nKey.dota2EmptyReason)}
			</p>
		</div>
	{:else}
		<!-- 玩家名 -->
		{#if playerName}
			<div class="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
				Player: <span class="font-medium text-neutral-700 dark:text-neutral-200">{playerName}</span>
			</div>
		{/if}

		<!-- 比赛列表 -->
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-(--line-divider) text-neutral-500 dark:text-neutral-400">
						<th class="text-center py-3 px-3 font-medium w-[24%]">{i18n(I18nKey.dota2Hero)}</th>
						<th class="text-center py-3 px-3 font-medium w-[8%]">{i18n(I18nKey.dota2Position)}</th>
						<th class="text-center py-3 px-3 font-medium w-[10%]">{i18n(I18nKey.dota2Result)}</th>
						<th class="text-center py-3 px-3 font-medium w-[12%]">{i18n(I18nKey.dota2KDA)}</th>
						<th class="text-center py-3 px-3 font-medium w-[10%]">{i18n(I18nKey.dota2NetWorth)}</th>
						<th class="text-center py-3 px-3 font-medium w-[10%]">{i18n(I18nKey.dota2Duration)}</th>
						<th class="text-center py-3 px-3 font-medium w-[16%]">{i18n(I18nKey.dota2DateTime)}</th>
					</tr>
				</thead>
				<tbody>
					{#each matches as match (match.id)}
						{@const player = getPlayer(match)}
						{@const isWin = player ? (player.isRadiant === match.didRadiantWin) : false}
						<tr class="border-b border-(--line-divider)/50 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer">
							<!-- 英雄 -->
							<td class="py-3 px-3">
								<div class="flex items-center gap-3">
									{#if player?.hero}
										<img
											src={heroImageUrl(player.hero.shortName)}
											alt={heroChineseName(player.hero.shortName)}
											class="w-16 h-9 rounded object-cover flex-shrink-0"
											loading="lazy"
										/>
									{/if}
									<span class="font-medium text-neutral-900 dark:text-neutral-100 truncate">
										{player?.hero ? heroChineseName(player.hero.shortName) : "—"}
									</span>
								</div>
							</td>
							<!-- 位置 -->
							<td class="py-3 px-3 text-center">
								{#if player}
									{@const icon = positionIcon(player.position)}
									{#if icon}
										<img src={icon} alt="" class="w-6 h-6 inline-block" />
									{:else}
										<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-(--primary)/10 text-(--primary) text-xs font-bold">
											?
										</span>
									{/if}
								{:else}
									—
								{/if}
							</td>
							<!-- 结果 -->
							<td class="py-3 px-3 text-center">
								<span class={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${isWin ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
									{isWin ? i18n(I18nKey.dota2Win) : i18n(I18nKey.dota2Loss)}
								</span>
							</td>
							<!-- KDA -->
							<td class="py-3 px-3 text-center">
								{#if player}
									<span class="font-mono font-medium text-neutral-900 dark:text-neutral-100">
										{player.kills}<span class="text-neutral-400">/</span>{player.deaths}<span class="text-neutral-400">/</span>{player.assists}
									</span>
								{:else}
									—
								{/if}
							</td>
							<!-- 经济 -->
							<td class="py-3 px-3 text-center">
								{#if player}
									<span class="font-mono text-neutral-700 dark:text-neutral-300">
										{(player.networth / 1000).toFixed(1)}k
									</span>
								{:else}
									—
								{/if}
							</td>
							<!-- 时长 -->
							<td class="py-3 px-3 text-center font-mono text-neutral-500 dark:text-neutral-400">
								{formatDuration(match.durationSeconds)}
							</td>
							<!-- 时间 -->
							<td class="py-3 px-3 text-center text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
								{formatDateTime(match.endDateTime)}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
