const { execSync } = require('child_process');

const projectId = process.env.NEXT_PUBLIC_SUPABASE_REF_ID ?? 'default';

if (!projectId) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_REF_ID environment variable is not set');
  console.log('\nTo fix this:');
  console.log('1. Add NEXT_PUBLIC_SUPABASE_REF_ID to your .env.local file');
  console.log('2. Or set it inline: NEXT_PUBLIC_SUPABASE_REF_ID=your-project-id node genSupaTypes.js');
  process.exit(1);
}

console.log(`Using project ID: ${projectId}`);

try {
  execSync(
    //`npx supabase gen types typescript --project-id ${projectId} --schema public > src/types/supabase.ts`,
    `npx supabase gen types typescript --local --schema public > src/types/supabase.ts`,
    { stdio: 'inherit' }
  );
  console.log('✅ Supabase types generated successfully!');
} catch (error) {
  console.error('Error generating Supabase types:', error.message);
  process.exit(1);
}
