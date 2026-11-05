#!/usr/bin/env node
/**
 * Script: migrasi showToast lokal → toast global di semua halaman admin.
 * Jalankan: node scripts/migrateToast.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const adminDir = 'frontend/src/pages/admin';

const files = [
  'ManageAccount.tsx',
  'ManageAgendas.tsx',
  'ManageAchievements.tsx',
  'ManageFacilities.tsx',
  'ManageFacilities.tsx',
  'ManageGallery.tsx',
  'ManageMessages.tsx',
  'ManageNews.tsx',
  'ManageOrganization.tsx',
  'ManagePPDB.tsx',
  'ManageProfile.tsx',
  'ManagePrograms.tsx',
  'ManageSettings.tsx',
  'ManageTeachers.tsx',
];

const uniqueFiles = [...new Set(files)];

for (const filename of uniqueFiles) {
  const filePath = join(adminDir, filename);
  let src;
  try {
    src = readFileSync(filePath, 'utf-8');
  } catch {
    console.warn(`Skip (not found): ${filename}`);
    continue;
  }

  let updated = src;

  // 1. Add toast import if not already present
  if (!updated.includes("from '../../hooks/useToast'")) {
    // Insert after last existing import line
    updated = updated.replace(
      /^(import .+;\n)(?!import)/m,
      `$1import { toast } from '../../hooks/useToast';\n`
    );
  }

  // 2. Remove local showToast function definition
  //    Pattern: const showToast = (text: string, type?: ...) => { ... };
  updated = updated.replace(
    /\n\s*const showToast = \([^)]*\)[^{]*\{[\s\S]*?setTimeout[\s\S]*?\}, \d+\);\n\s*\};\n/g,
    '\n'
  );

  // 3. Remove local notification state: useState<{ text: string; type: ... } | null>(null)
  updated = updated.replace(
    /\n\s*const \[notification, setNotification\] = useState<\{[^}]+\} \| null>\(null\);\n/g,
    '\n'
  );

  // 4. Remove notification JSX block (simple inline banner style in admin pages)
  //    Matches: {notification && ( <div className="..."> ... </div> )}
  updated = updated.replace(
    /\{notification && \(\s*<div[\s\S]*?<\/div>\s*\)\}/g,
    ''
  );

  // 5. Replace showToast calls
  //    showToast('msg')             → toast.success('msg')
  //    showToast('msg', 'success')  → toast.success('msg')
  //    showToast('msg', 'error')    → toast.error('msg')
  updated = updated.replace(
    /showToast\(([^,)]+),\s*'success'\)/g,
    'toast.success($1)'
  );
  updated = updated.replace(
    /showToast\(([^,)]+),\s*'error'\)/g,
    'toast.error($1)'
  );
  updated = updated.replace(
    /showToast\(([^,)]+)\)/g,
    'toast.success($1)'
  );

  if (updated !== src) {
    writeFileSync(filePath, updated, 'utf-8');
    console.log(`✅ Migrated: ${filename}`);
  } else {
    console.log(`⚪ No change: ${filename}`);
  }
}

console.log('\nMigration complete.');
