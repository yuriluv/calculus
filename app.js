document.addEventListener('DOMContentLoaded', () => {
    const gammaInput = document.getElementById('gamma');
    const omega0Input = document.getElementById('omega0');
    const A0Input = document.getElementById('A0');

    const gammaValSpan = document.getElementById('gamma-val');
    const omega0ValSpan = document.getElementById('omega0-val');
    const A0ValSpan = document.getElementById('A0-val');

    const resGamma = document.getElementById('res-gamma');
    const resOmega0 = document.getElementById('res-omega0');
    const resMaxOmega = document.getElementById('res-max-omega');
    const resFwhm = document.getElementById('res-fwhm');
    const resHalfLeft = document.getElementById('res-half-left');
    const resHalfRight = document.getElementById('res-half-right');

    function updatePlots() {
        const gamma = parseFloat(gammaInput.value);
        const omega0 = parseFloat(omega0Input.value);
        const A0 = parseFloat(A0Input.value);

        // Update spans
        gammaValSpan.textContent = gamma.toFixed(2);
        omega0ValSpan.textContent = omega0.toFixed(2);
        A0ValSpan.textContent = A0.toFixed(2);

        // Update results
        resGamma.textContent = gamma.toFixed(2);
        resOmega0.textContent = omega0.toFixed(2);
        resMaxOmega.textContent = omega0.toFixed(2);
        resFwhm.textContent = (2 * gamma).toFixed(2);
        resHalfLeft.textContent = (omega0 - gamma).toFixed(2);
        resHalfRight.textContent = (omega0 + gamma).toFixed(2);

        // Time domain data
        const t = [];
        const P = [];
        const tMax = Math.max(10, 5 / gamma);
        for (let i = 0; i <= 500; i++) {
            const currentT = (i / 500) * tMax;
            t.push(currentT);
            P.push(A0 * Math.exp(-gamma * currentT) * Math.sin(omega0 * currentT));
        }

        // Frequency domain data
        const w = [];
        const I = [];
        const wRange = Math.max(5, 5 * gamma);
        for (let i = 0; i <= 500; i++) {
            const currentW = omega0 - wRange + (i / 500) * 2 * wRange;
            if(currentW < 0) continue; // Only positive frequencies
            w.push(currentW);
            I.push(1 / (Math.pow(gamma, 2) + Math.pow(currentW - omega0, 2)));
        }

        const maxI = 1 / Math.pow(gamma, 2);
        const halfI = maxI / 2;

        // Plot Time Domain
        Plotly.react('time-plot', [{
            x: t,
            y: P,
            type: 'scatter',
            mode: 'lines',
            line: {color: '#2563eb'}
        }], {
            margin: { t: 30, r: 20, b: 40, l: 50 },
            xaxis: { title: '시간 t' },
            yaxis: { title: '전자 응답 P' }
        }, {responsive: true});

        // Plot Frequency Domain
        Plotly.react('freq-plot', [{
            x: w,
            y: I,
            type: 'scatter',
            mode: 'lines',
            name: '흡수 스펙트럼',
            line: {color: '#dc2626'}
        }, {
            x: [omega0, omega0],
            y: [0, maxI],
            type: 'scatter',
            mode: 'lines',
            name: '중심 피크 (ω₀)',
            line: {color: 'black', dash: 'dash'}
        }, {
            x: [omega0 - gamma, omega0 - gamma],
            y: [0, halfI],
            type: 'scatter',
            mode: 'lines',
            name: '왼쪽 반치점 (ω₀-γ)',
            line: {color: '#16a34a', dash: 'dot'}
        }, {
            x: [omega0 + gamma, omega0 + gamma],
            y: [0, halfI],
            type: 'scatter',
            mode: 'lines',
            name: '오른쪽 반치점 (ω₀+γ)',
            line: {color: '#16a34a', dash: 'dot'}
        }], {
            margin: { t: 30, r: 20, b: 40, l: 50 },
            xaxis: { title: '각진동수 ω' },
            yaxis: { title: '흡수 강도 I' },
            showlegend: true,
            legend: { x: 1, xanchor: 'right', y: 1 }
        }, {responsive: true});
    }

    gammaInput.addEventListener('input', updatePlots);
    omega0Input.addEventListener('input', updatePlots);
    A0Input.addEventListener('input', updatePlots);

    // Initial plot
    updatePlots();
});
