(function () {
    'use strict';

    var DEFAULT_CIPHER = 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256:TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256:TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256:TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256:TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA:TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA:TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256:TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256';

    var DEFAULT_FM = JSON.stringify({
        tcp: [
            { type: 'fragment', settings: { packets: 'tlshello', lengths: ['5', '94', '1'], delays: ['0'], maxSplit: '0' } },
            { type: 'fragment', settings: { packets: '1-1', lengths: ['109', '1'], delays: ['1'], maxSplit: '355' } }
        ]
    });

    var DEFAULT_FP = 'unsafe';

    var input = document.getElementById('config-input');
    var enhanceBtn = document.getElementById('enhance-btn');
    var clearBtn = document.getElementById('clear-btn');
    var resultsSection = document.getElementById('results-section');
    var enhancedSection = document.getElementById('enhanced-section');
    var skippedSection = document.getElementById('skipped-section');
    var enhancedOutput = document.getElementById('enhanced-output');
    var copyBtn = document.getElementById('copy-btn');
    var downloadBtn = document.getElementById('download-btn');

    var lastEnhancedText = '';

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function enhanceSingleUrl(raw) {
        var trimmed = raw.trim();
        if (!trimmed) return { original: trimmed, enhanced: '', protocol: '', server: '', port: 0, remark: '', skipped: true, skipReason: 'empty line' };
        if (trimmed.indexOf('vless://') !== 0 && trimmed.indexOf('trojan://') !== 0) {
            return { original: trimmed, enhanced: '', protocol: '', server: '', port: 0, remark: '', skipped: true, skipReason: 'not vless/trojan' };
        }

        var u;
        try { u = new URL(trimmed); } catch (e) {
            return { original: trimmed, enhanced: '', protocol: '', server: '', port: 0, remark: '', skipped: true, skipReason: 'parse error' };
        }

        var security = u.searchParams.get('security') || 'none';
        var protocol = u.protocol.replace(':', '');
        var remark = '';
        try { remark = decodeURIComponent(u.hash.slice(1) || ''); } catch (e) { remark = u.hash.slice(1) || ''; }

        if (security !== 'tls') {
            return { original: trimmed, enhanced: '', protocol: protocol, server: u.hostname, port: parseInt(u.port) || 443, remark: remark, skipped: true, skipReason: 'security="' + security + '" (only tls)' };
        }

        u.searchParams.set('fp', DEFAULT_FP);
        u.searchParams.set('cs', DEFAULT_CIPHER);
        u.searchParams.set('fm', DEFAULT_FM);

        var result = u.toString();
        result = result.replace(/\+/g, '%20');

        return { original: trimmed, enhanced: result, protocol: protocol, server: u.hostname, port: parseInt(u.port) || 443, remark: remark, skipped: false };
    }

    function onInput() {
        enhanceBtn.disabled = !input.value.trim();
    }

    function onEnhance() {
        try {
            var text = input.value.trim();
            if (!text) return;

            var lines = text.split('\n');
            var cleanLines = [];
            for (var i = 0; i < lines.length; i++) {
                var l = lines[i].trim();
                if (l.length > 0) cleanLines.push(l);
            }

            var results = [];
            for (var j = 0; j < cleanLines.length; j++) {
                results.push(enhanceSingleUrl(cleanLines[j]));
            }

            var enhanced = [];
            var skipped = [];
            for (var k = 0; k < results.length; k++) {
                if (results[k].skipped) { skipped.push(results[k]); }
                else { enhanced.push(results[k]); }
            }

            lastEnhancedText = '';
            for (var e = 0; e < enhanced.length; e++) {
                if (e > 0) lastEnhancedText += '\n';
                lastEnhancedText += enhanced[e].enhanced;
            }

            document.getElementById('stat-total').textContent = results.length;
            document.getElementById('stat-enhanced').textContent = enhanced.length;
            document.getElementById('stat-skipped').textContent = skipped.length;

            if (enhanced.length > 0) {
                enhancedOutput.textContent = lastEnhancedText;
                enhancedSection.style.display = '';
            } else {
                enhancedSection.style.display = 'none';
            }

            if (skipped.length > 0) {
                document.getElementById('skipped-count').textContent = skipped.length;
                var list = document.getElementById('skipped-list');
                var html = '';
                for (var s = 0; s < skipped.length; s++) {
                    var r = skipped[s];
                    var shortOriginal = r.original.length > 120 ? r.original.slice(0, 120) + '...' : r.original;
                    var protoTag = r.protocol ? '<span class="skip-protocol">' + r.protocol.toUpperCase() + '</span>' : '';
                    html += '<div class="skip-item"><div class="skip-item-header"><span class="skip-reason">' + escapeHtml(r.skipReason) + '</span>' + protoTag + '</div><pre>' + escapeHtml(shortOriginal) + '</pre></div>';
                }
                list.innerHTML = html;
                skippedSection.style.display = '';
            } else {
                skippedSection.style.display = 'none';
            }

            resultsSection.style.display = '';
            setTimeout(function() {
                resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
        } catch (err) {
            console.error('Enhance error:', err);
        }
    }

    function onCopy() {
        if (!lastEnhancedText) return;
        navigator.clipboard.writeText(lastEnhancedText).then(function() {
            copyBtn.classList.add('copied');
            copyBtn.innerHTML = '<span class="action-icon">✅</span> کپی شد!';
            setTimeout(function() {
                copyBtn.classList.remove('copied');
                copyBtn.innerHTML = '<span class="action-icon">📋</span> کپی';
            }, 2000);
        });
    }

    function onDownload() {
        if (!lastEnhancedText) return;
        var blob = new Blob([lastEnhancedText], { type: 'text/plain;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'enhanced-configs-' + Date.now() + '.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.createObjectURL(url);
    }

    function onClear() {
        input.value = '';
        enhanceBtn.disabled = true;
        resultsSection.style.display = 'none';
        enhancedSection.style.display = 'none';
        skippedSection.style.display = 'none';
        lastEnhancedText = '';
    }

    input.addEventListener('input', onInput);
    enhanceBtn.addEventListener('click', onEnhance);
    clearBtn.addEventListener('click', onClear);
    copyBtn.addEventListener('click', onCopy);
    downloadBtn.addEventListener('click', onDownload);
})();
