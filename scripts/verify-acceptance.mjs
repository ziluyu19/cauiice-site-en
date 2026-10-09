import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBTyhDSN9YmRQWBqBB9XL2wodjqotX8U-k",
  authDomain: "cauiice-site-en.firebaseapp.com",
  projectId: "cauiice-site-en",
  storageBucket: "cauiice-site-en.firebasestorage.app",
  messagingSenderId: "913023295808",
  appId: "1:913023295808:web:88f2117e1297d7c02adaa5",
  measurementId: "G-2E4NGY43DX"
};

const app = initializeApp(firebaseConfig, 'acceptance-test-app');
const db = getFirestore(app);

async function runTests() {
  console.log('===============================================================');
  console.log('  FIRESTORE DATA INTEGRITY & SECURITY RULES VERIFICATION');
  console.log('  Target Project: cauiice-site-en');
  console.log('===============================================================');

  const results = [];

  // 1. Verify Public Read: news
  try {
    const snap = await getDocs(collection(db, 'news'));
    const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    console.log(`✓ Read news: ${docs.length} documents found in Firestore`);
    const valid = docs.length > 0 && docs.some(d => d.title && d.date && d.category);
    results.push({ test: 'Public Read: news', pass: valid, detail: `${docs.length} docs found` });
  } catch (err) {
    console.error('✗ Read news failed:', err.message);
    results.push({ test: 'Public Read: news', pass: false, detail: err.message });
  }

  // 2. Verify Public Read: projects
  try {
    const snap = await getDocs(collection(db, 'projects'));
    const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    console.log(`✓ Read projects: ${docs.length} documents found in Firestore`);
    const valid = docs.length > 0 && docs.some(d => d.title && d.status);
    results.push({ test: 'Public Read: projects', pass: valid, detail: `${docs.length} docs found` });
  } catch (err) {
    console.error('✗ Read projects failed:', err.message);
    results.push({ test: 'Public Read: projects', pass: false, detail: err.message });
  }

  // 3. Verify Public Read: members
  try {
    const snap = await getDocs(collection(db, 'members'));
    const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    console.log(`✓ Read members: ${docs.length} documents found in Firestore`);
    const valid = docs.length > 0 && docs.some(d => d.name || d.institution);
    results.push({ test: 'Public Read: members', pass: valid, detail: `${docs.length} docs found` });
  } catch (err) {
    console.error('✗ Read members failed:', err.message);
    results.push({ test: 'Public Read: members', pass: false, detail: err.message });
  }

  // 4. Verify Public Read: siteConfig (committee, organisation, contact)
  try {
    const commSnap = await getDoc(doc(db, 'siteConfig', 'committee'));
    const orgSnap = await getDoc(doc(db, 'siteConfig', 'organisation'));
    const contactSnap = await getDoc(doc(db, 'siteConfig', 'contact'));
    const allExist = commSnap.exists() && orgSnap.exists() && contactSnap.exists();
    console.log(`✓ Read siteConfig: committee=${commSnap.exists()}, organisation=${orgSnap.exists()}, contact=${contactSnap.exists()}`);
    results.push({ test: 'Public Read: siteConfig (3 sections)', pass: allExist, detail: 'committee, organisation, contact all exist' });
  } catch (err) {
    console.error('✗ Read siteConfig failed:', err.message);
    results.push({ test: 'Public Read: siteConfig (3 sections)', pass: false, detail: err.message });
  }

  // 5. Verify Security: Unauthenticated Read of enquiries (MUST BE DENIED)
  try {
    await getDocs(collection(db, 'enquiries'));
    console.error('✗ Security failure: Unauthenticated read of enquiries was PERMITTED!');
    results.push({ test: 'Security: Unauthenticated read enquiries denied', pass: false, detail: 'Failed! Read was permitted!' });
  } catch (err) {
    const isPermissionDenied = err.code === 'permission-denied' || err.message.includes('permission');
    console.log(`✓ Security verified: Unauthenticated read enquiries rejected with code: ${err.code}`);
    results.push({ test: 'Security: Unauthenticated read enquiries denied', pass: isPermissionDenied, detail: `Correctly rejected: ${err.code}` });
  }

  // 6. Verify Security: Unauthenticated Write to news (MUST BE DENIED)
  try {
    await setDoc(doc(db, 'news', 'test-unauth-write'), { title: 'Hack attempt' });
    console.error('✗ Security failure: Unauthenticated write to news was PERMITTED!');
    results.push({ test: 'Security: Unauthenticated write news denied', pass: false, detail: 'Failed! Write was permitted!' });
  } catch (err) {
    const isPermissionDenied = err.code === 'permission-denied' || err.message.includes('permission');
    console.log(`✓ Security verified: Unauthenticated write to news rejected with code: ${err.code}`);
    results.push({ test: 'Security: Unauthenticated write news denied', pass: isPermissionDenied, detail: `Correctly rejected: ${err.code}` });
  }

  // 7. Verify Security: Unauthenticated Write to projects (MUST BE DENIED)
  try {
    await setDoc(doc(db, 'projects', 'test-unauth-write'), { title: 'Hack attempt' });
    console.error('✗ Security failure: Unauthenticated write to projects was PERMITTED!');
    results.push({ test: 'Security: Unauthenticated write projects denied', pass: false, detail: 'Failed! Write was permitted!' });
  } catch (err) {
    const isPermissionDenied = err.code === 'permission-denied' || err.message.includes('permission');
    console.log(`✓ Security verified: Unauthenticated write to projects rejected with code: ${err.code}`);
    results.push({ test: 'Security: Unauthenticated write projects denied', pass: isPermissionDenied, detail: `Correctly rejected: ${err.code}` });
  }

  // 8. Verify Security: Unauthenticated Write to siteConfig (MUST BE DENIED)
  try {
    await setDoc(doc(db, 'siteConfig', 'contact'), { email: 'hacked@hack.com' });
    console.error('✗ Security failure: Unauthenticated write to siteConfig was PERMITTED!');
    results.push({ test: 'Security: Unauthenticated write siteConfig denied', pass: false, detail: 'Failed! Write was permitted!' });
  } catch (err) {
    const isPermissionDenied = err.code === 'permission-denied' || err.message.includes('permission');
    console.log(`✓ Security verified: Unauthenticated write to siteConfig rejected with code: ${err.code}`);
    results.push({ test: 'Security: Unauthenticated write siteConfig denied', pass: isPermissionDenied, detail: `Correctly rejected: ${err.code}` });
  }

  // 9. Verify Security: Enquiry Creation with non-whitelisted fields (MUST BE DENIED)
  try {
    await addDoc(collection(db, 'enquiries'), {
      institution: 'Test Corp',
      email: 'test@example.com',
      requirementSummary: 'Test',
      unauthorizedMaliciousField: 'exploit'
    });
    console.error('✗ Security failure: Enquiry creation with unauthorized field was PERMITTED!');
    results.push({ test: 'Security: Enquiry whitelist field rejection', pass: false, detail: 'Failed! Write was permitted!' });
  } catch (err) {
    const isPermissionDenied = err.code === 'permission-denied' || err.message.includes('permission');
    console.log(`✓ Security verified: Non-whitelisted field in enquiry rejected with code: ${err.code}`);
    results.push({ test: 'Security: Enquiry whitelist field rejection', pass: isPermissionDenied, detail: `Correctly rejected: ${err.code}` });
  }

  // 10. Verify Legitimate Public Enquiry Creation (MUST BE PERMITTED)
  try {
    const docRef = await addDoc(collection(db, 'enquiries'), {
      institution: '[TEST-TEMP] Security Acceptance Validation',
      countryRegionCode: 'GB',
      contactName: '[TEST-TEMP] Acceptance Bot',
      position: 'QA Lead',
      email: 'qa.test@cauiice-en-test.org',
      cooperationCategoryCode: 'JOINT_LAB',
      requirementSummary: '[TEST-TEMP] Automated verification of public enquiry creation under whitelist rules.',
      privacyConsent: true,
      sourcePage: '/en/cooperation/enquiry',
      status: 'pending',
      createdAt: serverTimestamp()
    });
    console.log(`✓ Public enquiry creation succeeded with Doc ID: ${docRef.id}`);
    results.push({ test: 'Public Enquiry Creation (whitelisted)', pass: true, detail: `Doc ID: ${docRef.id}` });
  } catch (err) {
    console.error('✗ Legitimate enquiry creation failed:', err.message);
    results.push({ test: 'Public Enquiry Creation (whitelisted)', pass: false, detail: err.message });
  }

  console.log('\n===============================================================');
  console.log('SUMMARY OF FIRESTORE DATA & SECURITY TESTS:');
  console.log('===============================================================');
  results.forEach(r => {
    console.log(`${r.pass ? '✓ PASS' : '✗ FAIL'} | ${r.test} | ${r.detail}`);
  });

  const allPassed = results.every(r => r.pass);
  if (!allPassed) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
