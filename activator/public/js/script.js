function md5(str) {
    function md5cycle(x, k) {
        var a = x[0], b = x[1], c = x[2], d = x[3];
        a = ff(a, b, c, d, k[0], 7, -680876936);
        d = ff(d, a, b, c, k[1], 12, -389564586);
        c = ff(c, d, a, b, k[2], 17, 606105819);
        b = ff(b, c, d, a, k[3], 22, -1044525330);
        a = ff(a, b, c, d, k[4], 7, -176418897);
        d = ff(d, a, b, c, k[5], 12, 1200080426);
        c = ff(c, d, a, b, k[6], 17, -1473231341);
        b = ff(b, c, d, a, k[7], 22, -45705983);
        a = ff(a, b, c, d, k[8], 7, 1770035416);
        d = ff(d, a, b, c, k[9], 12, -1958414417);
        c = ff(c, d, a, b, k[10], 17, -42063);
        b = ff(b, c, d, a, k[11], 22, -1990404162);
        a = ff(a, b, c, d, k[12], 7, 1804603682);
        d = ff(d, a, b, c, k[13], 12, -40341101);
        c = ff(c, d, a, b, k[14], 17, -1502002290);
        b = ff(b, c, d, a, k[15], 22, 1236535329);
        a = gg(a, b, c, d, k[1], 5, -165796510);
        d = gg(d, a, b, c, k[6], 9, -1069501632);
        c = gg(c, d, a, b, k[11], 14, 643717713);
        b = gg(b, c, d, a, k[0], 20, -373897302);
        a = gg(a, b, c, d, k[5], 5, -701558691);
        d = gg(d, a, b, c, k[10], 9, 38016083);
        c = gg(c, d, a, b, k[15], 14, -660478335);
        b = gg(b, c, d, a, k[4], 20, -405537848);
        a = gg(a, b, c, d, k[9], 5, 568446438);
        d = gg(d, a, b, c, k[14], 9, -1019803690);
        c = gg(c, d, a, b, k[3], 14, -187363961);
        b = gg(b, c, d, a, k[8], 20, 1163531501);
        a = gg(a, b, c, d, k[13], 5, -1444681467);
        d = gg(d, a, b, c, k[2], 9, -51403784);
        c = gg(c, d, a, b, k[7], 14, 1735328473);
        b = gg(b, c, d, a, k[12], 20, -1926607734);
        a = hh(a, b, c, d, k[5], 4, -378558);
        d = hh(d, a, b, c, k[8], 11, -2022574463);
        c = hh(c, d, a, b, k[11], 16, 1839030562);
        b = hh(b, c, d, a, k[14], 23, -35309556);
        a = hh(a, b, c, d, k[1], 4, -1530992060);
        d = hh(d, a, b, c, k[4], 11, 1272893353);
        c = hh(c, d, a, b, k[7], 16, -155497632);
        b = hh(b, c, d, a, k[10], 23, -1094730640);
        a = hh(a, b, c, d, k[13], 4, 681279174);
        d = hh(d, a, b, c, k[0], 11, -358537222);
        c = hh(c, d, a, b, k[3], 16, -722521979);
        b = hh(b, c, d, a, k[6], 23, 76029189);
        a = hh(a, b, c, d, k[9], 4, -640364487);
        d = hh(d, a, b, c, k[12], 11, -421815835);
        c = hh(c, d, a, b, k[15], 16, 530742520);
        b = hh(b, c, d, a, k[2], 23, -995338651);
        a = ii(a, b, c, d, k[0], 6, -198630844);
        d = ii(d, a, b, c, k[7], 10, 1126891415);
        c = ii(c, d, a, b, k[14], 15, -1416354905);
        b = ii(b, c, d, a, k[5], 21, -57434055);
        a = ii(a, b, c, d, k[12], 6, 1700485571);
        d = ii(d, a, b, c, k[3], 10, -1894986606);
        c = ii(c, d, a, b, k[10], 15, -1051523);
        b = ii(b, c, d, a, k[1], 21, -2054922799);
        a = ii(a, b, c, d, k[8], 6, 1873313359);
        d = ii(d, a, b, c, k[15], 10, -30611744);
        c = ii(c, d, a, b, k[6], 15, -1560198380);
        b = ii(b, c, d, a, k[13], 21, 1309151649);
        a = ii(a, b, c, d, k[4], 6, -145523070);
        d = ii(d, a, b, c, k[11], 10, -1120210379);
        c = ii(c, d, a, b, k[2], 15, 718787259);
        b = ii(b, c, d, a, k[9], 21, -343485551);
        x[0] = add32(a, x[0]);
        x[1] = add32(b, x[1]);
        x[2] = add32(c, x[2]);
        x[3] = add32(d, x[3]);
    }
    function cmn(q, a, b, x, s, t) {
        a = add32(add32(a, q), add32(x, t));
        return add32((a << s) | (a >>> (32 - s)), b);
    }
    function ff(a, b, c, d, x, s, t) {
        return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function gg(a, b, c, d, x, s, t) {
        return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function hh(a, b, c, d, x, s, t) {
        return cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function ii(a, b, c, d, x, s, t) {
        return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }
    function add32(a, b) {
        return (a + b) & 0xFFFFFFFF;
    }
    var txt = str;
    var n = txt.length, state = [1732584193, -271733879, -1732584194, 271733878], i;
    for (i = 64; i <= txt.length; i += 64) {
        md5cycle(state, md5blk(txt.substring(i - 64, i)));
    }
    txt = txt.substring(i - 64);
    var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < txt.length; i++) {
        tail[i >> 2] |= txt.charCodeAt(i) << ((i % 4) << 3);
    }
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) {
        md5cycle(state, tail);
        for (i = 0; i < 16; i++) tail[i] = 0;
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return state;
}
function md5blk(s) {
    var md5blks = [], i;
    for (i = 0; i < 64; i += 4) {
        md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
    }
    return md5blks;
}
function hex(x) {
    var hex_chr = '0123456789ABCDEF';
    var str = '';
    for (var i = 0; i < 4; i++) {
        str += hex_chr.charAt((x >> (i * 8 + 4)) & 0x0F) + hex_chr.charAt((x >> (i * 8)) & 0x0F);
    }
    return str;
}
function md5hex(str) {
    var x = md5(str);
    return hex(x[0]) + hex(x[1]) + hex(x[2]) + hex(x[3]);
}

// ========== 对应C#的MD5Encrypt16逻辑 ==========
const key = "crcc";
// 16位MD5加密（截取第4-11字节，去掉横线）
function MD5Encrypt16(str) {
    // 计算完整MD5
    const fullMd5 = md5hex(str);
    // 截取第4到第11字节（对应C#的 BitConverter.ToString(...,4,8)）
    // 每个字节对应2个16进制字符，8字节=16个字符，从第8位开始截取（4*2）
    const encrypt16 = fullMd5.substring(8, 24);
    return encrypt16;
}

// 计算激活码（对应C#的CalculateActivationCode）
function CalculateActivationCode(requestCode, functionCode) {
    const code = requestCode + key + functionCode;
    return MD5Encrypt16(code);
}

// ========== 页面交互逻辑 ==========
// 获取元素
document.addEventListener('DOMContentLoaded', function () {

    const calcBtn = document.getElementById('calc-btn');
    const resetBtn = document.getElementById('reset-btn');
    const applyCode = document.getElementById('apply-code');
    const activeCode = document.getElementById('active-code');
    const applyTips = document.getElementById('apply-tips');
    // 对应C#的复选框
    const ckbSegmentFlotation = document.getElementById('ckbSegmentFlotation');
    const ckbSegmentConvergence = document.getElementById('ckbSegmentConvergence');
    const ckbShieldTailClearance = document.getElementById('ckbShieldTailClearance');
    const ckbSegmentTypeSelection = document.getElementById('ckbSegmentTypeSelection');
    const ckbSegmentFlatness = document.getElementById('ckbSegmentFlatness');
    const ckbSegmentOvality = document.getElementById('ckbSegmentOvality');

    // 验证申请码是否为16位（字母/数字）
    function validateApplyCode(code) {
        const reg = /^[a-zA-Z0-9]{16}$/;
        return reg.test(code);
    }

    // 计算按钮点击事件
    calcBtn.addEventListener('click', async () => {
        const applyCodeVal = applyCode.value.trim();
        applyTips.textContent = '';

        // 1. 验证申请码
        if (!applyCodeVal) {
            applyTips.style.color = '#f53f3f';
            applyTips.textContent = '❌ 请输入申请码';
            return;
        }
        if (!validateApplyCode(applyCodeVal)) {
            applyTips.style.color = '#f53f3f';
            applyTips.textContent = `❌ 申请码格式错误（当前${applyCodeVal.length}位，需16位字母/数字）`;
            return;
        }
        applyTips.style.color = '#00b42a';
        applyTips.textContent = '✅ 申请码格式正确';

        // 2. 计算功能码（对应C#的functionCode累加逻辑）
        let functionCode = 0;
        if (ckbSegmentFlotation.checked) functionCode += 1;
        if (ckbSegmentConvergence.checked) functionCode += 2;
        if (ckbShieldTailClearance.checked) functionCode += 4;
        if (ckbSegmentTypeSelection.checked) functionCode += 8;
        if (ckbSegmentFlatness.checked) functionCode += 16;
        if (ckbSegmentOvality.checked) functionCode += 32;

        // 转为4位16进制字符串（对应C#的ToString("X4")）
        const strFunctionCode = functionCode.toString(16).toUpperCase().padStart(4, '0');

        // 3. 生成激活码（异步等待MD5计算）
        try {
            const finalActivateCode = await CalculateActivationCode(applyCodeVal, strFunctionCode);
            activeCode.value = finalActivateCode;
        } catch (e) {
            applyTips.style.color = '#f53f3f';
            applyTips.textContent = '❌ 激活码生成失败，请重试';
            console.error('生成失败：', e);
        }
    });

    // 重置按钮点击事件
    resetBtn.addEventListener('click', () => {
        applyCode.value = '';
        activeCode.value = '';
        applyTips.textContent = '';
        // 取消所有复选框
        ckbSegmentFlotation.checked = false;
        ckbSegmentConvergence.checked = false;
        ckbShieldTailClearance.checked = false;
        ckbSegmentTypeSelection.checked = false;
        ckbSegmentFlatness.checked = false;
        ckbSegmentOvality.checked = false;
    });

    // 申请码输入实时校验
    applyCode.addEventListener('input', () => {
        const val = applyCode.value.trim();
        if (val.length === 0) {
            applyTips.textContent = '';
            return;
        }
        if (validateApplyCode(val)) {
            applyTips.style.color = '#00b42a';
            applyTips.textContent = '✅ 申请码格式正确';
        } else {
            applyTips.style.color = '#ff7d00';
            applyTips.textContent = `⚠️ 当前${val.length}位，需16位字母/数字`;
        }
    });
});