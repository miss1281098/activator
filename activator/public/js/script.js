// ========== 页面交互逻辑 ==========
// 获取元素
document.addEventListener('DOMContentLoaded', function () {

    const calcBtn = document.getElementById('calc-btn');
    const resetBtn = document.getElementById('reset-btn');
    const applyCode = document.getElementById('apply-code');
    const activeCode = document.getElementById('active-code');
    const applyTips = document.getElementById('apply-tips');

    // 版本选择单选按钮
    const version1 = document.getElementById('version1');
    const version2 = document.getElementById('version2');
    const version3 = document.getElementById('version3');

    // 功能选项模块
    const checkboxGroup = document.getElementById('checkboxGroup');

    // 对应C#的复选框
    const ckbSegmentFlotation = document.getElementById('ckbSegmentFlotation');
    const ckbSegmentConvergence = document.getElementById('ckbSegmentConvergence');
    const ckbShieldTailClearance = document.getElementById('ckbShieldTailClearance');
    const ckbSegmentTypeSelection = document.getElementById('ckbSegmentTypeSelection');
    const ckbSegmentFlatness = document.getElementById('ckbSegmentFlatness');
    const ckbSegmentOvality = document.getElementById('ckbSegmentOvality');

    // 根据版本控制功能选项模块的显示/隐藏
    function toggleCheckboxGroup() {
        if (version3.checked) {
            checkboxGroup.style.display = 'block';
        } else {
            checkboxGroup.style.display = 'none';
            // 如果隐藏，清空所有复选框的选择
            ckbSegmentFlotation.checked = false;
            ckbSegmentConvergence.checked = false;
            ckbShieldTailClearance.checked = false;
            ckbSegmentTypeSelection.checked = false;
            ckbSegmentFlatness.checked = false;
            ckbSegmentOvality.checked = false;
        }
    }

    // 监听版本选择变化
    version1.addEventListener('change', toggleCheckboxGroup);
    version2.addEventListener('change', toggleCheckboxGroup);
    version3.addEventListener('change', toggleCheckboxGroup);

    // 初始化显示状态
    toggleCheckboxGroup();

    // 根据版本验证申请码格式
    function validateApplyCodeByVersion(code, version) {
        if (version === 'version1') {
            // Version 1: 全数字，支持负数（可以有负号）
            // 匹配：可选的负号，后面跟数字（至少一位）
            const reg = /^-?\d+$/;
            return reg.test(code);
        } else if (version === 'version2') {
            // Version 2: 16位16进制字符（0-9, A-F, a-f）
            const reg = /^[0-9A-Fa-f]{16}$/;
            return reg.test(code);
        } else if (version === 'version3') {
            // Version 3: 10位16进制字符（0-9, A-F, a-f）
            const reg = /^[0-9A-Fa-f]{10}$/;
            return reg.test(code);
        }
        return false;
    }

    // 获取当前选中的版本
    function getCurrentVersion() {
        if (version1.checked) return 'version1';
        if (version2.checked) return 'version2';
        if (version3.checked) return 'version3';
        return 'version3'; // 默认
    }

    // 获取版本对应的验证规则描述
    function getVersionValidationMessage(version) {
        if (version === 'version1') {
            return '全数字（不限长度）';
        } else if (version === 'version2') {
            return '16位字母/数字';
        } else if (version === 'version3') {
            return '10位字母/数字';
        }
        return '';
    }

    // 计算按钮点击事件
    calcBtn.addEventListener('click', async () => {
        const applyCodeVal = applyCode.value.trim();
        const currentVersion = getCurrentVersion();
        applyTips.textContent = '';

        // 1. 验证申请码
        if (!applyCodeVal) {
            applyTips.style.color = '#f53f3f';
            applyTips.textContent = '❌ 请输入申请码';
            return;
        }

        const validationResult = validateApplyCodeByVersion(applyCodeVal, currentVersion);
        const validationMessage = getVersionValidationMessage(currentVersion);

        if (!validationResult) {
            const actualLength = applyCodeVal.length;
            if (currentVersion === 'version1') {
                if (!/^\d+$/.test(applyCodeVal)) {
                    applyTips.style.color = '#f53f3f';
                    applyTips.textContent = `❌ 申请码格式错误：Version 1 要求全数字，当前包含非数字字符`;
                } else {
                    applyTips.style.color = '#f53f3f';
                    applyTips.textContent = `❌ 申请码格式错误：Version 1 要求全数字`;
                }
            } else if (currentVersion === 'version2') {
                applyTips.style.color = '#f53f3f';
                applyTips.textContent = `❌ 申请码格式错误：Version 2 要求16位字母/数字（当前${actualLength}位）`;
            } else if (currentVersion === 'version3') {
                applyTips.style.color = '#f53f3f';
                applyTips.textContent = `❌ 申请码格式错误：Version 3 要求10位字母/数字（当前${actualLength}位）`;
            }
            return;
        }

        applyTips.style.color = '#00b42a';
        applyTips.textContent = `✅ 申请码格式正确（${validationMessage}）`;

        // 2. 计算功能码（仅在Version 3时计算，其他版本功能码为0）
        let functionCode = 0;
        if (currentVersion === 'version3') {
            if (ckbSegmentFlotation.checked) functionCode += 1;
            if (ckbSegmentConvergence.checked) functionCode += 2;
            if (ckbShieldTailClearance.checked) functionCode += 4;
            if (ckbSegmentTypeSelection.checked) functionCode += 8;
            if (ckbSegmentFlatness.checked) functionCode += 16;
            if (ckbSegmentOvality.checked) functionCode += 32;
        }

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
                    functionCode: strFunctionCode,
                    version: currentVersion  // 添加版本参数
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

    // // 验证申请码是否为10位（字母/数字）
    // function validateApplyCode(code) {
    //     const reg = /^[a-zA-Z0-9]{10}$/;
    //     return reg.test(code);
    // }

    // // 计算按钮点击事件
    // calcBtn.addEventListener('click', async () => {
    //     const applyCodeVal = applyCode.value.trim();
    //     applyTips.textContent = '';

    //     // 1. 验证申请码
    //     if (!applyCodeVal) {
    //         applyTips.style.color = '#f53f3f';
    //         applyTips.textContent = '❌ 请输入申请码';
    //         return;
    //     }
    //     if (!validateApplyCode(applyCodeVal)) {
    //         applyTips.style.color = '#f53f3f';
    //         applyTips.textContent = `❌ 申请码格式错误（当前${applyCodeVal.length}位，需10位字母/数字）`;
    //         return;
    //     }
    //     applyTips.style.color = '#00b42a';
    //     applyTips.textContent = '✅ 申请码格式正确';

    //     // 2. 计算功能码（对应C#的functionCode累加逻辑）
    //     let functionCode = 0;
    //     if (ckbSegmentFlotation.checked) functionCode += 1;
    //     if (ckbSegmentConvergence.checked) functionCode += 2;
    //     if (ckbShieldTailClearance.checked) functionCode += 4;
    //     if (ckbSegmentTypeSelection.checked) functionCode += 8;
    //     if (ckbSegmentFlatness.checked) functionCode += 16;
    //     if (ckbSegmentOvality.checked) functionCode += 32;

    //     // 转为4位16进制字符串（对应C#的ToString("X4")）
    //     const strFunctionCode = functionCode.toString(16).toUpperCase().padStart(4, '0');

    //     // 3. 调用后端API
    //     try {
    //         const response = await fetch('/api/calculate', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 applyCode: applyCodeVal,
    //                 functionCode: strFunctionCode
    //             })
    //         });

    //         const data = await response.json();

    //         if (data.success) {
    //             activeCode.value = data.activateCode;
    //         } else {
    //             applyTips.style.color = '#f53f3f';
    //             applyTips.textContent = '❌ ' + (data.error || '激活码生成失败');
    //         }
    //     } catch (e) {
    //         applyTips.style.color = '#f53f3f';
    //         applyTips.textContent = '❌ 网络错误，请重试';
    //         console.error('请求失败：', e);
    //     }
    // });

    // 重置按钮点击事件
    resetBtn.addEventListener('click', () => {
        applyCode.value = '';
        activeCode.value = '';
        applyTips.textContent = '';

        version3.checked = true;

        // 取消所有复选框
        ckbSegmentFlotation.checked = false;
        ckbSegmentConvergence.checked = false;
        ckbShieldTailClearance.checked = false;
        ckbSegmentTypeSelection.checked = false;
        ckbSegmentFlatness.checked = false;
        ckbSegmentOvality.checked = false;

        toggleCheckboxGroup();
        applyTips.textContent = '';

    });

    // 申请码输入实时校验
    // applyCode.addEventListener('input', () => {
    //     const val = applyCode.value.trim();
    //     if (val.length === 0) {
    //         applyTips.textContent = '';
    //         return;
    //     }
    //     if (validateApplyCode(val)) {
    //         applyTips.style.color = '#00b42a';
    //         applyTips.textContent = '✅ 申请码格式正确';
    //     } else {
    //         applyTips.style.color = '#ff7d00';
    //         applyTips.textContent = `⚠️ 当前${val.length}位，需10位字母/数字`;
    //     }
    // });

    applyCode.addEventListener('input', () => {
        const val = applyCode.value.trim();
        const currentVersion = getCurrentVersion();

        if (val.length === 0) {
            applyTips.textContent = '';
            return;
        }

        const validationResult = validateApplyCodeByVersion(val, currentVersion);
        const validationMessage = getVersionValidationMessage(currentVersion);

        if (validationResult) {
            applyTips.style.color = '#00b42a';
            applyTips.textContent = `✅ 申请码格式正确（${validationMessage}）`;
        } else {
            const actualLength = val.length;
            if (currentVersion === 'version1') {
                if (!/^-?\d+$/.test(val)) {
                    if (val.includes('-') && val.indexOf('-') !== 0) {
                        applyTips.style.color = '#ff7d00';
                        applyTips.textContent = `⚠️ Version 1 要求全数字，负号只能出现在开头`;
                    } else {
                        applyTips.style.color = '#ff7d00';
                        applyTips.textContent = `⚠️ Version 1 要求全数字，当前包含非数字字符`;
                    }
                } else {
                    applyTips.style.color = '#ff7d00';
                    applyTips.textContent = `⚠️ Version 1 要求全数字`;
                }
            } else if (currentVersion === 'version2') {
                if (!/^[0-9A-Fa-f]+$/.test(val)) {
                    applyTips.style.color = '#ff7d00';
                    applyTips.textContent = `⚠️ Version 2 要求16进制字符（0-9, A-F, a-f），当前包含非法字符`;
                } else {
                    applyTips.style.color = '#ff7d00';
                    applyTips.textContent = `⚠️ Version 2 要求16位16进制字符（当前${actualLength}位）`;
                }
            } else if (currentVersion === 'version3') {
                if (!/^[0-9A-Fa-f]+$/.test(val)) {
                    applyTips.style.color = '#ff7d00';
                    applyTips.textContent = `⚠️ Version 3 要求16进制字符（0-9, A-F, a-f），当前包含非法字符`;
                } else {
                    applyTips.style.color = '#ff7d00';
                    applyTips.textContent = `⚠️ Version 3 要求10位16进制字符（当前${actualLength}位）`;
                }
            }
        }
    });

    // 版本切换时，重新验证申请码
    version1.addEventListener('change', () => {
        if (applyCode.value.trim()) {
            // 触发input事件重新验证
            const event = new Event('input');
            applyCode.dispatchEvent(event);
        }
    });

    version2.addEventListener('change', () => {
        if (applyCode.value.trim()) {
            const event = new Event('input');
            applyCode.dispatchEvent(event);
        }
    });

    version3.addEventListener('change', () => {
        if (applyCode.value.trim()) {
            const event = new Event('input');
            applyCode.dispatchEvent(event);
        }
    });
});