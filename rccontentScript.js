[33mcommit 900c9abd05e0df75577570c1b04554857c5e349d[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mmain[m[33m, [m[1;31morigin/main[m[33m, [m[1;31morigin/HEAD[m[33m)[m
Author: Andrew <liandrew1234@gmail.com>
Date:   Wed Apr 22 23:01:43 2026 -0400

    initialize React frontend

[1mdiff --git a/.gitignore b/.gitignore[m
[1mnew file mode 100644[m
[1mindex 0000000..6483567[m
[1m--- /dev/null[m
[1m+++ b/.gitignore[m
[36m@@ -0,0 +1,71 @@[m
[32m+[m[32mnode_modules/[m
[32m+[m[32mnpm-debug.log*[m
[32m+[m[32myarn-debug.log*[m
[32m+[m[32myarn-error.log*[m
[32m+[m[32mpnpm-debug.log*[m
[32m+[m[32m.pnpm-store/[m
[32m+[m[32myarn.lock[m
[32m+[m[32mpnpm-lock.yaml[m
[32m+[m
[32m+[m[32mdist/[m
[32m+[m[32mbuild/[m
[32m+[m[32mout/[m
[32m+[m[32m*.crx[m
[32m+[m[32m*.pem[m
[32m+[m
[32m+[m[32m.vite/[m
[32m+[m[32mvite.config.ts.timestamp-*[m
[32m+[m
[32m+[m[32m*.tsbuildinfo[m
[32m+[m
[32m+[m[32m.env[m
[32m+[m[32m.env.*[m
[32m+[m[32m!.env.example[m
[32m+[m[32m*.key[m
[32m+[m[32m*.secret[m
[32m+[m[32msecrets.json[m
[32m+[m
[32m+[m[32mThumbs.db[m
[32m+[m[32mehthumbs.db[m
[32m+[m[32mDesktop.ini[m
[32m+[m[32m$RECYCLE.BIN/[m
[32m+[m
[32m+[m[32m.DS_Store[m
[32m+[m[32m.AppleDouble[m
[32m+[m[32m.LSOverride[m
[32m+[m[32m._*[m
[32m+[m[32m.Spotlight-V100[m
[32m+[m[32m.Trashes[m
[32m+[m
[32m+[m[32m*~[m
[32m+[m
[32m+[m[32m.vscode/[m
[32m+[m[32m!.vscode/extensions.json[m
[32m+[m[32m!.vscode/settings.json[m
[32m+[m
[32m+[m[32m.idea/[m
[32m+[m[32m*.iml[m
[32m+[m[32m*.iws[m
[32m+[m[32m*.ipr[m
[32m+[m
[32m+[m[32m*.swp[m
[32m+[m[32m*.swo[m
[32m+[m[32m*~[m
[32m+[m[32m.#*[m
[32m+[m
[32m+[m[32mlogs/[m
[32m+[m[32m*.log[m
[32m+[m[32m*.log.*[m
[32m+[m[32mnpm-debug.log[m
[32m+[m[32myarn-debug.log[m
[32m+[m[32m.eslintcache[m
[32m+[m
[32m+[m[32mcoverage/[m
[32m+[m[32m.nyc_output/[m
[32m+[m[32mtest-results/[m
[32m+[m
[32m+[m[32m*.tmp[m
[32m+[m[32m*.temp[m
[32m+[m[32m.cache/[m
[32m+[m[32m.parcel-cache/[m
[32m+[m[32m.turbo/[m
[1mdiff --git a/frontend/index.html b/frontend/index.html[m
[1mnew file mode 100644[m
[1mindex 0000000..9ca7c62[m
[1m--- /dev/null[m
[1m+++ b/frontend/index.html[m
[36m@@ -0,0 +1,13 @@[m
[32m+[m[32m<!DOCTYPE html>[m
[32m+[m[32m<html lang="en">[m
[32m+[m[32m  <head>[m
[32m+[m[32m    <meta charset="UTF-8" />[m
[32m+[m[32m    <link rel="icon" type="image/svg+xml" href="/vite.svg" />[m
[32m+[m[32m    <meta name="viewport" content="width=device-width, initial-scale=1.0" />[m
[32m+[m[32m    <title>NYC Renting Assistant</title>[m
[32m+[m[32m  </head>[m
[32m+[m[32m  <body>[m
[32m+[m[32m    <div id="root"></div>[m
[32m+[m[32m    <script type="module" src="/src/main.tsx"></script>[m
[32m+[m[32m  </body>[m
[32m+[m[32m</html>[m
[1mdiff --git a/frontend/manifest.json b/frontend/manifest.json[m
[1mnew file mode 100644[m
[1mindex 0000000..d5ebf1a[m
[1m--- /dev/null[m
[1m+++ b/frontend/manifest.json[m
[36m@@ -0,0 +1,36 @@[m
[32m+[m[32m{[m
[32m+[m[32m  "manifest_version": 3,[m
[32m+[m[32m  "name": "NYC Renting Assistant",[m
[32m+[m[32m  "version": "0.1.0",[m
[32m+[m[32m  "description": "Aggregate building info and complaints for NYC rental listings.",[m
[32m+[m[32m  "permissions": ["storage", "activeTab"],[m
[32m+[m[32m  "host_permissions": [[m
[32m+[m[32m    "https://*.zillow.com/*",[m
[32m+[m[32m    "https://*.streeteasy.com/*",[m
[32m+[m[32m    "https://*.apartments.com/*",[m
[32m+[m[32m    "https://data.cityofnewyork.us/*"[m
[32m+[m[32m  ],[m
[32m+[m[32m  "action": {[m
[32m+[m[32m    "default_popup": "index.html"[m
[32m+[m[32m  },[m
[32m+[m[32m  "background": {[m
[32m+[m[32m    "service_worker": "src/background/index.ts",[m
[32m+[m[32m    "type": "module"[m
[32m+[m[32m  },[m
[32m+[m[32m  "content_scripts": [[m
[32m+[m[32m    {[m
[32m+[m[32m      "matches": [[m
[32m+[m[32m        "https://*.zillow.com/*",[m
[32m+[m[32m        "https://*.streeteasy.com/*",[m
[32m+[m[32m        "https://*.apartments.com/*"[m
[32m+[m[32m      ],[m
[32m+[m[32m      "js": ["src/content/index.tsx"][m
[32m+[m[32m    }[m
[32m+[m[32m  ],[m
[32m+[m[32m  "web_accessible_resources": [[m
[32m+[m[32m    {[m
[32m+[m[32m      "resources": ["assets/*"],[m
[32m+[m[32m      "matches": ["<all_urls>"][m
[32m+[m[32m    }[m
[32m+[m[32m  ][m
[32m+[m[32m}[m
[1mdiff --git a/frontend/package-lock.json b/frontend/package-lock.json[m
[1mnew file mode 100644[m
[1mindex 0000000..80cf5a9[m
[1m--- /dev/null[m
[1m+++ b/frontend/package-lock.json[m
[36m@@ -0,0 +1,4569 @@[m
[32m+[m[32m{[m
[32m+[m[32m  "name": "nyc-renting-assistant",[m
[32m+[m[32m  "version": "0.1.0",[m
[32m+[m[32m  "lockfileVersion": 3,[m
[32m+[m[32m  "requires": true,[m
[32m+[m[32m  "packages": {[m
[32m+[m[32m    "": {[m
[32m+[m[32m      "name": "nyc-renting-assistant",[m
[32m+[m[32m      "version": "0.1.0",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "clsx": "^2.1.1",[m
[32m+[m[32m        "lucide-react": "^1.8.0",[m
[32m+[m[32m        "react": "^18.2.0",[m
[32m+[m[32m        "react-dom": "^18.2.0",[m
[32m+[m[32m        "tailwind-merge": "^3.5.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "devDependencies": {[m
[32m+[m[32m        "@crxjs/vite-plugin": "^2.0.0-beta.23",[m
[32m+[m[32m        "@types/chrome": "^0.0.263",[m
[32m+[m[32m        "@types/react": "^18.2.66",[m
[32m+[m[32m        "@types/react-dom": "^18.2.22",[m
[32m+[m[32m        "@typescript-eslint/eslint-plugin": "^7.2.0",[m
[32m+[m[32m        "@typescript-eslint/parser": "^7.2.0",[m
[32m+[m[32m        "@vitejs/plugin-react": "^4.2.1",[m
[32m+[m[32m        "autoprefixer": "^10.4.19",[m
[32m+[m[32m        "eslint": "^8.57.0",[m
[32m+[m[32m        "eslint-plugin-react-hooks": "^4.6.0",[m
[32m+[m[32m        "eslint-plugin-react-refresh": "^0.4.6",[m
[32m+[m[32m        "postcss": "^8.4.38",[m
[32m+[m[32m        "tailwindcss": "^3.4.3",[m
[32m+[m[32m        "typescript": "^5.2.2",[m
[32m+[m[32m        "vite": "^5.2.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@alloc/quick-lru": {[m
[32m+[m[32m      "version": "5.2.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@alloc/quick-lru/-/quick-lru-5.2.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-UrcABB+4bUrFABwbluTIBErXwvbsU/V7TZWfmbgJfbkwiBuziS9gxdODUyuiecfdGQ85jglMW6juS3+z5TsKLw==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=10"[m
[32m+[m[32m      },[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "url": "https://github.com/sponsors/sindresorhus"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@babel/code-frame": {[m
[32m+[m[32m      "version": "7.29.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.29.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-9NhCeYjq9+3uxgdtp20LSiJXJvN0FeCtNGpJxuMFZ1Kv3cWUNb6DOhJwUvcVCzKGR66cw4njwM6hrJLqgOwbcw==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@babel/helper-validator-identifier": "^7.28.5",[m
[32m+[m[32m        "js-tokens": "^4.0.0",[m
[32m+[m[32m        "picocolors": "^1.1.1"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=6.9.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@babel/compat-data": {[m
[32m+[m[32m      "version": "7.29.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@babel/compat-data/-/compat-data-7.29.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-T1NCJqT/j9+cn8fvkt7jtwbLBfLC/1y1c7NtCeXFRgzGTsafi68MRv8yzkYSapBnFA6L3U2VSc02ciDzoAJhJg==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=6.9.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@babel/core": {[m
[32m+[m[32m      "version": "7.29.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@babel/core/-/core-7.29.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-CGOfOJqWjg2qW/Mb6zNsDm+u5vFQ8DxXfbM09z69p5Z6+mE1ikP2jUXw+j42Pf1XTYED2Rni5f95npYeuwMDQA==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "peer": true,[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@babel/code-frame": "^7.29.0",[m
[32m+[m[32m        "@babel/generator": "^7.29.0",[m
[32m+[m[32m        "@babel/helper-compilation-targets": "^7.28.6",[m
[32m+[m[32m        "@babel/helper-module-transforms": "^7.28.6",[m
[32m+[m[32m        "@babel/helpers": "^7.28.6",[m
[32m+[m[32m        "@babel/parser": "^7.29.0",[m
[32m+[m[32m        "@babel/template": "^7.28.6",[m
[32m+[m[32m        "@babel/traverse": "^7.29.0",[m
[32m+[m[32m        "@babel/types": "^7.29.0",[m
[32m+[m[32m        "@jridgewell/remapping": "^2.3.5",[m
[32m+[m[32m        "convert-source-map": "^2.0.0",[m
[32m+[m[32m        "debug": "^4.1.0",[m
[32m+[m[32m        "gensync": "^1.0.0-beta.2",[m
[32m+[m[32m        "json5": "^2.2.3",[m
[32m+[m[32m        "semver": "^6.3.1"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=6.9.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "opencollective",[m
[32m+[m[32m        "url": "https://opencollective.com/babel"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@babel/core/node_modules/convert-source-map": {[m
[32m+[m[32m      "version": "2.0.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/convert-source-map/-/convert-source-map-2.0.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-Kvp459HrV2FEJ1CAsi1Ku+MY3kasH19TFykTz2xWmMeq6bk2NU3XXvfJ+Q61m0xktWwt+1HSYf3JZsTms3aRJg==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT"[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@babel/core/node_modules/semver": {[m
[32m+[m[32m      "version": "6.3.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "ISC",[m
[32m+[m[32m      "bin": {[m
[32m+[m[32m        "semver": "bin/semver.js"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@babel/generator": {[m
[32m+[m[32m      "version": "7.29.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@babel/generator/-/generator-7.29.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-qsaF+9Qcm2Qv8SRIMMscAvG4O3lJ0F1GuMo5HR/Bp02LopNgnZBC/EkbevHFeGs4ls/oPz9v+Bsmzbkbe+0dUw==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@babel/parser": "^7.29.0",[m
[32m+[m[32m        "@babel/types": "^7.29.0",[m
[32m+[m[32m        "@jridgewell/gen-mapping": "^0.3.12",[m
[32m+[m[32m        "@jridgewell/trace-mapping": "^0.3.28",[m
[32m+[m[32m        "jsesc": "^3.0.2"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=6.9.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@babel/helper-compilation-targets": {[m
[32m+[m[32m      "version": "7.28.6",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@babel/helper-compilation-targets/-/helper-compilation-targets-7.28.6.tgz",[m
[32m+[m[32m      "integrity": "sha512-JYtls3hqi15fcx5GaSNL7SCTJ2MNmjrkHXg4FSpOA/grxK8KwyZ5bubHsCq8FXCkua6xhuaaBit+3b7+VZRfcA==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@babel/compat-data": "^7.28.6",[m
[32m+[m[32m        "@babel/helper-validator-option": "^7.27.1",[m
[32m+[m[32m        "browserslist": "^4.24.0",[m
[32m+[m[32m        "lru-cache": "^5.1.1",[m
[32m+[m[32m        "semver": "^6.3.1"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=6.9.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@babel/helper-compilation-targets/node_modules/semver": {[m
[32m+[m[32m      "version": "6.3.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "ISC",[m
[32m+[m[32m      "bin": {[m
[32m+[m[32m        "semver": "bin/semver.js"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@babel/helper-globals": {[m
[32m+[m[32m      "version": "7.28.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@babel/helper-globals/-/helper-globals-7.28.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-+W6cISkXFa1jXsDEdYA8HeevQT/FULhxzR99pxphltZcVaugps53THCeiWA8SguxxpSp3gKPiuYfSWopkLQ4hw==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=6.9.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@babel/helper-module-imports": {[m
[32m+[m[32m      "version": "7.28.6",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@babel/helper-module-imports/-/helper-module-imports-7.28.6.tgz",[m
[32m+[m[32m      "integrity": "sha512-l5XkZK7r7wa9LucGw9LwZyyCUscb4x37JWTPz7swwFE/0FMQAGpiWUZn8u9DzkSBWEcK25jmvubfpw2dnAMdbw==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@babel/traverse": "^7.28.6",[m
[32m+[m[32m        "@babel/types": "^7.28.6"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=6.9.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@babel/helper-module-transforms": {[m
[32m+[m[32m      "version": "7.28.6",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@babel/helper-module-transforms/-/helper-module-transforms-7.28.6.tgz",[m
[32m+[m[32m      "integrity": "sha512-67oXFAYr2cDLDVGLXTEABjdBJZ6drElUSI7WKp70NrpyISso3plG9SAGEF6y7zbha/wOzUByWWTJvEDVNIUGcA==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@babel/helper-module-imports": "^7.28.6",[m
[32m+[m[32m        "@babel/helper-validator-identifier": "^7.28.5",[m
[32m+[m[32m        "@babel/traverse": "^7.28.6"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=6.9.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@babel/core": "^7.0.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@babel/helper-plugin-utils": {[m
[32m+[m[32m      "version": "7.28.6",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@babel/helper-plugin-utils/-/helper-plugin-utils-7.28.6.tgz",[m
[32m+[m[32m      "integrity": "sha512-S9gzZ/bz83GRysI7gAD4wPT/AI3uCnY+9xn+Mx/KPs2JwHJIz1W8PZkg2cqyt3RNOBM8ejcXhV6y8Og7ly/Dug==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=6.9.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@babel/helper-string-parser": {[m
[32m+[m[32m      "version": "7.27.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@babel/helper-string-parser/-/helper-string-parser-7.27.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-qMlSxKbpRlAridDExk92nSobyDdpPijUq2DW6oDnUqd0iOGxmQjyqhMIihI9+zv4LPyZdRje2cavWPbCbWm3eA==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=6.9.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@babel/helper-validator-identifier": {[m
[32m+[m[32m      "version": "7.28.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@babel/helper-validator-identifier/-/helper-validator-identifier-7.28.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-qSs4ifwzKJSV39ucNjsvc6WVHs6b7S03sOh2OcHF9UHfVPqWWALUsNUVzhSBiItjRZoLHx7nIarVjqKVusUZ1Q==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=6.9.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@babel/helper-validator-option": {[m
[32m+[m[32m      "version": "7.27.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@babel/helper-validator-option/-/helper-validator-option-7.27.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-YvjJow9FxbhFFKDSuFnVCe2WxXk1zWc22fFePVNEaWJEu8IrZVlda6N0uHwzZrUM1il7NC9Mlp4MaJYbYd9JSg==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=6.9.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@babel/helpers": {[m
[32m+[m[32m      "version": "7.29.2",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@babel/helpers/-/helpers-7.29.2.tgz",[m
[32m+[m[32m      "integrity": "sha512-HoGuUs4sCZNezVEKdVcwqmZN8GoHirLUcLaYVNBK2J0DadGtdcqgr3BCbvH8+XUo4NGjNl3VOtSjEKNzqfFgKw==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@babel/template": "^7.28.6",[m
[32m+[m[32m        "@babel/types": "^7.29.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=6.9.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@babel/parser": {[m
[32m+[m[32m      "version": "7.29.2",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@babel/parser/-/parser-7.29.2.tgz",[m
[32m+[m[32m      "integrity": "sha512-4GgRzy/+fsBa72/RZVJmGKPmZu9Byn8o4MoLpmNe1m8ZfYnz5emHLQz3U4gLud6Zwl0RZIcgiLD7Uq7ySFuDLA==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@babel/types": "^7.29.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "bin": {[m
[32m+[m[32m        "parser": "bin/babel-parser.js"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=6.0.0"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@babel/plugin-transform-react-jsx-self": {[m
[32m+[m[32m      "version": "7.27.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@babel/plugin-transform-react-jsx-self/-/plugin-transform-react-jsx-self-7.27.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-6UzkCs+ejGdZ5mFFC/OCUrv028ab2fp1znZmCZjAOBKiBK2jXD1O+BPSfX8X2qjJ75fZBMSnQn3Rq2mrBJK2mw==",[m
[32m+[m[32m      "dev": true,[m
[32m+[m[32m      "license": "MIT",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@babel/helper-plugin-utils": "^7.27.1"[m
[32m+[m[32m      },[m
[32m+[m[32m      "engines": {[m
[32m+[m[32m        "node": ">=6.9.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@babel/core": "^7.0.0-0"[m
[32m+[m[32m      }[m
[32m