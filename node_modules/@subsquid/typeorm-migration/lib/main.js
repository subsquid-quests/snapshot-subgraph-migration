"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
commander_1.program.description(`
A wrapper around TypeORM migration commands aware of squid project conventions
`.trim());
commander_1.program.command('apply', 'apply pending migrations');
commander_1.program.command('create', 'create template file for a new migration');
commander_1.program.command('generate', 'analyze database state and generate migration to match the target schema');
commander_1.program.command('revert', 'revert the last applied migration');
commander_1.program.parse();
//# sourceMappingURL=main.js.map