import esbuild from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";

esbuild.build({
    entryPoints: ["dist/index.js"],
    platform: "node",
    bundle: true,
    sourcemap: true,
    minify: false,
    format: "esm",
    outfile: "build/bundle.js",
    plugins: [nodeExternalsPlugin()]
});