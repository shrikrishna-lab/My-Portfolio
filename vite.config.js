import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const syncPlugin = () => ({
  name: 'sync-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/api/sync' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            const dataPath = path.resolve(__dirname, 'public/data.json');
            
            let existingData = {};
            if (fs.existsSync(dataPath)) {
              existingData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
            }
            
            if (data.profile) {
              existingData.profile = {
                ...existingData.profile,
                name: data.profile.name || existingData.profile?.name,
                title: data.profile.title || existingData.profile?.title,
                aboutStory: data.profile.aboutStory || existingData.profile?.aboutStory,
                characterImage: data.profile.characterImage || existingData.profile?.characterImage,
                bannerImage: data.profile.bannerImage || existingData.profile?.bannerImage,
              };
            }
            
            if (Array.isArray(data.experience)) {
              existingData.experience = data.experience.map((exp, idx) => ({
                ...exp,
                id: exp.id || `exp_${Date.now()}_${idx}`,
                skills: Array.isArray(exp.skills) ? exp.skills : (exp.skills ? String(exp.skills).split(',').map(s => s.trim()).filter(Boolean) : [])
              }));
            }
            
            if (Array.isArray(data.education)) {
              existingData.education = data.education.map((edu, idx) => ({
                ...edu,
                id: edu.id || `edu_${Date.now()}_${idx}`
              }));
            }
            
            fs.writeFileSync(dataPath, JSON.stringify(existingData, null, 2) + '\n');
            
            res.writeHead(200, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type'
            });
            res.end(JSON.stringify({ success: true, message: 'LinkedIn data synced to public/data.json successfully!' }));
          } catch (err) {
            res.writeHead(400, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type'
            });
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
      } else if (req.url === '/api/sync' && req.method === 'OPTIONS') {
        res.writeHead(204, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
      } else {
        next();
      }
    });
  }
});

export default defineConfig({
  plugins: [react(), syncPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
