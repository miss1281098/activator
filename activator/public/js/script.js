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

    // 验证申请码是否为10位（字母/数字）
    function validateApplyCode(code) {
        const reg = /^[a-zA-Z0-9]{10}$/;
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
            applyTips.textContent = `❌ 申请码格式错误（当前${applyCodeVal.length}位，需10位字母/数字）`;
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

        // 3. 调用后端API
        try {
            const response = await fetch('/api/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    applyCode: applyCodeVal,
                    functionCode: strFunctionCode
                })
            });

            const data = await response.json();

            if (data.success) {
                activeCode.value = data.activateCode;
            } else {
                applyTips.style.color = '#f53f3f';
                applyTips.textContent = '❌ ' + (data.error || '激活码生成失败');
            }
        } catch (e) {
            applyTips.style.color = '#f53f3f';
            applyTips.textContent = '❌ 网络错误，请重试';
            console.error('请求失败：', e);
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
            applyTips.textContent = `⚠️ 当前${val.length}位，需10位字母/数字`;
        }
    });
});