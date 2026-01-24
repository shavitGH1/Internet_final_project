import intApp from "./index";

const PORT = process.env.PORT || 3000;

intApp()
  .then((app) => {
    const server = app.listen(PORT, () => {
      const address = server.address();
      if (address && typeof address === 'object') {
        console.log(`✓ Server is running on http://localhost:${address.port}`);
      } else {
        console.log(`✓ Server is running on port ${PORT}`);
      }
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`✗ Error: Port ${PORT} is already in use. Please try a different port or close the application using this port.`);
      } else if (error.code === 'EACCES') {
        console.error(`✗ Error: Permission denied to use port ${PORT}. Try using a port number above 1024.`);
      } else {
        console.error(`✗ Server failed to start:`, error.message);
      }
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error('✗ Failed to initialize application:', error.message);
    process.exit(1);
  });
