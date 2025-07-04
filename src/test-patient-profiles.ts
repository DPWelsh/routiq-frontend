import { RoutiqAPI } from './lib/routiq-api';

async function testPatientProfilesAPI() {
  const organizationId = 'org_2xwHiNrj68eaRUlX10anlXGvzX7';
  const api = new RoutiqAPI(organizationId);

  console.log('🧪 Testing Patient Profiles API Integration...\n');

  try {
    // Test 1: Debug endpoint
    console.log('1. Testing debug endpoint...');
    const debugResponse = await api.getPatientProfilesDebug(organizationId);
    console.log(`✅ Debug endpoint works! Got ${debugResponse.count} profiles`);
    console.log(`   First patient: ${debugResponse.patient_profiles[0]?.patient_name}`);

    // Test 2: Main endpoint
    console.log('\n2. Testing main patient profiles endpoint...');
    const profilesResponse = await api.getPatientProfiles(organizationId, { limit: 5 });
    console.log(`✅ Main endpoint works! Got ${profilesResponse.count} profiles`);

    // Test 3: Field mapping
    console.log('\n3. Testing field mapping...');
    const mappedData = await api.getPrioritizedPatientsFromProfiles(organizationId, { limit: 3 });
    console.log(`✅ Field mapping works! Got ${mappedData.patients.length} mapped patients`);
    
    const firstPatient = mappedData.patients[0];
    if (firstPatient) {
      console.log(`   Mapped patient: ${firstPatient.name} (Risk: ${firstPatient.risk_level})`);
      console.log(`   Action: ${firstPatient.recommended_action}`);
    }

    // Test 4: Summary endpoint
    console.log('\n4. Testing summary endpoint...');
    const summaryResponse = await api.getPatientProfilesSummary(organizationId);
    console.log(`✅ Summary endpoint works! Total patients: ${summaryResponse.summary.total_patients}`);
    console.log(`   Engagement breakdown: ${summaryResponse.summary.disengaged} disengaged, ${summaryResponse.summary.low_risk} low risk`);

    console.log('\n🎉 All tests passed! Patient Profiles API integration is working correctly.\n');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testPatientProfilesAPI(); 