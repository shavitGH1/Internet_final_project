"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const PORT = process.env.PORT || 3000;
(0, index_1.default)()
    .then((app) => {
    const server = app.listen(PORT, () => {
        const address = server.address();
        if (address && typeof address === 'object') {
            console.log(`✓ Server is running on http://localhost:${address.port}`);
        }
        else {
            console.log(`✓ Server is running on port ${PORT}`);
        }
    });
    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.error(`✗ Error: Port ${PORT} is already in use. Please try a different port or close the application using this port.`);
        }
        else if (error.code === 'EACCES') {
            console.error(`✗ Error: Permission denied to use port ${PORT}. Try using a port number above 1024.`);
        }
        else {
            console.error(`✗ Server failed to start:`, error.message);
        }
        process.exit(1);
    });
})
    .catch((error) => {
    console.error('✗ Failed to initialize application:', error.message);
    process.exit(1);
});
//# sourceMappingURL=server.js.map