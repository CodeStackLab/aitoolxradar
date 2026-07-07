// OmniTool Hub - Application Scripts

// Global State
let apiKey = '';
let isSettingsVisible = false;

// API key load from localStorage
const savedKey = localStorage.getItem('vibeprompt_api_key');
if (savedKey) apiKey = savedKey;

// DOM Elements
const settingsModal = document.getElementById('settings-modal');
const toggleSettingsBtn = document.getElementById('toggle-settings-btn');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const apiKeyInput = document.getElementById('api-key-input');
const toggleKeyVisibilityBtn = document.getElementById('toggle-key-visibility');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const keyStatusText = document.getElementById('key-status-text');

const catalogView = document.getElementById('catalog-view');
const toolView = document.getElementById('tool-view');
const apiDirectoryView = document.getElementById('api-directory-view');
const categoriesContainer = document.getElementById('categories-container');
const toolSearchInput = document.getElementById('tool-search');

const breadcrumbCat = document.getElementById('breadcrumb-cat');
const breadcrumbTool = document.getElementById('breadcrumb-tool');
const activeToolTitle = document.getElementById('active-tool-title');
const activeToolDesc = document.getElementById('active-tool-desc');
const activeToolIconContainer = document.getElementById('active-tool-icon-container');
const workspaceContainer = document.getElementById('workspace-container');
const relatedToolsList = document.getElementById('related-tools-list');

// Menu navigation selectors
const navHomeLink = document.getElementById('nav-home-link');
const navApisLink = document.getElementById('nav-apis-link');
const navBlogsLink = document.getElementById('nav-blogs-link');
const navBlogsDrawerLink = document.getElementById('nav-blogs-drawer-link');
const blogsView = document.getElementById('blogs-view');
const blogsContentContainer = document.getElementById('blogs-content-container');

// Mobile drawer controls
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileDrawer = document.getElementById('mobile-drawer');
const closeDrawerBtn = document.getElementById('close-drawer-btn');
const drawerSettingsBtn = document.getElementById('drawer-settings-btn');
const drawerLinks = document.querySelectorAll('.drawer-link');

// 30 Tools Database with icons mapping
const tools = [
    // --- DEVELOPER TOOLS ---
    {
        id: "json-compiler",
        name: "JSON to TS & Zod Compiler",
        category: "Developer Tools",
        icon: "fa-solid fa-file-code",
        description: "Parse raw JSON objects recursively to compile clean TypeScript Interfaces and Zod schema validations.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="json-input">Paste JSON Object</label>
                            <textarea id="json-input" style="height:260px;" placeholder='{\n  "id": 1,\n  "name": "Admin",\n  "active": true,\n  "tags": ["web", "dev"]\n}'></textarea>
                        </div>
                        <button id="compile-json-btn" class="btn btn-primary btn-block">Compile Schema</button>
                    </div>
                    <div class="tool-preview-panel">
                        <div class="code-box">
                            <div class="code-box-header">
                                <span class="code-box-title">TypeScript Interface</span>
                                <button id="copy-ts-btn" class="btn btn-sm btn-outline">Copy</button>
                            </div>
                            <pre><code id="ts-output-block">interface GeneratedType {}</code></pre>
                        </div>
                        <div class="code-box" style="margin-top:12px;">
                            <div class="code-box-header">
                                <span class="code-box-title">Zod Validator Schema</span>
                                <button id="copy-zod-btn" class="btn btn-sm btn-outline">Copy</button>
                            </div>
                            <pre><code id="zod-output-block">const schema = z.object({});</code></pre>
                        </div>
                    </div>
                </div>
            `;
            const jsonIn = document.getElementById('json-input');
            const tsOut = document.getElementById('ts-output-block');
            const zodOut = document.getElementById('zod-output-block');
            const compileBtn = document.getElementById('compile-json-btn');

            compileBtn.addEventListener('click', () => {
                compileBtn.disabled = true;
                compileBtn.innerHTML = '<span class="spinner"></span> Compiling...';
                setTimeout(() => {
                    try {
                        const parsed = JSON.parse(jsonIn.value || '{}');
                        let ts = "interface RootObject {\n";
                        let zod = "const rootSchema = z.object({\n";
                        for (const [key, value] of Object.entries(parsed)) {
                            let type = typeof value;
                            let zodType = "z.any()";
                            if (value === null) {
                                type = "any";
                                zodType = "z.any()";
                            } else if (Array.isArray(value)) {
                                const subType = value.length > 0 ? typeof value[0] : "any";
                                type = `${subType}[]`;
                                zodType = `z.array(z.${subType === 'number' ? 'number' : subType === 'boolean' ? 'boolean' : 'string'}())`;
                            } else if (type === 'object') {
                                type = "Record<string, any>";
                                zodType = "z.record(z.any())";
                            } else {
                                zodType = `z.${type}()`;
                            }
                            ts += `    ${key}: ${type};\n`;
                            zod += `    ${key}: ${zodType},\n`;
                        }
                        ts += "}";
                        zod += "});";
                        tsOut.innerText = ts;
                        zodOut.innerText = zod;
                    } catch (e) {
                        alert("Invalid JSON format! Please check syntax.");
                    } finally {
                        compileBtn.disabled = false;
                        compileBtn.innerHTML = 'Compile Schema';
                    }
                }, 300);
            });
            document.getElementById('copy-ts-btn').addEventListener('click', () => copyText(tsOut.innerText, document.getElementById('copy-ts-btn')));
            document.getElementById('copy-zod-btn').addEventListener('click', () => copyText(zodOut.innerText, document.getElementById('copy-zod-btn')));
        }
    },
    {
        id: "regex-tester",
        name: "Regex Explainer & Tester",
        category: "Developer Tools",
        icon: "fa-solid fa-magnifying-glass-chart",
        description: "Test regular expressions client-side, highlight textual matches, and read structured plain-English explanations.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="regex-pattern">Regex Pattern (No slashes)</label>
                            <input type="text" id="regex-pattern" value="[a-zA-Z0-9]+@[a-z]+\\.[a-z]{2,3}">
                        </div>
                        <div class="form-group">
                            <label for="regex-flags">Flags</label>
                            <input type="text" id="regex-flags" value="g">
                        </div>
                        <div class="form-group">
                            <label for="regex-text">Test Target String</label>
                            <textarea id="regex-text" style="height:100px;">Contact us at hello@world.com or support@google.org.</textarea>
                        </div>
                    </div>
                    <div class="tool-preview-panel">
                        <h3>Match Results</h3>
                        <div class="display-frame" id="regex-highlights" style="justify-content:flex-start; align-items:flex-start; padding:16px; display:block; height:100px; overflow-y:auto;">
                            Highlight targets...
                        </div>
                        <h3>Rules Explained</h3>
                        <div class="code-box">
                            <pre><code id="regex-explanation">Loading explanation...</code></pre>
                        </div>
                    </div>
                </div>
            `;
            const pat = document.getElementById('regex-pattern');
            const flg = document.getElementById('regex-flags');
            const txt = document.getElementById('regex-text');
            const highlightBox = document.getElementById('regex-highlights');
            const explanation = document.getElementById('regex-explanation');

            const calculateRegex = () => {
                try {
                    const r = new RegExp(pat.value, flg.value);
                    const originalVal = txt.value;
                    const matches = [...originalVal.matchAll(r)];
                    let html = originalVal;
                    for (let i = matches.length - 1; i >= 0; i--) {
                        const m = matches[i];
                        const start = m.index;
                        const end = start + m[0].length;
                        html = html.substring(0, start) + `<span style="background:rgba(99,102,241,0.3); border-bottom:1px solid var(--accent-indigo); padding:0 2px;">` + html.substring(start, end) + `</span>` + html.substring(end);
                    }
                    highlightBox.innerHTML = html.replace(/\n/g, '<br>');
                    let exp = `Pattern: /${pat.value}/\n`;
                    if (pat.value.includes('@')) exp += `- Matches literal "@"\n`;
                    if (pat.value.includes('[a-z]')) exp += `- Matches lowercase character ranges (a-z)\n`;
                    if (pat.value.includes('\\d')) exp += `- Matches any digit character (0-9)\n`;
                    if (pat.value.includes('+')) exp += `- Match 1 or more repetitions (+)\n`;
                    if (pat.value.includes('\\.')) exp += `- Matches literal dot character (.)\n`;
                    explanation.innerText = exp;
                } catch (e) {
                    highlightBox.innerHTML = `<span style="color:var(--accent-danger)">Invalid Regex Expression</span>`;
                }
            };
            [pat, flg, txt].forEach(el => el.addEventListener('input', calculateRegex));
            calculateRegex();
        }
    },
    {
        id: "cron-visualizer",
        name: "Cron Expression Visualizer",
        category: "Developer Tools",
        icon: "fa-solid fa-clock",
        description: "Translate complex cron schedules into clear plain English sentences and calculate future trigger runs.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="cron-input">Cron Schedule Syntax</label>
                            <input type="text" id="cron-input" value="*/15 8-18 * * 1-5">
                        </div>
                        <h3>English Translation</h3>
                        <div class="display-frame" id="cron-english" style="height:100px; padding:20px; font-weight:600; text-align:center;">
                            Every 15 minutes between 8 AM and 6 PM, Monday through Friday.
                        </div>
                    </div>
                    <div class="tool-preview-panel">
                        <h3>Simulated Run Schedule</h3>
                        <ul class="dns-records-log" id="cron-runs"></ul>
                    </div>
                </div>
            `;
            const input = document.getElementById('cron-input');
            const english = document.getElementById('cron-english');
            const runs = document.getElementById('cron-runs');

            const translateCron = () => {
                const parts = input.value.trim().split(/\s+/);
                if (parts.length < 5) {
                    english.innerText = "Waiting for complete cron expression...";
                    return;
                }
                const [min, hr, day, mon, week] = parts;
                let desc = `Every ${min === '*' ? 'minute' : min.startsWith('*/') ? min.split('/')[1] + ' minutes' : 'minute ' + min}`;
                desc += ` during hour ${hr === '*' ? 'any hour' : hr.includes('-') ? hr.split('-').join(' to ') : hr}`;
                desc += `, on day ${day === '*' ? 'every day' : day} of month`;
                desc += `, during month ${mon === '*' ? 'every month' : mon}`;
                desc += `, weekday ${week === '*' ? 'every day' : week === '1-5' ? 'Mon-Fri' : week}.`;
                
                english.innerText = desc;
                let html = '';
                const base = new Date();
                for (let i = 1; i <= 5; i++) {
                    const runDate = new Date(base.getTime() + (i * 15 * 60000));
                    html += `<li>📅 Next Trigger Run: ${runDate.toISOString().replace('T', ' ').substring(0, 19)}</li>`;
                }
                runs.innerHTML = html;
            };
            input.addEventListener('input', translateCron);
            translateCron();
        }
    },
    {
        id: "css-grid",
        name: "CSS Visual Grid Layout Builder",
        category: "Developer Tools",
        icon: "fa-solid fa-table-cells-large",
        description: "Configure custom rows, columns, and spacing gaps visually, and grab production-ready CSS layout codes.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="grid-cols">Columns count</label>
                            <div class="range-group">
                                <input type="range" id="grid-cols" min="1" max="6" value="3">
                                <span class="range-val" id="grid-cols-val">3</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="grid-rows">Rows count</label>
                            <div class="range-group">
                                <input type="range" id="grid-rows" min="1" max="4" value="2">
                                <span class="range-val" id="grid-rows-val">2</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="grid-gap">Gap Size (px)</label>
                            <div class="range-group">
                                <input type="range" id="grid-gap" min="0" max="40" value="12">
                                <span class="range-val" id="grid-gap-val">12px</span>
                            </div>
                        </div>
                    </div>
                    <div class="tool-preview-panel">
                        <div class="display-frame" style="height:180px;">
                            <div class="grid-preview-container" id="grid-preview"></div>
                        </div>
                        <div class="code-box">
                            <div class="code-box-header">
                                <span>CSS Grid Markup</span>
                                <button id="copy-grid-btn" class="btn btn-sm btn-outline">Copy</button>
                            </div>
                            <pre><code id="grid-css-code"></code></pre>
                        </div>
                    </div>
                </div>
            `;
            const cols = document.getElementById('grid-cols');
            const rows = document.getElementById('grid-rows');
            const gap = document.getElementById('grid-gap');
            const preview = document.getElementById('grid-preview');
            const cssBlock = document.getElementById('grid-css-code');

            const drawGrid = () => {
                const cVal = parseInt(cols.value);
                const rVal = parseInt(rows.value);
                const gVal = parseInt(gap.value);

                document.getElementById('grid-cols-val').innerText = cVal;
                document.getElementById('grid-rows-val').innerText = rVal;
                document.getElementById('grid-gap-val').innerText = `${gVal}px`;

                preview.style.gridTemplateColumns = `repeat(${cVal}, 1fr)`;
                preview.style.gridTemplateRows = `repeat(${rVal}, 1fr)`;
                preview.style.gap = `${gVal}px`;
                preview.innerHTML = '';
                for (let i = 1; i <= cVal * rVal; i++) {
                    const cell = document.createElement('div');
                    cell.className = 'grid-cell-preview';
                    cell.innerText = `Cell ${i}`;
                    preview.appendChild(cell);
                }
                const code = `display: grid;\ngrid-template-columns: repeat(${cVal}, 1fr);\ngrid-template-rows: repeat(${rVal}, 1fr);\ngap: ${gVal}px;`;
                cssBlock.innerText = code;
            };
            [cols, rows, gap].forEach(el => el.addEventListener('input', drawGrid));
            drawGrid();
            document.getElementById('copy-grid-btn').addEventListener('click', () => copyText(cssBlock.innerText, document.getElementById('copy-grid-btn')));
        }
    },
    {
        id: "csv-loader",
        name: "CSV to SQL Visual Loader",
        category: "Developer Tools",
        icon: "fa-solid fa-file-csv",
        description: "Parse CSV table rows instantly client-side to generate relational database CREATE TABLE and INSERT INTO scripts.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="csv-tbl-name">Database Target Table Name</label>
                            <input type="text" id="csv-tbl-name" value="users">
                        </div>
                        <div class="form-group">
                            <label for="csv-input-data">Paste CSV Rows (Comma Separated)</label>
                            <textarea id="csv-input-data" style="height:160px;" placeholder="id,name,email\n1,Alex,alex@gmail.com\n2,John,john@yahoo.com"></textarea>
                        </div>
                        <button id="convert-csv-btn" class="btn btn-primary btn-block">Generate SQL Statements</button>
                    </div>
                    <div class="tool-preview-panel">
                        <div class="code-box">
                            <div class="code-box-header">
                                <span>Compiled SQL Queries</span>
                                <button id="copy-sql-btn" class="btn btn-sm btn-outline">Copy</button>
                            </div>
                            <pre><code id="csv-sql-output">...</code></pre>
                        </div>
                    </div>
                </div>
            `;
            const nameIn = document.getElementById('csv-tbl-name');
            const dataIn = document.getElementById('csv-input-data');
            const sqlOut = document.getElementById('csv-sql-output');
            const genBtn = document.getElementById('convert-csv-btn');

            genBtn.addEventListener('click', () => {
                genBtn.disabled = true;
                genBtn.innerHTML = '<span class="spinner"></span> Converting...';
                setTimeout(() => {
                    const lines = dataIn.value.trim().split('\n');
                    if (lines.length < 2) {
                        alert("Please insert headers line and at least one record line.");
                        genBtn.disabled = false;
                        genBtn.innerHTML = 'Generate SQL Statements';
                        return;
                    }
                    const headers = lines[0].split(',').map(h => h.trim());
                    const tbl = nameIn.value.trim() || 'users';

                    let sql = `CREATE TABLE ${tbl} (\n`;
                    headers.forEach((h, i) => {
                        sql += `  ${h} VARCHAR(255)${i < headers.length - 1 ? ',' : ''}\n`;
                    });
                    sql += `);\n\n`;

                    for (let i = 1; i < lines.length; i++) {
                        const row = lines[i].split(',').map(r => r.trim());
                        if (row.length === headers.length) {
                            const vals = row.map(v => isNaN(v) ? `'${v}'` : v).join(', ');
                            sql += `INSERT INTO ${tbl} (${headers.join(', ')}) VALUES (${vals});\n`;
                        }
                    }
                    sqlOut.innerText = sql;
                    genBtn.disabled = false;
                    genBtn.innerHTML = 'Generate SQL Statements';
                }, 300);
            });
            document.getElementById('copy-sql-btn').addEventListener('click', () => copyText(sqlOut.innerText, document.getElementById('copy-sql-btn')));
        }
    },
    {
        id: "git-helper",
        name: "Interactive Git Tree Command Assistant",
        category: "Developer Tools",
        icon: "fa-brands fa-git-alt",
        description: "Visual helper that maps daily Git hurdles to their corresponding CLI execution commands and trees logic.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="git-problem">Select Hurdle Scenario</label>
                            <select id="git-problem">
                                <option value="undo-commit">Undo last commit (keep local edits)</option>
                                <option value="delete-branch">Delete a local branch</option>
                                <option value="discard-changes">Discard all uncommitted local modifications</option>
                                <option value="stash">Save local work changes temporarily</option>
                            </select>
                        </div>
                        <h3>Git Execution Commands</h3>
                        <div class="code-box">
                            <pre><code id="git-commands">git reset --soft HEAD~1</code></pre>
                        </div>
                    </div>
                    <div class="tool-preview-panel">
                        <h3>Visual Repository Actions</h3>
                        <div class="display-frame" id="git-graph-preview" style="flex-direction:column; padding:20px;"></div>
                    </div>
                </div>
            `;
            const prob = document.getElementById('git-problem');
            const cmds = document.getElementById('git-commands');
            const graph = document.getElementById('git-graph-preview');

            const calculateGit = () => {
                const val = prob.value;
                if (val === 'undo-commit') {
                    cmds.innerText = `git reset --soft HEAD~1`;
                    graph.innerHTML = `
                        <div style="display:flex; align-items:center; gap:16px;">
                            <div style="background:var(--accent-indigo); padding:8px; border-radius:4px;">Main Commit Node</div>
                            <span style="color:var(--text-muted)">↩️ Resets head to</span>
                            <div style="background:var(--bg-secondary); border:1px solid var(--border-color); padding:8px; border-radius:4px;">Previous Node</div>
                        </div>
                    `;
                } else if (val === 'delete-branch') {
                    cmds.innerText = `git branch -d feature-branch`;
                    graph.innerHTML = `
                        <div style="display:flex; flex-direction:column; gap:12px; align-items:center;">
                            <span style="color:var(--accent-danger)">❌ Branch Deleted</span>
                            <code style="font-family:monospace; background:rgba(255,255,255,0.05); padding:4px 8px;">feature-branch</code>
                        </div>
                    `;
                } else if (val === 'discard-changes') {
                    cmds.innerText = `git reset --hard HEAD\ngit clean -fd`;
                    graph.innerHTML = `
                        <div style="display:flex; align-items:center; gap:10px;">
                            <div style="background:var(--bg-secondary); border:1px dashed var(--accent-danger); padding:8px; border-radius:4px; opacity:0.5;">Untracked files</div>
                            <span>🗑️ Cleared out</span>
                            <div style="background:var(--accent-emerald); padding:8px; border-radius:4px;">Workspace Reset</div>
                        </div>
                    `;
                } else if (val === 'stash') {
                    cmds.innerText = `git stash\ngit stash pop`;
                    graph.innerHTML = `
                        <div style="text-align:center;">
                            <div style="background:var(--accent-purple); padding:8px 16px; border-radius:8px; display:inline-block;">📥 Saved in Git Stash Stack</div>
                        </div>
                    `;
                }
            };
            prob.addEventListener('change', calculateGit);
            calculateGit();
        }
    },
    {
        id: "ascii-generator",
        name: "ASCII Banner Text Designer",
        category: "Developer Tools",
        icon: "fa-solid fa-font",
        description: "Transform regular title headers into blocks of visual terminal-ready ASCII banner fonts for project READMEs.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="ascii-input">Banner Text</label>
                            <input type="text" id="ascii-input" value="OMNI HUB">
                        </div>
                        <div class="form-group">
                            <label for="ascii-style">Font Style</label>
                            <select id="ascii-style">
                                <option value="block">Heavy Block</option>
                                <option value="slant">Slanted lines</option>
                            </select>
                        </div>
                    </div>
                    <div class="tool-preview-panel">
                        <div class="code-box">
                            <div class="code-box-header">
                                <span>Output Banner</span>
                                <button id="copy-ascii-btn" class="btn btn-sm btn-outline">Copy</button>
                            </div>
                            <pre><code id="ascii-output-block" style="line-height:1.2; font-size:0.75rem;">Loading art...</code></pre>
                        </div>
                    </div>
                </div>
            `;
            const text = document.getElementById('ascii-input');
            const style = document.getElementById('ascii-style');
            const output = document.getElementById('ascii-output-block');

            const drawAscii = () => {
                const val = text.value || 'OMNI';
                const st = style.value;
                let art = '';
                if (st === 'block') {
                    art = `
 ██████  ███    ███ ███    ██ ██ 
██    ██ ████  ████ ████   ██ ██ 
██    ██ ██ ████ ██ ██ ██  ██ ██ 
██    ██ ██  ██  ██ ██  ██ ██ ██ 
 ██████  ██      ██ ██   ████ ██ 
                    `;
                } else {
                    art = `
  ____  __  __ _   _ ___   _   _ _   _ ____  
 / ___||  \\/  | \\ | |_ _| | | | | | | | __ ) 
 \\___ \\| |\\/| |  \\| || |  | |_| | | | |  _ \\ 
  ___) | |  | | |\\  || |  |  _  | |_| | |_) |
 |____/|_|  |_|_| \\_|___| |_| |_|\\___/|____/ 
                    `;
                }
                output.innerText = art.trim() + `\n\n(Art simulation for "${val.toUpperCase()}")`;
            };
            [text, style].forEach(el => el.addEventListener('input', drawAscii));
            drawAscii();
            document.getElementById('copy-ascii-btn').addEventListener('click', () => copyText(output.innerText, document.getElementById('copy-ascii-btn')));
        }
    },

    // --- AI UTILITIES ---
    {
        id: "prompt-optimizer",
        name: "Vibe Prompt Optimizer",
        category: "AI Utilities",
        icon: "fa-solid fa-wand-magic-sparkles",
        description: "Rewrite a short raw description into a structured, role-based system instruction using backend fallback APIs.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="vibe-raw-input">Raw Prompt Idea / Vibe</label>
                            <textarea id="vibe-raw-input" style="height:120px;" placeholder="e.g., make a bot that helps me write emails, but make it sound like a pirate..."></textarea>
                        </div>
                        <div class="form-group">
                            <label for="vibe-role">Persona Role</label>
                            <select id="vibe-role">
                                <option value="expert coder">Senior Developer</option>
                                <option value="copywriter">Creative Marketer</option>
                                <option value="editor">Academic Proofreader</option>
                            </select>
                        </div>
                        <button id="vibe-optimize-btn" class="btn btn-primary btn-block">✨ Optimize System Prompt</button>
                    </div>
                    <div class="tool-preview-panel">
                        <div class="code-box">
                            <div class="code-box-header">
                                <span class="code-box-title">Optimized Prompt Template</span>
                                <button id="copy-opt-prompt-btn" class="btn btn-sm btn-outline">Copy</button>
                            </div>
                            <pre><code id="vibe-opt-output"># ROLE AND PERSONA\nDefine who the AI is...\n\n# OBJECTIVE\nThe primary task...</code></pre>
                        </div>
                    </div>
                </div>
            `;
            const raw = document.getElementById('vibe-raw-input');
            const role = document.getElementById('vibe-role');
            const out = document.getElementById('vibe-opt-output');
            const optBtn = document.getElementById('vibe-optimize-btn');

            optBtn.addEventListener('click', async () => {
                const text = raw.value.trim();
                if (!text) {
                    alert("Please write your raw prompt idea first!");
                    return;
                }
                optBtn.disabled = true;
                optBtn.innerHTML = '<span class="spinner"></span> Generating...';

                try {
                    const promptText = `Convert the user's vibe: "${text}" with persona constraints "${role.value}" into a structured markdown System Prompt.`;
                    const res = await callAI(promptText, "You are a prompt engineer.");
                    out.innerText = res;
                } catch (e) {
                    out.innerText = `# Error\nFailed to process backend AI fallback. Check network configurations.`;
                } finally {
                    optBtn.disabled = false;
                    optBtn.innerHTML = '✨ Optimize System Prompt';
                }
            });
            document.getElementById('copy-opt-prompt-btn').addEventListener('click', () => copyText(out.innerText, document.getElementById('copy-opt-prompt-btn')));
        }
    },
    {
        id: "token-calculator",
        name: "LLM API Token & Cost Calculator",
        category: "AI Utilities",
        icon: "fa-solid fa-coins",
        description: "Input raw developer text prompts to compute estimated token counts and map costs across multiple LLM APIs.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="token-string-input">Input Raw Text Prompt</label>
                            <textarea id="token-string-input" style="height:160px;" placeholder="Paste sample parameters here to estimate tokens..."></textarea>
                        </div>
                    </div>
                    <div class="tool-preview-panel">
                        <h3>Estimated Metrics</h3>
                        <div class="display-frame" style="height:100px; flex-direction:column; justify-content:center; align-items:center; gap:8px;">
                            <div style="font-size:1.5rem; font-weight:800;" id="calculated-token-count">0 Tokens</div>
                            <div style="font-size:0.8rem; color:var(--text-muted);" id="calculated-char-count">0 Characters</div>
                        </div>
                        <h3>Pricing Comparison (Per 1 Million)</h3>
                        <ul class="dns-records-log" id="prices-comparison-list">
                            <li>Gemini 1.5 Flash: Input: $0.075 | Output: $0.30</li>
                            <li>GPT-4o API: Input: $5.00 | Output: $15.00</li>
                            <li>Claude 3.5 Sonnet: Input: $3.00 | Output: $15.00</li>
                        </ul>
                    </div>
                </div>
            `;
            const textIn = document.getElementById('token-string-input');
            const tokenOut = document.getElementById('calculated-token-count');
            const charOut = document.getElementById('calculated-char-count');

            textIn.addEventListener('input', () => {
                const text = textIn.value;
                const chars = text.length;
                const tokens = Math.ceil(chars / 4);
                tokenOut.innerText = `${tokens.toLocaleString()} Tokens`;
                charOut.innerText = `${chars.toLocaleString()} Characters`;

                const geminiCost = (tokens / 1000000) * 0.075;
                const gptCost = (tokens / 1000000) * 5.00;
                const claudeCost = (tokens / 1000000) * 3.00;

                document.getElementById('prices-comparison-list').innerHTML = `
                    <li>🔮 Gemini 1.5 Flash: <span style="color:var(--accent-emerald)">$${geminiCost.toFixed(6)}</span> ($0.075 / 1M)</li>
                    <li>🤖 GPT-4o API: <span style="color:var(--accent-purple)">$${gptCost.toFixed(6)}</span> ($5.00 / 1M)</li>
                    <li>🎨 Claude 3.5 Sonnet: <span style="color:var(--accent-pink)">$${claudeCost.toFixed(6)}</span> ($3.00 / 1M)</li>
                `;
            });
        }
    },
    {
        id: "sql-builder",
        name: "Text-to-SQL Query Builder",
        category: "AI Utilities",
        icon: "fa-solid fa-database",
        description: "Translate natural language instructions into correct SQL queries locally or via AI integration.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="sql-nl-input">What data do you need?</label>
                            <textarea id="sql-nl-input" style="height:100px;" placeholder="e.g., Select all records from users where active is true and order by date"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="sql-db-dialect">Database Dialect</label>
                            <select id="sql-db-dialect">
                                <option value="postgres">PostgreSQL</option>
                                <option value="mysql">MySQL</option>
                                <option value="sqlite">SQLite</option>
                            </select>
                        </div>
                        <button id="generate-query-btn" class="btn btn-primary btn-block">Generate Query</button>
                    </div>
                    <div class="tool-preview-panel">
                        <div class="code-box">
                            <div class="code-box-header">
                                <span>Compiled SQL Result</span>
                                <button id="copy-built-sql" class="btn btn-sm btn-outline">Copy</button>
                            </div>
                            <pre><code id="built-sql-block">SELECT * FROM users WHERE active = true ORDER BY date DESC;</code></pre>
                        </div>
                    </div>
                </div>
            `;
            const input = document.getElementById('sql-nl-input');
            const dialect = document.getElementById('sql-db-dialect');
            const sqlBlock = document.getElementById('built-sql-block');
            const genBtn = document.getElementById('generate-query-btn');

            genBtn.addEventListener('click', async () => {
                const query = input.value.trim();
                if (!query) return;
                genBtn.disabled = true;
                genBtn.innerHTML = '<span class="spinner"></span> Compiling...';

                try {
                    const prompt = `Write a clean SQL query using ${dialect.value} style matching rules: "${query}". Return ONLY the query code block, no descriptions, no markdown ticks.`;
                    const res = await callAI(prompt, "You are a database engineer. Return only raw SQL code.");
                    sqlBlock.innerText = res;
                } catch (e) {
                    sqlBlock.innerText = `-- Failed to validate query. Check logs.`;
                } finally {
                    genBtn.disabled = false;
                    genBtn.innerHTML = 'Generate Query';
                }
            });
            document.getElementById('copy-built-sql').addEventListener('click', () => copyText(sqlBlock.innerText, document.getElementById('copy-built-sql')));
        }
    },

    // --- DESIGN & MEDIA ---
    {
        id: "svg-wave",
        name: "Interactive SVG Wave Designer",
        category: "Design & Media",
        icon: "fa-solid fa-water",
        description: "Adjust heights and curvature complexities to output organic-looking SVG layout separator waves.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="wave-color-pick">Wave Fill Color</label>
                            <input type="color" id="wave-color-pick" value="#6366f1">
                        </div>
                        <div class="form-group">
                            <label for="wave-amp">Wave Height (Amplitude)</label>
                            <div class="range-group">
                                <input type="range" id="wave-amp" min="20" max="220" value="100">
                                <span class="range-val" id="wave-amp-val">100px</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="wave-points">Complexity Points</label>
                            <div class="range-group">
                                <input type="range" id="wave-points" min="2" max="8" value="4">
                                <span class="range-val" id="wave-points-val">4</span>
                            </div>
                        </div>
                        <button id="wave-rand-btn" class="btn btn-outline btn-block">🔀 Randomize Wave Nodes</button>
                    </div>
                    <div class="tool-preview-panel">
                        <div class="display-frame" id="wave-svg-target" style="align-items:flex-end;"></div>
                        <div class="code-box">
                            <div class="code-box-header">
                                <span>SVG Output Code</span>
                                <button id="copy-wave-btn" class="btn btn-sm btn-outline">Copy Code</button>
                            </div>
                            <pre><code id="wave-code-output">Loading vector code...</code></pre>
                        </div>
                    </div>
                </div>
            `;
            const color = document.getElementById('wave-color-pick');
            const amp = document.getElementById('wave-amp');
            const points = document.getElementById('wave-points');
            const randBtn = document.getElementById('wave-rand-btn');
            const target = document.getElementById('wave-svg-target');
            const code = document.getElementById('wave-code-output');

            let seedsY = [];
            const initSeeds = (count) => {
                seedsY = [];
                for (let i = 0; i <= count; i++) {
                    seedsY.push(110 + (Math.random() * 100 - 50));
                }
            };
            const drawWave = () => {
                const aVal = parseInt(amp.value);
                const pVal = parseInt(points.value);
                const colVal = color.value;
                document.getElementById('wave-amp-val').innerText = `${aVal}px`;
                document.getElementById('wave-points-val').innerText = pVal;

                if (seedsY.length !== pVal + 1) initSeeds(pVal);
                const width = 1440;
                const segment = width / pVal;
                let pathD = `M 0 320 L 0 ${320 - aVal} `;

                for (let i = 0; i < pVal; i++) {
                    const x1 = i * segment;
                    const y1 = 320 - aVal + (seedsY[i] - 110) * (aVal / 110);
                    const x2 = (i + 1) * segment;
                    const y2 = 320 - aVal + (seedsY[i + 1] - 110) * (aVal / 110);
                    const cx1 = x1 + segment / 2;
                    const cy1 = y1;
                    const cx2 = x1 + segment / 2;
                    const cy2 = y2;
                    pathD += `C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2} `;
                }
                pathD += `L 1440 320 Z`;

                const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" width="100%" height="100%" preserveAspectRatio="none">\n  <path fill="${colVal}" fill-opacity="1" d="${pathD}"></path>\n</svg>`;
                target.innerHTML = svg;
                code.innerText = svg;
            };

            [color, amp, points].forEach(el => el.addEventListener('input', drawWave));
            randBtn.addEventListener('click', () => {
                initSeeds(parseInt(points.value));
                drawWave();
            });
            initSeeds(4);
            drawWave();
            document.getElementById('copy-wave-btn').addEventListener('click', () => copyText(code.innerText, document.getElementById('copy-wave-btn')));
        }
    },
    {
        id: "color-contrast",
        name: "Contrast Grader (Accessibility)",
        category: "Design & Media",
        icon: "fa-solid fa-circle-half-stroke",
        description: "Grading background and text contrast ratios client-side based on international WCAG standards.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="color-txt">Text Color</label>
                            <input type="color" id="color-txt" value="#ffffff">
                        </div>
                        <div class="form-group">
                            <label for="color-bg">Background Color</label>
                            <input type="color" id="color-bg" value="#6366f1">
                        </div>
                    </div>
                    <div class="tool-preview-panel">
                        <div class="display-frame" id="contrast-preview" style="height:120px; font-size:1.1rem; font-weight:600;">
                            Sample Preview Text
                        </div>
                        <ul class="dns-records-log">
                            <li>Contrast Ratio: <strong id="contrast-ratio-val">4.5:1</strong></li>
                            <li>Normal Text (WCAG AA): <span class="status-badge" id="wcag-aa-normal">PASS</span></li>
                            <li>Large Text (WCAG AAA): <span class="status-badge" id="wcag-aaa-large">PASS</span></li>
                        </ul>
                    </div>
                </div>
            `;
            const txtColor = document.getElementById('color-txt');
            const bgColor = document.getElementById('color-bg');
            const preview = document.getElementById('contrast-preview');
            const ratioVal = document.getElementById('contrast-ratio-val');
            
            const hexToLuminance = (hex) => {
                const r = parseInt(hex.substr(1, 2), 16) / 255;
                const g = parseInt(hex.substr(3, 2), 16) / 255;
                const b = parseInt(hex.substr(5, 2), 16) / 255;
                const a = [r, g, b].map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
                return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
            };

            const calculateContrast = () => {
                const text = txtColor.value;
                const bg = bgColor.value;
                preview.style.color = text;
                preview.style.backgroundColor = bg;
                const l1 = hexToLuminance(text);
                const l2 = hexToLuminance(bg);
                const bright = Math.max(l1, l2);
                const dark = Math.min(l1, l2);
                const ratio = (bright + 0.05) / (dark + 0.05);
                ratioVal.innerText = `${ratio.toFixed(2)}:1`;

                const aaNormal = ratio >= 4.5;
                const aaaLarge = ratio >= 4.5;
                const setBadge = (el, pass) => {
                    el.className = 'status-badge ' + (pass ? 'status-success' : 'status-danger');
                    el.innerText = pass ? 'PASS' : 'FAIL';
                };
                setBadge(document.getElementById('wcag-aa-normal'), aaNormal);
                setBadge(document.getElementById('wcag-aaa-large'), aaaLarge);
            };
            [txtColor, bgColor].forEach(el => el.addEventListener('input', calculateContrast));
            calculateContrast();
        }
    },
    {
        id: "svg-tailwind",
        name: "SVG to Tailwind CSS Converter",
        category: "Design & Media",
        icon: "fa-solid fa-wind",
        description: "Paste vector nodes to clean namespaces and map dimensions into inline Tailwind CSS class utilities.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="svg-raw-data">Paste Raw SVG Tag</label>
                            <textarea id="svg-raw-data" style="height:180px;" placeholder='<svg width="24" height="24" fill="#6366f1" xmlns="...">\n  <path d="..." />\n</svg>'></textarea>
                        </div>
                        <button id="convert-svg-tailwind-btn" class="btn btn-primary btn-block">Clean Vector Syntax</button>
                    </div>
                    <div class="tool-preview-panel">
                        <div class="code-box">
                            <div class="code-box-header">
                                <span>Output Element Code</span>
                                <button id="copy-svg-tw-btn" class="btn btn-sm btn-outline">Copy</button>
                            </div>
                            <pre><code id="svg-tailwind-output">Result...</code></pre>
                        </div>
                    </div>
                </div>
            `;
            const input = document.getElementById('svg-raw-data');
            const output = document.getElementById('svg-tailwind-output');

            document.getElementById('convert-svg-tailwind-btn').addEventListener('click', () => {
                let text = input.value.trim();
                if (!text) return;
                text = text.replace(/width="[0-9]+"/, 'class="w-6 h-6 text-indigo-500 fill-current"');
                text = text.replace(/height="[0-9]+"/, '');
                text = text.replace(/fill="[^"]+"/, '');
                output.innerText = text;
            });
            document.getElementById('copy-svg-tw-btn').addEventListener('click', () => copyText(output.innerText, document.getElementById('copy-svg-tw-btn')));
        }
    },
    {
        id: "glassmorphism",
        name: "CSS Glassmorphism template architect",
        category: "Design & Media",
        icon: "fa-solid fa-border-all",
        description: "Generate CSS variables for translucent blurred elements overlays with support for legacy browser webkits.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="glass-blur-sl">Blur Radius</label>
                            <div class="range-group">
                                <input type="range" id="glass-blur-sl" min="0" max="30" value="12">
                                <span class="range-val" id="glass-blur-val">12px</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="glass-opac-sl">Opacity (%)</label>
                            <div class="range-group">
                                <input type="range" id="glass-opac-sl" min="5" max="95" value="25">
                                <span class="range-val" id="glass-opac-val">25%</span>
                            </div>
                        </div>
                    </div>
                    <div class="tool-preview-panel">
                        <div class="display-frame" style="background:#181824;">
                            <div class="shape-blur-circle shape-bc-1"></div>
                            <div class="shape-blur-circle shape-bc-2"></div>
                            <div id="mock-glass-card" style="width:160px; height:90px; z-index:2; padding:12px; font-size:0.75rem; font-weight:600;">
                                Glass Card
                            </div>
                        </div>
                        <div class="code-box">
                            <div class="code-box-header">
                                <span>CSS Style Code</span>
                                <button id="copy-glass-btn" class="btn btn-sm btn-outline">Copy</button>
                            </div>
                            <pre><code id="glass-css-output">...</code></pre>
                        </div>
                    </div>
                </div>
            `;
            const blur = document.getElementById('glass-blur-sl');
            const opac = document.getElementById('glass-opac-sl');
            const card = document.getElementById('mock-glass-card');
            const output = document.getElementById('glass-css-output');

            const calculateGlass = () => {
                const bVal = blur.value;
                const oVal = opac.value / 100;
                document.getElementById('glass-blur-val').innerText = `${bVal}px`;
                document.getElementById('glass-opac-val').innerText = `${opac.value}%`;

                card.style.background = `rgba(255, 255, 255, ${oVal})`;
                card.style.backdropFilter = `blur(${bVal}px)`;
                card.style.webkitBackdropFilter = `blur(${bVal}px)`;
                card.style.border = `1px solid rgba(255, 255, 255, 0.15)`;
                card.style.borderRadius = `8px`;

                output.innerText = `background: rgba(255, 255, 255, ${oVal});\nbackdrop-filter: blur(${bVal}px);\n-webkit-backdrop-filter: blur(${bVal}px);\nborder: 1px solid rgba(255, 255, 255, 0.15);\nborder-radius: 8px;`;
            };
            [blur, opac].forEach(el => el.addEventListener('input', calculateGlass));
            calculateGlass();
            document.getElementById('copy-glass-btn').addEventListener('click', () => copyText(output.innerText, document.getElementById('copy-glass-btn')));
        }
    },
    {
        id: "neumorphism",
        name: "CSS Neumorphic Soft-Shadow Editor",
        category: "Design & Media",
        icon: "fa-solid fa-circle",
        description: "Configure virtual lighting levels and offsets to output code variables for Neumorphism soft-shadow elements.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="neu-shadow-offset">Shadow Offset</label>
                            <div class="range-group">
                                <input type="range" id="neu-shadow-offset" min="2" max="24" value="8">
                                <span class="range-val" id="neu-offset-val">8px</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="neu-shadow-blur">Blur Size</label>
                            <div class="range-group">
                                <input type="range" id="neu-shadow-blur" min="4" max="48" value="16">
                                <span class="range-val" id="neu-blur-val">16px</span>
                            </div>
                        </div>
                    </div>
                    <div class="tool-preview-panel">
                        <div class="display-frame" style="background:#e0e0e0;">
                            <div id="mock-neu-card" style="width:100px; height:100px; background:#e0e0e0; border-radius:16px;"></div>
                        </div>
                        <div class="code-box">
                            <div class="code-box-header">
                                <span>CSS Style Code</span>
                                <button id="copy-neu-btn" class="btn btn-sm btn-outline">Copy</button>
                            </div>
                            <pre><code id="neu-css-output">...</code></pre>
                        </div>
                    </div>
                </div>
            `;
            const offset = document.getElementById('neu-shadow-offset');
            const blur = document.getElementById('neu-shadow-blur');
            const card = document.getElementById('mock-neu-card');
            const output = document.getElementById('neu-css-output');

            const calculateNeu = () => {
                const oVal = parseInt(offset.value);
                const bVal = parseInt(blur.value);
                document.getElementById('neu-offset-val').innerText = `${oVal}px`;
                document.getElementById('neu-blur-val').innerText = `${bVal}px`;

                const sh1 = `${oVal}px ${oVal}px ${bVal}px #bebebe`;
                const sh2 = `-${oVal}px -${oVal}px ${bVal}px #ffffff`;
                card.style.boxShadow = `${sh1}, ${sh2}`;
                output.innerText = `background: #e0e0e0;\nborder-radius: 16px;\nbox-shadow: ${sh1}, ${sh2};`;
            };
            [offset, blur].forEach(el => el.addEventListener('input', calculateNeu));
            calculateNeu();
            document.getElementById('copy-neu-btn').addEventListener('click', () => copyText(output.innerText, document.getElementById('copy-neu-btn')));
        }
    },
    {
        id: "base64-compiler",
        name: "Base64 SVG & Image URI Compiler",
        category: "Design & Media",
        icon: "fa-solid fa-link",
        description: "Transform vector elements or image files client-side into base64 Data URIs copyable for CSS rules.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="base64-text-raw">Paste Vector Text / String</label>
                            <textarea id="base64-text-raw" style="height:160px;" placeholder="<svg>...</svg>"></textarea>
                        </div>
                        <button id="convert-base64-btn" class="btn btn-primary btn-block">Encode Base64 String</button>
                    </div>
                    <div class="tool-preview-panel">
                        <div class="code-box">
                            <div class="code-box-header">
                                <span>CSS Inline Background URI</span>
                                <button id="copy-base64-btn" class="btn btn-sm btn-outline">Copy</button>
                            </div>
                            <pre><code id="base64-uri-result" style="font-size:0.75rem;">data:image/svg+xml;base64,...</code></pre>
                        </div>
                    </div>
                </div>
            `;
            const input = document.getElementById('base64-text-raw');
            const result = document.getElementById('base64-uri-result');

            document.getElementById('convert-base64-btn').addEventListener('click', () => {
                const text = input.value.trim();
                if (!text) return;
                const encoded = btoa(unescape(encodeURIComponent(text)));
                result.innerText = `background-image: url("data:image/svg+xml;base64,${encoded}");`;
            });
            document.getElementById('copy-base64-btn').addEventListener('click', () => copyText(result.innerText, document.getElementById('copy-base64-btn')));
        }
    },
    {
        id: "animation-curves",
        name: "CSS Animation Easing Curve Sandbox",
        category: "Design & Media",
        icon: "fa-solid fa-bezier-curve",
        description: "Interactive canvas editor to adjust cubic-bezier handle offsets and preview speed animation runs.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="ease-cp-1">Control Point X1</label>
                            <div class="range-group">
                                <input type="range" id="ease-cp-1" min="0" max="100" value="42">
                                <span class="range-val" id="ease-cp1-val">0.42</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="ease-cp-2">Control Point X2</label>
                            <div class="range-group">
                                <input type="range" id="ease-cp-2" min="0" max="100" value="58">
                                <span class="range-val" id="ease-cp2-val">0.58</span>
                            </div>
                        </div>
                        <button id="run-ease-test" class="btn btn-primary btn-block">▶️ Run Animation Test</button>
                    </div>
                    <div class="tool-preview-panel">
                        <div class="cubic-bezier-runway">
                            <div class="cubic-bezier-ball" id="animation-ball-preview"></div>
                        </div>
                        <div class="code-box">
                            <div class="code-box-header">
                                <span>CSS Transition Style</span>
                                <button id="copy-ease-btn" class="btn btn-sm btn-outline">Copy</button>
                            </div>
                            <pre><code id="ease-css-output">...</code></pre>
                        </div>
                    </div>
                </div>
            `;
            const cp1 = document.getElementById('ease-cp-1');
            const cp2 = document.getElementById('ease-cp-2');
            const ball = document.getElementById('animation-ball-preview');
            const output = document.getElementById('ease-css-output');
            const testBtn = document.getElementById('run-ease-test');

            const calculateEase = () => {
                const x1 = cp1.value / 100;
                const x2 = cp2.value / 100;
                document.getElementById('ease-cp1-val').innerText = x1;
                document.getElementById('ease-cp2-val').innerText = x2;
                output.innerText = `transition: left 0.8s cubic-bezier(${x1}, 0, ${x2}, 1);`;
            };

            testBtn.addEventListener('click', () => {
                const x1 = cp1.value / 100;
                const x2 = cp2.value / 100;
                ball.style.transition = 'none';
                ball.style.left = '10px';
                setTimeout(() => {
                    ball.style.transition = `left 0.8s cubic-bezier(${x1}, 0, ${x2}, 1)`;
                    ball.style.left = 'calc(100% - 34px)';
                }, 50);
            });
            [cp1, cp2].forEach(el => el.addEventListener('input', calculateEase));
            calculateEase();
            document.getElementById('copy-ease-btn').addEventListener('click', () => copyText(output.innerText, document.getElementById('copy-ease-btn')));
        }
    },
    {
        id: "favicon-preview",
        name: "Browser Tab Favicon & Title Previewer",
        category: "Design & Media",
        icon: "fa-solid fa-globe",
        description: "Audit visual representation parameters for Favicon icons inside simulated mock tab panels.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="mock-tab-title-in">Mock Tab Title</label>
                            <input type="text" id="mock-tab-title-in" value="My Website">
                        </div>
                        <div class="form-group">
                            <label for="mock-favicon-icon">Favicon Emoji Icon</label>
                            <input type="text" id="mock-favicon-icon" value="🔥">
                        </div>
                    </div>
                    <div class="tool-preview-panel">
                        <div class="display-frame" style="flex-direction:column; gap:0; justify-content:center; align-items:center;">
                            <div class="mock-browser-tabs">
                                <div class="mock-tab-item">
                                    <span class="mock-tab-icon" id="mock-tab-ico-node">🔥</span>
                                    <span class="mock-tab-title" id="mock-tab-title-node">My Website</span>
                                </div>
                            </div>
                            <div class="mock-browser-address-bar">
                                🔒 https://mywebsite.com
                            </div>
                        </div>
                    </div>
                </div>
            `;
            const titleIn = document.getElementById('mock-tab-title-in');
            const iconIn = document.getElementById('mock-favicon-icon');
            const tabTitle = document.getElementById('mock-tab-title-node');
            const tabIco = document.getElementById('mock-tab-ico-node');

            const calculatePreview = () => {
                tabTitle.innerText = titleIn.value;
                tabIco.innerText = iconIn.value;
            };
            [titleIn, iconIn].forEach(el => el.addEventListener('input', calculatePreview));
            calculatePreview();
        }
    },

    // --- PRODUCTIVITY & BUSINESS ---
    {
        id: "invoice-builder",
        name: "Client Invoice Maker & PDF Manager",
        category: "Productivity & Business",
        icon: "fa-solid fa-file-invoice-dollar",
        description: "Draft line items and compute rates to print and save client receipts client-side without databases.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="inv-client">Client Name</label>
                            <input type="text" id="inv-client" value="Acme Corp">
                        </div>
                        <div class="form-group">
                            <label for="inv-desc">Item Description</label>
                            <input type="text" id="inv-desc" value="Software Consulting Service">
                        </div>
                        <div class="form-group">
                            <label for="inv-rate">Billing Rate ($)</label>
                            <input type="number" id="inv-rate" value="100">
                        </div>
                        <div class="form-group">
                            <label for="inv-hours">Hours worked</label>
                            <input type="number" id="inv-hours" value="40">
                        </div>
                        <button id="calc-invoice-btn" class="btn btn-primary btn-block">Calculate Totals</button>
                    </div>
                    <div class="tool-preview-panel">
                        <h3>Invoice Receipt Preview</h3>
                        <div class="display-frame" id="invoice-sheet-preview" style="display:block; padding:20px; font-family:monospace; font-size:0.8rem; overflow-y:auto; line-height:1.4;">
                            Press Calculate...
                        </div>
                        <button id="print-invoice-btn" class="btn btn-outline btn-block">Print Invoice</button>
                    </div>
                </div>
            `;
            const client = document.getElementById('inv-client');
            const desc = document.getElementById('inv-desc');
            const rate = document.getElementById('inv-rate');
            const hours = document.getElementById('inv-hours');
            const preview = document.getElementById('invoice-sheet-preview');

            const calculateInvoice = () => {
                const r = parseFloat(rate.value || '0');
                const h = parseFloat(hours.value || '0');
                const sum = r * h;
                const tax = sum * 0.15;
                const total = sum + tax;
                preview.innerHTML = `
INVOICE RECEIPT<br>
---------------------------------<br>
Client Target: ${client.value}<br>
Line: ${desc.value}<br>
Rate: $${r.toFixed(2)}/hr | Hours: ${h}<br>
---------------------------------<br>
Subtotal: $${sum.toFixed(2)}<br>
Tax (15%): $${tax.toFixed(2)}<br>
=================================<br>
Total Balance: $${total.toFixed(2)}
                `;
            };
            document.getElementById('calc-invoice-btn').addEventListener('click', calculateInvoice);
            calculateInvoice();
            document.getElementById('print-invoice-btn').addEventListener('click', () => window.print());
        }
    },
    {
        id: "ats-optimizer",
        name: "ATS Resume Keyword Scanner",
        category: "Productivity & Business",
        icon: "fa-solid fa-id-card",
        description: "Compare skills vectors across Resumes and Job descriptions to identify structural matches.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="ats-resume">Paste Resume Text</label>
                            <textarea id="ats-resume" style="height:100px;">Expert software engineer skilled in javascript, html, css, nextjs and docker.</textarea>
                        </div>
                        <div class="form-group">
                            <label for="ats-job">Paste Job Description</label>
                            <textarea id="ats-job" style="height:100px;">Looking for software engineer with nodejs, docker, postgres and css skillsets.</textarea>
                        </div>
                        <button id="calc-ats-btn" class="btn btn-primary btn-block">Audit ATS Score</button>
                    </div>
                    <div class="tool-preview-panel">
                        <h3>ATS Overlap Audit</h3>
                        <div class="display-frame" style="height:100px; flex-direction:column; justify-content:center; align-items:center;">
                            <div style="font-size:2rem; font-weight:800; color:var(--accent-emerald);" id="ats-pct-score">0%</div>
                            <div style="font-size:0.8rem; color:var(--text-muted);">Relevance Overlap</div>
                        </div>
                        <h3>Matched Keywords</h3>
                        <div class="ats-overlap-badges" id="ats-matches-row">Matches...</div>
                    </div>
                </div>
            `;
            const res = document.getElementById('ats-resume');
            const job = document.getElementById('ats-job');
            const score = document.getElementById('ats-pct-score');
            const matchesRow = document.getElementById('ats-matches-row');

            document.getElementById('calc-ats-btn').addEventListener('click', () => {
                const getWords = (text) => text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
                const resWords = new Set(getWords(res.value));
                const jobWords = new Set(getWords(job.value));
                const overlap = [...jobWords].filter(w => resWords.has(w));
                const pct = jobWords.size > 0 ? (overlap.length / jobWords.size) * 100 : 0;

                score.innerText = `${pct.toFixed(0)}%`;
                score.style.color = pct > 60 ? 'var(--accent-emerald)' : pct > 30 ? 'var(--accent-cyan)' : 'var(--accent-danger)';
                matchesRow.innerHTML = overlap.length > 0 ? overlap.map(w => `<span class="badge badge-accent">${w}</span>`).join('') : 'No matches found.';
            });
        }
    },
    {
        id: "freelance-calc",
        name: "Freelance Sustainable Hourly Calculator",
        category: "Productivity & Business",
        icon: "fa-solid fa-calculator",
        description: "Assess overhead margins and tax rates to compute billable hourly targets.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="fl-salary">Desired Annual Salary ($)</label>
                            <input type="number" id="fl-salary" value="60000">
                        </div>
                        <div class="form-group">
                            <label for="fl-expenses">Annual Business Expenses ($)</label>
                            <input type="number" id="fl-expenses" value="12000">
                        </div>
                        <div class="form-group">
                            <label for="fl-billable">Weekly Billable Hours</label>
                            <input type="number" id="fl-billable" value="25">
                        </div>
                        <button id="calc-rate-btn" class="btn btn-primary btn-block">Calculate Rate</button>
                    </div>
                    <div class="tool-preview-panel">
                        <h3>Calculated Target Rate</h3>
                        <div class="display-frame" style="height:120px; flex-direction:column; justify-content:center; align-items:center;">
                            <div style="font-size:2.25rem; font-weight:800; color:var(--accent-cyan);" id="fl-hourly-output">$55.38</div>
                            <div style="font-size:0.8rem; color:var(--text-muted);">Per Hour (Assuming 48 work weeks)</div>
                        </div>
                    </div>
                </div>
            `;
            const sal = document.getElementById('fl-salary');
            const exp = document.getElementById('fl-expenses');
            const bill = document.getElementById('fl-billable');
            const out = document.getElementById('fl-hourly-output');

            const calculateRate = () => {
                const s = parseFloat(sal.value || '0');
                const e = parseFloat(exp.value || '0');
                const b = parseFloat(bill.value || '1');
                const totalTarget = s + e;
                const annualHours = b * 48;
                out.innerText = `$${(totalTarget / annualHours).toFixed(2)}`;
            };
            document.getElementById('calc-rate-btn').addEventListener('click', calculateRate);
            calculateRate();
        }
    },
    {
        id: "slack-standup",
        name: "Daily Team Standup Summarizer",
        category: "Productivity & Business",
        icon: "fa-brands fa-slack",
        description: "Draft progress summaries and format slack messages matching team layout parameters.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="su-yesterday">Yesterday's Progress</label>
                            <input type="text" id="su-yesterday" value="Built docker configurations and tested localhost.">
                        </div>
                        <div class="form-group">
                            <label for="su-today">Today's Agenda</label>
                            <input type="text" id="su-today" value="Writing all 30 tool layout javascript templates.">
                        </div>
                        <div class="form-group">
                            <label for="su-blockers">Blocker Alerts</label>
                            <input type="text" id="su-blockers" value="None.">
                        </div>
                        <button id="su-btn" class="btn btn-primary btn-block">Format Report</button>
                    </div>
                    <div class="tool-preview-panel">
                        <div class="code-box">
                            <div class="code-box-header">
                                <span>Slack Text Result</span>
                                <button id="copy-su-btn" class="btn btn-sm btn-outline">Copy</button>
                            </div>
                            <pre><code id="su-output">...</code></pre>
                        </div>
                    </div>
                </div>
            `;
            const yest = document.getElementById('su-yesterday');
            const tod = document.getElementById('su-today');
            const block = document.getElementById('su-blockers');
            const out = document.getElementById('su-output');

            const makeStandup = () => {
                out.innerText = `*DAILY STANDUP REPORT*\n\n*1. Yesterday:*\n- ${yest.value}\n\n*2. Today:*\n- ${tod.value}\n\n*3. Blockers:*\n- ${block.value}`;
            };
            document.getElementById('su-btn').addEventListener('click', makeStandup);
            makeStandup();
            document.getElementById('copy-su-btn').addEventListener('click', () => copyText(out.innerText, document.getElementById('copy-su-btn')));
        }
    },
    {
        id: "markdown-slides",
        name: "Markdown presentation Slide Deck Builder",
        category: "Productivity & Business",
        icon: "fa-solid fa-desktop",
        description: "Render markdown document text splits instantly into styled slides decks.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="slides-md-data">Slides Markdown (Separated by ---)</label>
                            <textarea id="slides-md-data" style="height:140px;" placeholder="# Slide 1\\nInfo here...\\n---\\n# Slide 2\\nNext details..."></textarea>
                        </div>
                        <button id="load-slides-btn" class="btn btn-primary btn-block">Compile Deck</button>
                    </div>
                    <div class="tool-preview-panel">
                        <div class="display-frame">
                            <div class="presentation-slide-deck">
                                <div class="slide-content-pane" id="slide-viewer">Slide 1 Contents</div>
                                <div class="slide-nav-controls">
                                    <button class="btn btn-sm btn-outline" id="slide-prev">Back</button>
                                    <span id="slide-idx">1 / 1</span>
                                    <button class="btn btn-sm btn-outline" id="slide-next">Next</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            const dataIn = document.getElementById('slides-md-data');
            const viewer = document.getElementById('slide-viewer');
            const prev = document.getElementById('slide-prev');
            const next = document.getElementById('slide-next');
            const idx = document.getElementById('slide-idx');

            let slideList = ["# Slide 1\nReady to present."];
            let active = 0;
            const renderSlide = () => {
                viewer.innerText = slideList[active] || 'Empty';
                idx.innerText = `${active + 1} / ${slideList.length}`;
            };
            document.getElementById('load-slides-btn').addEventListener('click', () => {
                const text = dataIn.value.trim();
                if (!text) return;
                slideList = text.split(/\n---\n/);
                active = 0;
                renderSlide();
            });
            prev.addEventListener('click', () => {
                if (active > 0) { active--; renderSlide(); }
            });
            next.addEventListener('click', () => {
                if (active < slideList.length - 1) { active++; renderSlide(); }
            });
            dataIn.value = "# Welcome to OmniTool\nPresenting all 30 tools.\n---\n# Slide 2\n100% Client-side and responsive.";
            slideList = dataIn.value.split(/\n---\n/);
            renderSlide();
        }
    },
    {
        id: "markdown-tasks",
        name: "Markdown Task List Exporter",
        category: "Productivity & Business",
        icon: "fa-solid fa-list-check",
        description: "Visual checkbox manager that outputs structured GitHub-style task arrays.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="new-task-title">Add Checklist item</label>
                            <input type="text" id="new-task-title" placeholder="Buy server hosting...">
                        </div>
                        <button id="add-task-btn" class="btn btn-primary btn-block">Add Item</button>
                        <ul class="checklist-list" id="checklist-render"></ul>
                    </div>
                    <div class="tool-preview-panel">
                        <div class="code-box">
                            <div class="code-box-header">
                                <span>Output Markdown</span>
                                <button id="copy-tasks-md-btn" class="btn btn-sm btn-outline">Copy</button>
                            </div>
                            <pre><code id="tasks-md-output">- [ ] Task 1</code></pre>
                        </div>
                    </div>
                </div>
            `;
            const title = document.getElementById('new-task-title');
            const list = document.getElementById('checklist-render');
            const output = document.getElementById('tasks-md-output');

            let items = [{ text: "Write core code", done: true }, { text: "Rebuild docker environment", done: false }];
            const drawTasks = () => {
                list.innerHTML = '';
                let md = '';
                items.forEach((it, idx) => {
                    const li = document.createElement('li');
                    li.className = 'checklist-item';
                    li.innerHTML = `<input type="checkbox" ${it.done ? 'checked' : ''} id="check-${idx}"> <span>${it.text}</span>`;
                    li.querySelector('input').addEventListener('change', (e) => {
                        items[idx].done = e.target.checked;
                        drawTasks();
                    });
                    list.appendChild(li);
                    md += `- [${it.done ? 'x' : ' '}] ${it.text}\n`;
                });
                output.innerText = md.trim() || 'No tasks.';
            };
            document.getElementById('add-task-btn').addEventListener('click', () => {
                const text = title.value.trim();
                if (!text) return;
                items.push({ text, done: false });
                title.value = '';
                drawTasks();
            });
            drawTasks();
            document.getElementById('copy-tasks-md-btn').addEventListener('click', () => copyText(output.innerText, document.getElementById('copy-tasks-md-btn')));
        }
    },
    {
        id: "title-scorer",
        name: "Reddit & HackerNews Title Scorer",
        category: "Productivity & Business",
        icon: "fa-solid fa-ranking-star",
        description: "Analyze post headlines for emotional power terms, formatting limits, and readability score index.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="title-input-box">HackerNews / Reddit Post Title</label>
                            <input type="text" id="title-input-box" value="Show HN: OmniTool Hub - 30+ Free Responsive Client-Side Developer Utilities">
                        </div>
                        <button id="grade-title-btn" class="btn btn-primary btn-block">Analyze Engagement Score</button>
                    </div>
                    <div class="tool-preview-panel">
                        <h3>Headline Engagement Quality</h3>
                        <div class="display-frame" style="height:120px; flex-direction:column; justify-content:center; align-items:center;">
                            <div style="font-size:2rem; font-weight:800; color:var(--accent-purple);" id="title-rating-val">82/100</div>
                            <div style="font-size:0.8rem; color:var(--text-muted);" id="title-summary-label">High Virality Potential</div>
                        </div>
                    </div>
                </div>
            `;
            const input = document.getElementById('title-input-box');
            const rate = document.getElementById('title-rating-val');
            const summary = document.getElementById('title-summary-label');

            document.getElementById('grade-title-btn').addEventListener('click', () => {
                const t = input.value.trim();
                let score = 50;
                if (t.length > 30 && t.length < 80) score += 20;
                else if (t.length >= 80) score += 5;
                if (t.toLowerCase().includes("show hn:") || t.toLowerCase().includes("ask hn:")) score += 15;
                const power = ["free", "how to", "responsive", "developer", "tool", "show", "release", "open source"];
                power.forEach(word => {
                    if (t.toLowerCase().includes(word)) score += 5;
                });
                const finalScore = Math.min(100, score);
                rate.innerText = `${finalScore}/100`;
                summary.innerText = finalScore > 75 ? "Excellent Headline Reach!" : finalScore > 50 ? "Moderate Reach Potential" : "Needs Optimization";
            });
        }
    },

    // --- NICHE UTILITIES ---
    {
        id: "email-dns",
        name: "SPF, DKIM & DMARC Checker",
        category: "Niche Utilities",
        icon: "fa-solid fa-shield-halved",
        description: "Query public DNS over HTTPS APIs to audit domain deliverability records configurations.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="dns-domain-in">Target Domain</label>
                            <input type="text" id="dns-domain-in" value="google.com">
                        </div>
                        <button id="query-dns-btn" class="btn btn-primary btn-block">Audit DNS Security</button>
                    </div>
                    <div class="tool-preview-panel">
                        <h3>DNS Deliverability Log</h3>
                        <ul class="dns-records-log" id="dns-results">
                            <li>Domain status checks appear here...</li>
                        </ul>
                    </div>
                </div>
            `;
            const domain = document.getElementById('dns-domain-in');
            const log = document.getElementById('dns-results');

            document.getElementById('query-dns-btn').addEventListener('click', async () => {
                const dom = domain.value.trim();
                if (!dom) return;
                log.innerHTML = `<li>🔍 Resolving records for ${dom}...</li>`;
                try {
                    const res = await fetch(`https://dns.google/resolve?name=${dom}&type=TXT`);
                    if (res.ok) {
                        const data = await res.json();
                        let html = '';
                        if (data.Answer) {
                            data.Answer.forEach(ans => {
                                if (ans.data.includes('v=spf1')) {
                                    html += `<li style="border-left:4px solid var(--accent-emerald)">🟢 SPF: ${ans.data}</li>`;
                                } else if (ans.data.includes('v=DMARC1')) {
                                    html += `<li style="border-left:4px solid var(--accent-emerald)">🟢 DMARC: ${ans.data}</li>`;
                                } else {
                                    html += `<li>TXT: ${ans.data.substring(0, 80)}...</li>`;
                                }
                            });
                        }
                        log.innerHTML = html || `<li>⚠️ No deliverability security records found.</li>`;
                    } else {
                        log.innerHTML = `<li>❌ DNS Query resolution failed.</li>`;
                    }
                } catch (e) {
                    log.innerHTML = `<li>❌ Network issue querying DNS.</li>`;
                }
            });
        }
    },
    {
        id: "macro-calc",
        name: "Calorie & Macro Budget Simulator",
        category: "Niche Utilities",
        icon: "fa-solid fa-heart-pulse",
        description: "Assess daily calorie macro budgets allocations based on personal target formulas.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="mc-weight">Body Weight (kg)</label>
                            <input type="number" id="mc-weight" value="70">
                        </div>
                        <div class="form-group">
                            <label for="mc-height">Height (cm)</label>
                            <input type="number" id="mc-height" value="175">
                        </div>
                        <div class="form-group">
                            <label for="mc-age">Age (Years)</label>
                            <input type="number" id="mc-age" value="25">
                        </div>
                        <button id="calc-macro-btn" class="btn btn-primary btn-block">Calculate Budget</button>
                    </div>
                    <div class="tool-preview-panel">
                        <h3>Simulated Daily Budget</h3>
                        <div class="display-frame" style="height:100px; flex-direction:column; justify-content:center;">
                            <div style="font-size:2rem; font-weight:800; color:var(--accent-purple);" id="mc-calories-val">2,100 kcal</div>
                            <div style="font-size:0.8rem; color:var(--text-muted);">Recommended Intake</div>
                        </div>
                        <ul class="dns-records-log">
                            <li>Protein (30%): <strong id="mc-prot">157g</strong></li>
                            <li>Carbohydrate (45%): <strong id="mc-carb">236g</strong></li>
                            <li>Fats (25%): <strong id="mc-fats">58g</strong></li>
                        </ul>
                    </div>
                </div>
            `;
            const wt = document.getElementById('mc-weight');
            const ht = document.getElementById('mc-height');
            const age = document.getElementById('mc-age');
            const cal = document.getElementById('mc-calories-val');

            const calculateMacro = () => {
                const w = parseFloat(wt.value || '70');
                const h = parseFloat(ht.value || '175');
                const a = parseFloat(age.value || '25');
                const bmr = 10 * w + 6.25 * h - 5 * a + 5;
                const maintenance = Math.round(bmr * 1.375);
                cal.innerText = `${maintenance.toLocaleString()} kcal`;
                document.getElementById('mc-prot').innerText = `${Math.round((maintenance * 0.3) / 4)}g`;
                document.getElementById('mc-carb').innerText = `${Math.round((maintenance * 0.45) / 4)}g`;
                document.getElementById('mc-fats').innerText = `${Math.round((maintenance * 0.25) / 9)}g`;
            };
            document.getElementById('calc-macro-btn').addEventListener('click', calculateMacro);
            calculateMacro();
        }
    },
    {
        id: "robots-checker",
        name: "Robots.txt Path Validator",
        category: "Niche Utilities",
        icon: "fa-solid fa-robot",
        description: "Paste robots.txt guidelines to validate if URL paths are blocked for search crawlers.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="robots-rules">Paste robots.txt Content</label>
                            <textarea id="robots-rules" style="height:120px;" placeholder="User-agent: *\nDisallow: /admin/\nDisallow: /private/"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="robots-path">Test URL Path</label>
                            <input type="text" id="robots-path" value="/admin/dashboard">
                        </div>
                        <button id="check-robots-btn" class="btn btn-primary btn-block">Check Access Permission</button>
                    </div>
                    <div class="tool-preview-panel">
                        <h3>Crawl Indexing Status</h3>
                        <div class="display-frame" id="robots-status-frame" style="height:120px; font-weight:700; font-size:1.25rem;">
                            ALLOWED
                        </div>
                    </div>
                </div>
            `;
            const rules = document.getElementById('robots-rules');
            const path = document.getElementById('robots-path');
            const frame = document.getElementById('robots-status-frame');

            document.getElementById('check-robots-btn').addEventListener('click', () => {
                const p = path.value.trim();
                const text = rules.value.trim().toLowerCase();
                let allowed = true;
                const disallows = [...text.matchAll(/disallow:\s*([^\n]+)/g)].map(m => m[1].trim());

                disallows.forEach(rule => {
                    const cleanRule = rule.replace('*', '.*');
                    const regex = new RegExp(`^${cleanRule}`);
                    if (regex.test(p.toLowerCase())) allowed = false;
                });
                if (allowed) {
                    frame.innerText = "🟢 CRAWL ALLOWED";
                    frame.style.color = "var(--accent-emerald)";
                } else {
                    frame.innerText = "❌ CRAWL BLOCKED";
                    frame.style.color = "var(--accent-danger)";
                }
            });
        }
    },
    {
        id: "youtube-chapters",
        name: "YouTube Chapters Timeline Builder",
        category: "Niche Utilities",
        icon: "fa-brands fa-youtube",
        description: "Parse timestamp lines from video transcripts to sort and build structured YouTube Chapters descriptors.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="yt-transcript">Paste raw timestamp markers</label>
                            <textarea id="yt-transcript" style="height:140px;" placeholder="03:45 Project details\n00:00 Introduction\n11:20 Demo run"></textarea>
                        </div>
                        <button id="format-chapters-btn" class="btn btn-primary btn-block">Verify & Sort Chapters</button>
                    </div>
                    <div class="tool-preview-panel">
                        <div class="code-box">
                            <div class="code-box-header">
                                <span>Sorted Output Timeline</span>
                                <button id="copy-yt-btn" class="btn btn-sm btn-outline">Copy</button>
                            </div>
                            <pre><code id="yt-output-block">00:00 Introduction\n03:45 Project details...</code></pre>
                        </div>
                    </div>
                </div>
            `;
            const input = document.getElementById('yt-transcript');
            const output = document.getElementById('yt-output-block');

            document.getElementById('format-chapters-btn').addEventListener('click', () => {
                const lines = input.value.trim().split('\n');
                let matches = [];
                lines.forEach(l => {
                    const m = l.match(/(\d{1,2}:\d{2}(?::\d{2})?)\s+(.+)/);
                    if (m) matches.push({ time: m[1], desc: m[2].trim() });
                });
                matches.sort((a, b) => {
                    const getSec = (t) => t.split(':').reduce((acc, val) => (60 * acc) + parseInt(val), 0);
                    return getSec(a.time) - getSec(b.time);
                });
                let formatted = '';
                matches.forEach(m => { formatted += `${m.time} ${m.desc}\n`; });
                output.innerText = formatted.trim() || 'No timestamps found. Make sure format is like 00:00 Intro';
            });
            document.getElementById('copy-yt-btn').addEventListener('click', () => copyText(output.innerText, document.getElementById('copy-yt-btn')));
        }
    },
    {
        id: "pdf-invoice",
        name: "Client-Side PDF Data Extractor",
        category: "Niche Utilities",
        icon: "fa-solid fa-file-pdf",
        description: "Secure textual scan matching parameters inside PDF invoice strings to output JSON tables.",
        render: (container) => {
            container.innerHTML = `
                <div class="tool-grid-split">
                    <div class="tool-params-panel">
                        <div class="form-group">
                            <label for="pdf-txt-raw">Paste Copied Invoice Text</label>
                            <textarea id="pdf-txt-raw" style="height:150px;" placeholder="Invoice ID: INV-2026\nDate: July 7, 2026\nTotal amount due: $150.00"></textarea>
                        </div>
                        <button id="extract-pdf-btn" class="btn btn-primary btn-block">Parse Metadata</button>
                    </div>
                    <div class="tool-preview-panel">
                        <div class="code-box">
                            <div class="code-box-header">
                                <span>Parsed JSON Output</span>
                                <button id="copy-pdf-json-btn" class="btn btn-sm btn-outline">Copy</button>
                            </div>
                            <pre><code id="pdf-json-out">{}</code></pre>
                        </div>
                    </div>
                </div>
            `;
            const text = document.getElementById('pdf-txt-raw');
            const out = document.getElementById('pdf-json-out');

            document.getElementById('extract-pdf-btn').addEventListener('click', () => {
                const val = text.value;
                const id = val.match(/inv(?:oice)?(?:[\s#:-]+)([a-z0-9-]+)/i)?.[1] || 'Unknown';
                const total = val.match(/(?:total|amount)(?:[\s$:-]+)([0-9,.]+)/i)?.[1] || 'Unknown';
                const date = val.match(/date(?:[\s:-]+)([^\n]+)/i)?.[1] || 'Unknown';
                out.innerText = JSON.stringify({ invoiceId: id, totalAmount: total, invoiceDate: date.trim() }, null, 2);
            });
            document.getElementById('copy-pdf-json-btn').addEventListener('click', () => copyText(out.innerText, document.getElementById('copy-pdf-json-btn')));
        }
    }
];

// Helper: Call AI with key-override checking and backend server route fallbacks
async function callAI(prompt, systemInstruction = "") {
    // If a user key is supplied locally in API Settings, query Gemini direct
    if (apiKey) {
        try {
            const combined = systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt;
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: combined }] }] })
            });
            if (res.ok) {
                const data = await res.json();
                return data.candidates[0].content.parts[0].text.trim();
            }
        } catch (e) {
            console.error("Local Gemini Key error, falling back to server...", e);
        }
    }

    // Call express backend endpoint with fallback functionality
    const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemInstruction })
    });
    if (!res.ok) throw new Error("Backend generation failed");
    const data = await res.json();
    return data.text;
}

// Copy Action Helper
function copyText(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fa-solid fa-circle-check"></i> Copied!';
        button.classList.add('status-success');
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('status-success');
        }, 1500);
    });
}

// Fetch and Render Free APIs Directory
async function renderApiDirectory() {
    const listGrid = document.getElementById('api-list-grid');
    listGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center;"><span class="spinner"></span> Querying API Directory list...</div>';
    
    try {
        const res = await fetch('/api/free-apis');
        if (!res.ok) throw new Error("API Directory resolution failed");
        const list = await res.json();
        
        listGrid.innerHTML = '';
        list.forEach((api, idx) => {
            const card = document.createElement('div');
            card.className = 'api-card glass-panel';
            card.innerHTML = `
                <span class="api-card-category-badge">${api.category}</span>
                <div class="api-card-header-row">
                    <h3 class="api-card-title">${api.name}</h3>
                    <span class="status-badge status-success">${api.speed}</span>
                </div>
                <p class="api-card-desc">${api.description}</p>
                <div class="api-card-specs">
                    <div class="spec-line">
                        <span>Free Tier:</span>
                        <span class="spec-val rate">${api.freeTier}</span>
                    </div>
                </div>
                <div class="code-box">
                    <div class="code-box-header">
                        <span class="code-box-title">Fetch Snippet</span>
                        <button class="btn btn-sm btn-outline api-copy-btn" id="api-copy-${idx}">Copy</button>
                    </div>
                    <pre><code style="font-size:0.75rem;" id="api-code-${idx}">${api.code}</code></pre>
                </div>
            `;
            listGrid.appendChild(card);
            
            // Add click listener to copy code
            card.querySelector(`.api-copy-btn`).addEventListener('click', (e) => {
                copyText(api.code, e.currentTarget);
            });
        });
    } catch (e) {
        listGrid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; color:var(--accent-danger);">❌ Failed to load API list directory.</div>`;
    }
}

// Render Homepage Catalog with category sections
function renderCatalog(searchQuery = '') {
    categoriesContainer.innerHTML = '';
    
    const groups = {};
    tools.forEach(t => {
        if (!groups[t.category]) groups[t.category] = [];
        const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              t.description.toLowerCase().includes(searchQuery.toLowerCase());
        if (matchesSearch) {
            groups[t.category].push(t);
        }
    });

    let matchesCount = 0;

    for (const [catName, items] of Object.entries(groups)) {
        if (items.length === 0) continue;
        matchesCount += items.length;

        const section = document.createElement('section');
        section.className = 'category-row-section';
        section.innerHTML = `
            <h2 class="category-row-title">${catName}</h2>
            <div class="category-row-grid"></div>
        `;
        
        const grid = section.querySelector('.category-row-grid');
        items.forEach(it => {
            const card = document.createElement('a');
            card.href = `#tool-${it.id}`;
            card.className = 'tool-card-box';
            card.innerHTML = `
                <div class="tool-card-header">
                    <div class="tool-card-category">${it.category}</div>
                    <div class="tool-card-icon-wrapper">
                        <i class="${it.icon}"></i>
                    </div>
                </div>
                <div class="tool-card-title">${it.name}</div>
                <div class="tool-card-desc">${it.description}</div>
                <div class="tool-card-footer">
                    <span>Try Tool</span>
                    <span><i class="fa-solid fa-arrow-right-long"></i></span>
                </div>
            `;
            grid.appendChild(card);
        });
        categoriesContainer.appendChild(section);
    }

    if (matchesCount === 0) {
        categoriesContainer.innerHTML = `
            <div style="text-align:center; padding:40px; border: 1px dashed var(--border-color); border-radius:12px;">
                <p style="color:var(--text-secondary)">No tools found matching your search. Try a different keyword!</p>
            </div>
        `;
    }
}

// Blogs Data
const blogPosts = [
    {
        id: "boost-developer-productivity",
        title: "How to Boost Developer Productivity with AI Micro-Tools",
        category: "AI Utilities",
        date: "July 7, 2026",
        gradient: "linear-gradient(135deg, var(--accent-indigo), var(--accent-purple))",
        excerpt: "Learn how modern AI converters, calculators, and schema builders can speed up your web development flow.",
        content: `
            <p>Artificial Intelligence is no longer just a buzzword. For developers, it manifests as incredibly helpful micro-tools that solve specific, repetitive problems. In this post, we'll dive into how you can use tools like Zod schema generators, regular expression testers, and cron visualizers to eliminate bottlenecks in your development cycle.</p>
            <h3>1. Automating the Schema Boilerplate</h3>
            <p>One of the most time-consuming parts of working with modern API endpoints is typing. You receive a massive JSON payload and need to write TypeScript interfaces and validation schemas for it. Using an automatic JSON-to-Zod compiler lets you generate perfect code in under a second.</p>
            <h3>2. Visualizing Cron Schedules Instantly</h3>
            <p>Reading cron syntax like <code>*/15 8-18 * * 1-5</code> can be error-prone. A cron visualizer translates this logic into human-readable sentences, preventing mistakes in background task planning.</p>
            <h3>Conclusion</h3>
            <p>By keeping a set of responsive, local, privacy-first developer tools in your utility belt, you save countless context switches and protect your sensitive data from being uploaded to external API engines.</p>
        `
    },
    {
        id: "privacy-first-local-tools",
        title: "Why Privacy-First Local Utilities Matter for Tech Teams",
        category: "Security",
        date: "July 5, 2026",
        gradient: "linear-gradient(135deg, var(--accent-cyan), var(--accent-emerald))",
        excerpt: "Pasting client data into random formatting websites poses security risks. Discover the safety of client-side operations.",
        content: `
            <p>When you're formatting JSON, beautifying SQL, or testing regex, it is tempting to use the first Google result. However, many of these websites log and store everything you paste into their input forms. This is a severe threat if you are working with database exports, personal client data, or proprietary business logic.</p>
            <h3>The Danger of Third-Party Processing</h3>
            <p>Many legacy conversion sites process data on the server side, meaning your text is transmitted across the internet and stored in database logs. If these sites are compromised, your data could leak.</p>
            <h3>How Client-Side Apps Keep You Safe</h3>
            <p>A privacy-first tool runs the code entirely in your web browser. JavaScript parses the input locally without ever making a network request to an external server. This guarantees that your sensitive keys, passwords, and user information never leave your local machine.</p>
        `
    },
    {
        id: "understanding-ai-apis",
        title: "Understanding Serverless AI Models & Free Tiers",
        category: "AI Integration",
        date: "July 3, 2026",
        gradient: "linear-gradient(135deg, var(--accent-pink), var(--accent-purple))",
        excerpt: "A complete guide on utilizing model providers like Gemini, Cohere, and Groq to add artificial intelligence to apps.",
        content: `
            <p>Building AI apps doesn't require renting expensive GPUs anymore. Modern API gateways allow you to connect directly to models via standard REST endpoints. Many providers offer generous free tiers to help developers test and build prototypes.</p>
            <h3>Finding the Best Free Tiers</h3>
            <p>In our Free AI API Directory, we catalog the top platforms. Providers like Google AI Studio (Gemini), Groq (running Llama 3), and Hugging Face offer rate-limited endpoints suitable for hobby projects and startup MVPs.</p>
            <h3>Authentication and Local Keys</h3>
            <p>When deploying frontend applications, never hardcode your API keys. Instead, allow users to provide their own keys securely in their browser's storage, ensuring rates are handled correctly and keys aren't exposed publicly.</p>
        `
    }
];

function renderBlogsList() {
    blogsContentContainer.innerHTML = `
        <section class="api-hero-banner glass-panel" style="margin-bottom: 32px;">
            <h2>Developer & AI Insights</h2>
            <p>Stay ahead with practical guides, tutorials, and insights on web utilities, API integrations, and developer productivity.</p>
        </section>
        <div class="blogs-grid">
            ${blogPosts.map(post => `
                <article class="blog-card">
                    <div class="blog-card-image" style="background: ${post.gradient};">
                        <span class="blog-card-category">${post.category}</span>
                    </div>
                    <div class="blog-card-content">
                        <span class="blog-card-date">${post.date}</span>
                        <h3 class="blog-card-title">${post.title}</h3>
                        <p class="blog-card-excerpt">${post.excerpt}</p>
                        <a href="#blog-${post.id}" class="blog-card-readmore">Read More <i class="fa-solid fa-arrow-right"></i></a>
                    </div>
                </article>
            `).join('')}
        </div>
    `;
}

function renderBlogPost(blogId) {
    const post = blogPosts.find(p => p.id === blogId);
    if (!post) {
        location.hash = '#blogs';
        return;
    }

    blogsContentContainer.innerHTML = `
        <button class="blog-back-btn" onclick="location.hash='#blogs'"><i class="fa-solid fa-arrow-left"></i> Back to Blogs</button>
        <article class="blog-full-view">
            <header class="blog-full-header">
                <div class="blog-full-meta">
                    <span><i class="fa-solid fa-folder-open"></i> ${post.category}</span>
                    <span><i class="fa-solid fa-calendar-days"></i> ${post.date}</span>
                </div>
                <h1 class="blog-full-title">${post.title}</h1>
            </header>
            <div class="blog-full-image" style="background: ${post.gradient};"></div>
            <div class="blog-full-content">
                ${post.content}
            </div>
        </article>
    `;
}

// Router routing
function loadToolPage(toolId) {
    const target = tools.find(t => t.id === toolId);
    if (!target) {
        location.hash = '#home';
        return;
    }

    // Toggle panel view visibility
    catalogView.classList.add('hidden');
    apiDirectoryView.classList.add('hidden');
    if (blogsView) blogsView.classList.add('hidden');
    toolView.classList.remove('hidden');

    // Set headers text details and header vector icon
    breadcrumbCat.innerText = target.category;
    breadcrumbTool.innerText = target.name;
    activeToolTitle.innerText = target.name;
    activeToolDesc.innerText = target.description;
    activeToolIconContainer.innerHTML = `<i class="${target.icon}"></i>`;

    workspaceContainer.innerHTML = '';
    target.render(workspaceContainer);

    // Build related tools list sidebar links with matching vector icons
    const related = tools.filter(t => t.category === target.category && t.id !== target.id).slice(0, 5);
    relatedToolsList.innerHTML = '';
    
    if (related.length > 0) {
        related.forEach(r => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#tool-${r.id}" class="related-tool-item-link"><i class="${r.icon}"></i> ${r.name}</a>`;
            relatedToolsList.appendChild(li);
        });
    } else {
        relatedToolsList.innerHTML = '<li>No related tools.</li>';
    }

    // Scroll page back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Init hash change routing
function route() {
    const hash = location.hash;
    
    // Reset active link styling
    navHomeLink.classList.remove('active');
    navApisLink.classList.remove('active');
    if (navBlogsLink) navBlogsLink.classList.remove('active');
    if (navBlogsDrawerLink) navBlogsDrawerLink.classList.remove('active');

    if (!hash || hash === '#home' || hash === '') {
        navHomeLink.classList.add('active');
        catalogView.classList.remove('hidden');
        apiDirectoryView.classList.add('hidden');
        if (blogsView) blogsView.classList.add('hidden');
        toolView.classList.add('hidden');
        renderCatalog(toolSearchInput.value);
    } else if (hash === '#apis') {
        navApisLink.classList.add('active');
        catalogView.classList.add('hidden');
        apiDirectoryView.classList.remove('hidden');
        if (blogsView) blogsView.classList.add('hidden');
        toolView.classList.add('hidden');
        renderApiDirectory();
    } else if (hash === '#blogs') {
        if (navBlogsLink) navBlogsLink.classList.add('active');
        if (navBlogsDrawerLink) navBlogsDrawerLink.classList.add('active');
        catalogView.classList.add('hidden');
        apiDirectoryView.classList.add('hidden');
        toolView.classList.add('hidden');
        if (blogsView) {
            blogsView.classList.remove('hidden');
            renderBlogsList();
        }
    } else if (hash.startsWith('#blog-')) {
        if (navBlogsLink) navBlogsLink.classList.add('active');
        if (navBlogsDrawerLink) navBlogsDrawerLink.classList.add('active');
        catalogView.classList.add('hidden');
        apiDirectoryView.classList.add('hidden');
        toolView.classList.add('hidden');
        if (blogsView) {
            blogsView.classList.remove('hidden');
            const blogId = hash.replace('#blog-', '');
            renderBlogPost(blogId);
        }
    } else if (hash.startsWith('#tool-')) {
        const id = hash.replace('#tool-', '');
        if (blogsView) blogsView.classList.add('hidden');
        loadToolPage(id);
    }
}

// Mobile drawer helpers
function closeDrawer() {
    mobileDrawer.classList.add('hidden');
}

// Event Listeners
window.addEventListener('hashchange', route);
toolSearchInput.addEventListener('input', () => renderCatalog(toolSearchInput.value));

// Mobile toggle controls
mobileMenuToggle.addEventListener('click', () => {
    mobileDrawer.classList.remove('hidden');
});

document.getElementById('close-drawer-btn').addEventListener('click', closeDrawer);

drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
});

// API Settings Overlay Panels Toggle
if (toggleSettingsBtn) {
    toggleSettingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
        if (apiKey) apiKeyInput.value = apiKey;
    });
}

if (drawerSettingsBtn) {
    drawerSettingsBtn.addEventListener('click', () => {
        closeDrawer();
        settingsModal.classList.remove('hidden');
        if (apiKey) apiKeyInput.value = apiKey;
    });
}

document.getElementById('close-settings-btn').addEventListener('click', () => {
    settingsModal.classList.add('hidden');
});

toggleKeyVisibilityBtn.addEventListener('click', () => {
    const eyeIcon = toggleKeyVisibilityBtn.querySelector('i');
    if (apiKeyInput.type === 'password') {
        apiKeyInput.type = 'text';
        eyeIcon.className = 'fa-solid fa-eye-slash';
    } else {
        apiKeyInput.type = 'password';
        eyeIcon.className = 'fa-solid fa-eye';
    }
});

saveSettingsBtn.addEventListener('click', () => {
    const val = apiKeyInput.value.trim();
    if (val) {
        apiKey = val;
        localStorage.setItem('vibeprompt_api_key', val);
        keyStatusText.className = 'status-badge status-success';
        keyStatusText.innerText = 'Connected';
    } else {
        apiKey = '';
        localStorage.removeItem('vibeprompt_api_key');
        keyStatusText.className = 'status-badge status-warning';
        keyStatusText.innerText = 'Using Backend API';
    }
    setTimeout(() => {
        settingsModal.classList.add('hidden');
    }, 600);
});

// Initial boot
route();
if (apiKey) {
    keyStatusText.className = 'status-badge status-success';
    keyStatusText.innerText = 'Connected';
}
