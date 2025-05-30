import { ServiceManager } from "ace-linters/build/service-manager";

let configPromises = {};
let requestIdCounter = 0;

function getConfigFromMain(configName) {
    return new Promise((resolve, reject) => {
        const id = requestIdCounter++;
        configPromises[id] = { resolve, reject };
        self.postMessage({ type: 'getConfig', id: id, payload: configName });
        // Consider adding a timeout mechanism for production if needed
    });
}

self.onmessage = function(e) {
    if (e.data && e.data.type === 'configResult') { // Added null check for e.data
        const promise = configPromises[e.data.id];
        if (promise) {
            promise.resolve(e.data.payload);
            delete configPromises[e.data.id];
        }
    }
};

const manager = new ServiceManager(self);

// Commented out javascript service registration, adapted from main.js
// manager.registerService("javascript", {
//     features: {
//         completion: true,
//         completionResolve: true,
//         diagnostics: true,
//         format: true,
//         hover: true,
//         documentHighlight: true,
//         signatureHelp: true,
//     },
//     module: () => import("ace-linters/build/javascript-service"),
//     className: "JavascriptService",
//     modes: "javascript",
//     rootUri: async () => await getConfigFromMain('getRootUri'),
//     workspaceFolders: async () => await getConfigFromMain('getFolders'),
// });

manager.registerService("xml", {
    features: {
        completion: false,
        completionResolve: false,
        diagnostics: true,
        format: false,
        hover: false,
        documentHighlight: true,
        signatureHelp: false,
    },
    module: () => import("ace-linters/build/xml-service"),
    className: "XmlService",
    modes: "xml",
    // XML service might not need rootUri or workspaceFolders
});

manager.registerService("html", {
    features: {
        completion: true,
        completionResolve: true,
        diagnostics: true,
        format: true,
        hover: true,
        documentHighlight: true,
        signatureHelp: true,
    },
    module: () => import("ace-linters/build/html-service"),
    className: "HtmlService",
    modes: "html",
    rootUri: async () => await getConfigFromMain('getRootUri'),
    workspaceFolders: async () => await getConfigFromMain('getFolders'),
});

manager.registerService("css", {
    features: {
        completion: true,
        completionResolve: true,
        diagnostics: true,
        format: true,
        hover: true,
        documentHighlight: true,
        signatureHelp: true,
    },
    module: () => import("ace-linters/build/css-service"),
    className: "CssService",
    modes: "css",
    rootUri: async () => await getConfigFromMain('getRootUri'),
    workspaceFolders: async () => await getConfigFromMain('getFolders'),
});

manager.registerService("less", {
    features: { signatureHelp: false },
    module: () => import("ace-linters/build/css-service"),
    className: "CssService",
    modes: "less",
    rootUri: async () => await getConfigFromMain('getRootUri'),
    workspaceFolders: async () => await getConfigFromMain('getFolders'),
});

manager.registerService("scss", {
    features: { signatureHelp: false },
    module: () => import("ace-linters/build/css-service"),
    className: "CssService",
    modes: "scss",
    rootUri: async () => await getConfigFromMain('getRootUri'),
    workspaceFolders: async () => await getConfigFromMain('getFolders'),
});

manager.registerService("json", {
    features: { signatureHelp: false, documentHighlight: false },
    module: () => import("ace-linters/build/json-service"),
    className: "JsonService",
    modes: "json",
    rootUri: async () => await getConfigFromMain('getRootUri'),
    workspaceFolders: async () => await getConfigFromMain('getFolders'),
});

manager.registerService("json5", {
    features: { signatureHelp: false, documentHighlight: false },
    module: () => import("ace-linters/build/json-service"),
    className: "JsonService",
    modes: "json5",
    rootUri: async () => await getConfigFromMain('getRootUri'),
    workspaceFolders: async () => await getConfigFromMain('getFolders'),
});

manager.registerService("yaml", {
    features: { signatureHelp: false, documentHighlight: false },
    module: () => import("ace-linters/build/yaml-service"),
    className: "YamlService",
    modes: "yaml",
    rootUri: async () => await getConfigFromMain('getRootUri'),
    workspaceFolders: async () => await getConfigFromMain('getFolders'),
});

manager.registerService("lua", {
    features: { signatureHelp: false, documentHighlight: false },
    module: () => import("ace-linters/build/lua-service"),
    className: "LuaService",
    modes: "lua",
    rootUri: async () => await getConfigFromMain('getRootUri'),
    workspaceFolders: async () => await getConfigFromMain('getFolders'),
});

manager.registerService("php", {
    features: { signatureHelp: false, documentHighlight: false },
    module: () => import("ace-linters/build/php-service"),
    className: "PhpService",
    modes: "php",
    rootUri: async () => await getConfigFromMain('getRootUri'),
    workspaceFolders: async () => await getConfigFromMain('getFolders'),
});
