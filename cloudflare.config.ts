import { defineConfig } from "cf/config";

export default defineConfig({
	worker: {
		name: "scrollitis",
		compatibilityDate: "2026-09-24",
		domains: [
			"scrollitis.misc.page",
		],
	},
});
