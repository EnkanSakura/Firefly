import {
	type NavBarConfig,
	type NavBarLink,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/navBarConfig";
import { siteConfig } from "./siteConfig";

// ============================================================================
// 导航栏配置 - 根据顺序动态生成导航栏链接
// NavBar Configuration - Dynamically generate navigation bar links based on order
// ============================================================================
const getDynamicNavBarConfig = (): NavBarConfig => {
	// 基础导航栏链接
	const links: NavBarLink[] = [
		// 主页
		LinkPresets.Home,

	];

	// 文章及其子菜单
	links.push({
		name: "文章",
		url: "#",
		icon: "material-symbols:article",
		children: [
			// 归档
			LinkPresets.Archive,

			// 分类
			LinkPresets.Categories,

			// 标签
			LinkPresets.Tags,
		],
	});

	// 我的及其子菜单
	links.push({
		name: "我的",
		url: "#",
		icon: "material-symbols:person",
		children: [
			{
				name: "关于",
				url: "/about/",
				icon: "material-symbols:info",
				external: false,
			},
			...(siteConfig.pages.bangumi ? [LinkPresets.Bangumi] : []),
			...(siteConfig.pages.anime ? [LinkPresets.Anime] : []),
			...(siteConfig.pages.dota2 ? [LinkPresets.Dota2] : []),
			...(siteConfig.pages.gallery ? [LinkPresets.Gallery] : []),
		],
	});

	links.push({
		name: "工具",
		url: "/tools/",
		icon: "material-symbols:tools-wrench",

		children: [
			{
				name: "NMR RF计算器",
				url: "/tools/nmr-rf-calculator/",
				external: false,
				icon: "material-symbols:wifi-rounded"
			},
			{
				name: "",
				url: "",
				external: false,
				icon: ""
			},
		]
	});

	// 自定义导航栏链接
	links.push({
		name: "外链",
		url: "/links/",
		icon: "material-symbols:link",
		// 子菜单
		children: [
			{
				name: "bilibili",
				url: "https://space.bilibili.com/4275270",
				external: true,
				icon: "fa7-brands:bilibili",
			},
			{
				name: "GitHub",
				url: "https://github.com/enkansakura",
				external: true,
				icon: "fa7-brands:github",
			},
			{
				name: "Steam",
				url: "https://steamcommunity.com/id/enkansakura/",
				external: true,
				icon: "fa7-brands:steam",
			},
			{
				name: "Twitter",
				url: "https://twitter.com/enkansakura",
				external: true,
				icon: "fa7-brands:twitter",
			},
			{
				name: "Bangumi",
				url: "https://bgm.tv/user/1224437",
				external: true,
				icon: "material-symbols:movie",
			}
		],
	});

	// 根据配置决定是否添加友链，在siteConfig关闭pages.friends时导航栏不显示友链
	if (siteConfig.pages.friends) {
		links.push(LinkPresets.Friends);
	}

	// 根据配置决定是否添加留言板，在siteConfig关闭pages.guestbook时导航栏不显示留言板
	if (siteConfig.pages.guestbook) {
		links.push(LinkPresets.Guestbook);
	}

	return { links } as NavBarConfig;
};

// 导航搜索配置
export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};

// ============================================================================
// 链接预设 - 可自由自定义导航栏链接的名称、图标和URL
// Link Presets - Allows free customization of the name, icon, and URL of navigation bar links
// ============================================================================
export const LinkPresets: Record<string, NavBarLink> = {
	Home: {
		name: "主页",
		url: "/",
		icon: "material-symbols:home",
	},
	Archive: {
		name: "归档",
		url: "/archive/",
		icon: "material-symbols:archive",
	},
	Categories: {
		name: "分类",
		url: "/categories/",
		icon: "material-symbols:folder-open-rounded",
	},
	Tags: {
		name: "标签",
		url: "/tags/",
		icon: "material-symbols:tag-rounded",
	},
	Friends: {
		name: "友链",
		url: "/friends/",
		icon: "material-symbols:group",
		pageKey: "friends",
	},
	Sponsor: {
		name: "打赏",
		url: "/sponsor/",
		icon: "material-symbols:favorite",
		pageKey: "sponsor",
	},
	Guestbook: {
		name: "留言",
		url: "/guestbook/",
		icon: "material-symbols:chat",
		pageKey: "guestbook",
	},
	About: {
		name: "关于我",
		url: "/about/",
		icon: "material-symbols:person",
	},
	Bangumi: {
		name: "Bangumi",
		url: "/bangumi/",
		icon: "material-symbols:movie",
		pageKey: "bangumi",
	},
	Gallery: {
		name: "相册",
		url: "/gallery/",
		icon: "material-symbols:photo-library",
		pageKey: "gallery",
	},
	Anime: {
		name: "追番",
		url: "/anime/",
		icon: "material-symbols:live-tv",
		pageKey: "anime",
	},
	Dota2: {
		name: "Dota2",
		url: "/dota2/",
		icon: "material-symbols:swords-outline",
		pageKey: "dota2",
	},
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
