const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.Db_Yu22J.js","app":"_app/immutable/entry/app.CrBnKdXL.js","imports":["_app/immutable/entry/start.Db_Yu22J.js","_app/immutable/chunks/entry.Dgo2YOqG.js","_app/immutable/chunks/scheduler.BLLGogQX.js","_app/immutable/entry/app.CrBnKdXL.js","_app/immutable/chunks/scheduler.BLLGogQX.js","_app/immutable/chunks/index.B_cdJbfY.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./chunks/0-Bi_cNP0Z.js')),
			__memo(() => import('./chunks/1-D-G48Ayt.js')),
			__memo(() => import('./chunks/2-DfA8IkjC.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/upload",
				pattern: /^\/upload\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server-O9yxweRf.js'))
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
