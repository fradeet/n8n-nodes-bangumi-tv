const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const API_URL = 'https://bangumi.github.io/api/dist.json';
const OUTPUT_DIR = path.join(__dirname, '..', 'docs', 'bangumi-api');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'dist.json');

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('正在从', API_URL, '下载 Bangumi API 规范...');

const curlCommand = `curl -L -o "${OUTPUT_FILE}" "${API_URL}"`;

exec(curlCommand, (error, stdout, stderr) => {
  if (error) {
    console.error('下载失败:', error.message);
    process.exit(1);
  }
  
  if (fs.existsSync(OUTPUT_FILE) && fs.statSync(OUTPUT_FILE).size > 0) {
    console.log('API 规范已保存到', OUTPUT_FILE);
  } else {
    console.error('下载失败: 文件未正确保存');
    process.exit(1);
  }
});
