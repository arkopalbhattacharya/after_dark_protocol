import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env.local
const envContent = fs.readFileSync('.env.local', 'utf-8');
let supabaseUrl = '';
let supabaseAnonKey = '';

envContent.split('\n').forEach(line => {
  if (line.startsWith('VITE_SUPABASE_URL=')) {
    supabaseUrl = line.replace('VITE_SUPABASE_URL=', '').trim();
  }
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) {
    supabaseAnonKey = line.replace('VITE_SUPABASE_ANON_KEY=', '').trim();
  }
});

console.log('Target Supabase URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runSeed() {
  // Read raw seed data from src/data/initialNewsData.ts
  const rawFile = fs.readFileSync('src/data/initialNewsData.ts', 'utf-8');
  
  // Extract articles by regex or parsing
  const articlesMatch = rawFile.match(/const RAW_INITIAL_ARTICLES: NewsArticle\[\] = (\[[\s\S]*?\]);\n\n/);
  
  let articles = [];
  if (articlesMatch) {
    // Clean up TypeScript annotations if needed
    const cleaned = articlesMatch[1]
      .replace(/'/g, '"')
      .replace(/(\w+):/g, '"$1":')
      .replace(/,\s*([\]}])/g, '$1');
    try {
      articles = JSON.parse(cleaned);
    } catch (e) {
      console.log('JSON parse error, falling back to manual regex extraction...');
    }
  }

  // Regex fallback parser if needed
  if (!articles || articles.length === 0) {
    const articleBlocks = rawFile.match(/\{[\s\S]*?id:\s*'[\s\S]*?\}/g) || [];
    console.log(`Found ${articleBlocks.length} article blocks via regex`);
    
    const now = Date.now();
    const maxSpanMs = 11.5 * 60 * 60 * 1000;
    
    articles = articleBlocks.map((block, idx) => {
      const getField = (name) => {
        const m = block.match(new RegExp(`${name}:\\s*'([\\s\\S]*?)'`));
        return m ? m[1] : '';
      };
      
      const ageMs = Math.min((idx + 1) * (maxSpanMs / articleBlocks.length), maxSpanMs);
      
      return {
        id: getField('id') || `seed-${idx}`,
        source_id: getField('sourceId') || 'PLANETARY_AFFAIRS',
        headline: getField('headline'),
        content: getField('content'),
        planet_or_sector: getField('planetOrSector') || 'SOLAR_CORE',
        timestamp: new Date(now - ageMs).toISOString(),
        tag: getField('tag') || 'WIRE',
        urgency: getField('urgency') || 'ROUTINE',
        author_or_wire: getField('authorOrWire') || 'ORBITAL_TIMES'
      };
    });
  } else {
    const now = Date.now();
    const maxSpanMs = 11.5 * 60 * 60 * 1000;
    articles = articles.map((a, idx) => {
      const ageMs = Math.min((idx + 1) * (maxSpanMs / articles.length), maxSpanMs);
      return {
        id: a.id,
        source_id: a.sourceId || a.source_id,
        headline: a.headline,
        content: a.content,
        planet_or_sector: a.planetOrSector || a.planet_or_sector,
        timestamp: new Date(now - ageMs).toISOString(),
        tag: a.tag,
        urgency: a.urgency,
        author_or_wire: a.authorOrWire || a.author_or_wire
      };
    });
  }

  console.log(`Prepared ${articles.length} news articles for Supabase upload.`);

  // Upload in chunks of 25
  const chunkSize = 25;
  for (let i = 0; i < articles.length; i += chunkSize) {
    const chunk = articles.slice(i, i + chunkSize);
    const { data, error } = await supabase.from('universal_news').upsert(chunk);
    if (error) {
      console.error(`Chunk ${i / chunkSize + 1} failed:`, error.message);
    } else {
      console.log(`Chunk ${i / chunkSize + 1} (${chunk.length} items) uploaded successfully.`);
    }
  }

  // Verify count
  const { count, error: countErr } = await supabase
    .from('universal_news')
    .select('*', { count: 'exact', head: true });

  if (countErr) {
    console.error('Count verification error:', countErr.message);
  } else {
    console.log(`\n🎉 Verification Complete: Total news articles in Supabase universal_news table = ${count}`);
  }
}

runSeed().catch(console.error);
