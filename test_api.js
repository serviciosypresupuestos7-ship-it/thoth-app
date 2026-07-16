async function testProcess() {
    const res = await fetch('http://localhost:3000/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: 'test-domain' }),
    });
    const data = await res.json();
    console.log('process response:', data);
}

async function testSearch() {
    const res = await fetch('http://localhost:3000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '¿Qué es la supervisión humana?', domain: 'ai_literacy' }),
    });
    const data = await res.json();
    console.log('search response:', data);
}

(async () => {
    await testProcess();
    await testSearch();
})();


async function testProcess() {
    const res = await fetch('http://localhost:3000/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: 'test-domain' }),
    });
    const data = await res.json();
    console.log('process response:', data);
}

async function testSearch() {
    const res = await fetch('http://localhost:3000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '¿Qué es la supervisión humana?', domain: 'ai_literacy' }),
    });
    const data = await res.json();
    console.log('search response:', data);
}

(async () => {
    await testProcess();
    await testSearch();
})();
