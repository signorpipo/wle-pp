import esbuild from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";

esbuild.build({
    entryPoints: ["dist/pp/index.js"],
    platform: "node",
    bundle: true,
    sourcemap: true,
    minify: false,
    format: "esm",
    outfile: "bundle/pp/bundle.js",
    plugins: [nodeExternalsPlugin()]
});