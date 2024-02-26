import esbuild from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";

esbuild.build({
    entryPoints: ["dist/index.js"],
    platform: "node",
    bundle: true,
    sourcemap: true,
    minify: false,
    format: "esm",
    outfile: "build/wle_pp_bundle.js",
    plugins: [nodeExternalsPlugin()]
});