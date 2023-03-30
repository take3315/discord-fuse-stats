const http = require('http');
const fs = require('fs').promises;
const { writeResultToFile } = require('./index');

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  // Call the compute function and write the result to a file
  await writeResultToFile();

  // Read the result from the file and send it as the response
  const result = await fs.readFile('result.txt', 'utf-8');
  const lines = result.split('\n').filter(line => line.trim() !== ''); // Split result by newline characters and filter out empty lines
  const html = `<h1>Computed result:</h1>\n${lines.map(line => `<p>${line}</p>`).join('\n')}`; // Convert lines to HTML paragraphs with line break tags
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(html);
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
