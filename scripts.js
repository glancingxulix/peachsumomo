// 获取各个元素
const currentPriceInput = document.getElementById("currentPrice");
const feeInput = document.getElementById("fee");
const finalPriceInput = document.getElementById("finalPrice");
const activityCostOutput = document.getElementById("activityCost");
const feeCostOutput = document.getElementById("feeCost");

let isReversing = false;  // 防止相互触发的标志

// 格式化数字为千位分隔符
function formatNumber(num) {
    return Math.round(num).toLocaleString();
}

// 活动计算逻辑
const activities = {
    activity1: (price) => 
        {
            if (price < 17000) return (price + 500) * 1.1;
            if (price < 23500) return (price + 700) * 1.1;
            return  price * 1.03 * 1.1;
        },

    activity2: (price) => {
        if (price < 10000) return (price + 500) * 1.1;
        if (price <= 49900) return (price + 1000) * 1.1;
        return (price + 2000) * 1.1;
    },
    activity3: (price) => price * 1.1,
    activity4: (price) => price * 1.03 * 1.1,
    activity5: (price) => price * 1.05 * 1.1,
    activity6: (price) => price * 1.08 * 1.1,
    activity7: (price) => price * 1.1 * 1.1,
    activity8: (price) => price * 1.15 * 1.1,
};

let selectedActivity = "activity1"; // 默认活动

// 更新活动
function onActivityChange() {
    selectedActivity = document.getElementById("activity").value;
    calculatePrice();
}

// 正向计算价格
function calculatePrice() {
    if (isReversing) return; // 防止双向触发

    const currentPrice = parseFloat(currentPriceInput.value) || 0;
    const fee = (parseFloat(feeInput.value) || 0) / 100;

    // 调用对应活动逻辑
    const activityCost = activities[selectedActivity](currentPrice);
    const feeDetail = currentPrice >= 300000 ? activityCost * (fee / 2) : activityCost * fee;
    const finalCost = activityCost + feeDetail;

    // 更新 UI
    activityCostOutput.textContent = formatNumber(activityCost); // 格式化为千位分隔符
    feeCostOutput.textContent = formatNumber(feeDetail);         // 格式化为千位分隔符
    finalPriceInput.value = Math.round(finalCost);
}

// 反向计算价格
function reverseCalculatePrice() {
    isReversing = true;

    const finalPrice = parseFloat(finalPriceInput.value) || 0; // 获取到手价格
    const fee = (parseFloat(feeInput.value) || 0) / 100; // 手续费百分比

    // 去掉手续费部分
    const basePrice = finalPrice / (1 + (finalPrice >= 300000 ? fee / 2 : fee));

    // 根据活动逻辑反向计算当前价格
    const estimatedPrice = (() => {
        switch (selectedActivity) {
            case "activity1":
                if (basePrice < (17000 + 500) * 1.1) {
                    return basePrice / 1.1 - 500; // 对应 (price + 500) * 1.1
                } else if (basePrice < (23500 + 700) * 1.1) {
                    return basePrice / 1.1 - 700; // 对应 (price + 700) * 1.1
                } else {
                    return basePrice / (1.03 * 1.1); // 对应 price * 1.03 * 1.1
                }

            case "activity2":
                if (basePrice < (10000 + 500) * 1.1) {
                    return basePrice / 1.1 - 500; // 对应 (price + 500) * 1.1
                } else if (basePrice <= (49900 + 1000) * 1.1) {
                    return basePrice / 1.1 - 1000; // 对应 (price + 1000) * 1.1
                } else {
                    return basePrice / 1.1 - 2000; // 对应 (price + 2000) * 1.1
                }

            case "activity3": return basePrice / 1.1;
            case "activity4": return basePrice / (1.03 * 1.1);
            case "activity5": return basePrice / (1.05 * 1.1);
            case "activity6": return basePrice / (1.08 * 1.1);
            case "activity7": return basePrice / (1.1 * 1.1);
            case "activity8": return basePrice / (1.15 * 1.1);

            default: return basePrice; // 默认直接返回 basePrice
        }
    })();

    currentPriceInput.value = Math.round(estimatedPrice); // 更新当前价格输入框

    // 更新活动商品到手价和手续费
    const activityCost = activities[selectedActivity](estimatedPrice); // 活动商品价格
    const feeDetail = estimatedPrice >= 300000 ? activityCost * (fee / 2) : activityCost * fee;

    // 更新到手价格的细节部分
    activityCostOutput.textContent = formatNumber(activityCost); // 格式化为千位分隔符
    feeCostOutput.textContent = formatNumber(feeDetail);         // 格式化为千位分隔符

    isReversing = false;
}
