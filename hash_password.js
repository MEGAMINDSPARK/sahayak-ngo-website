// Password Hashing Utility
// Use this script to generate bcrypt hashes for passwords

const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

async function verifyPassword(password, hash) {
  const isValid = await bcrypt.compare(password, hash);
  return isValid;
}

// Example usage
async function main() {
  const password = 'Rahul@399'; // Admin password

  console.log('Original Password:', password);

  const hash = await hashPassword(password);
  console.log('\nBcrypt Hash:', hash);

  const isValid = await verifyPassword(password, hash);
  console.log('\nPassword Valid:', isValid);

  console.log('\n--- How to use this hash ---');
  console.log('1. Copy the hash above');
  console.log('2. Go to Supabase SQL Editor');
  console.log('3. Run this query:');
  console.log(`
UPDATE users
SET password = '${hash}'
WHERE email = 'rahulkumarroy399@gmail.com';
  `);
}

main();
