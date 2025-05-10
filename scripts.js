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

// 平台手续费计算逻辑（独立出来便于维护）
function getPlatformFee(activity, price) {
    switch (activity) {
        case "activity1":
            if (price < 17000) return 500;
            //else if (price < 23500) return 700;
            else return price * 0.03;
        case "activity2":
            if (price < 10000) return 500;
            else if (price <= 49999) return 1000;
            else if (price <= 99999) return 2000;
            else if (price <= 499999) return 4000;
            else if (price <= 999999) return 8000;
            else return 10000;
        case "activity3":
            return price * 0.00;  // 无平台手续费
        case "activity4":
            return price * 0.01;
        case "activity5":
            return price * 0.02;
        case "activity6":
            return price * 0.03;
        case "activity7":
            return price * 0.05;
        case "activity8":
            return price * 0.08;
      
        case "activity10":
            if (price < 5000) return 500;
            else if (price <= 20000) return price * 0.1;
            else return price * 0.05;
        case "activity11":
            if (price < 10000) return price * 0.15;
            else if (price <= 20000) return price * 0.10;
            else return price * 0.05;

        default:
            return 0;
    }
}

// 活动函数
const activities = {
    activity1: (price) => {
        if (price < 17000) return (price + 500) * 1.1;
        return price * 1.03 * 1.1;
    },
    activity2: (price) => {
        if (price < 10000) return (price + 500) * 1.1;
        if (price <= 49999) return (price + 1000) * 1.1;
        if (price <= 99999) return (price + 2000) * 1.1;
        if (price <= 499999) return (price + 4000) * 1.1;
        if (price <= 999999) return (price + 8000) * 1.1;
        return (price + 10000) * 1.1;
    },
    activity3: (price) => price * 1.1,
    activity4: (price) => price * 1.01 * 1.1,
    activity5: (price) => price * 1.02 * 1.1,
    activity6: (price) => price * 1.03 * 1.1,
    activity7: (price) => price * 1.05 * 1.1,
    activity8: (price) => price * 1.08 * 1.1,
    activity10: (price) => {
        if (price < 5000) return (price + 500) * 1.1;
        if (price <= 20000) return price * 1.1 * 1.1;
        return price * 1.05 * 1.1;
    },
    activity11: (price) => {
        if (price < 10000) return price * 1.15 * 1.1;
        if (price <= 20000) return price * 1.1 * 1.1;
        return price * 1.05 * 1.1;
    }
};

let selectedActivity = "activity1";// 默认活动

// 活动变更处理
function onActivityChange() {
    selectedActivity = document.getElementById("activity").value;
    calculatePrice();
}

// 正向计算
function calculatePrice() {
    if (isReversing) return; // 防止双向触发

    const currentPrice = parseFloat(currentPriceInput.value) || 0;
    const fee = (parseFloat(feeInput.value) || 0) / 100;

    // 调用对应活动逻辑
    const platformFee = getPlatformFee(selectedActivity, currentPrice);
    const productTax = currentPrice * 0.1;
    const platformTax = platformFee * 0.1;
    const activityCost = currentPrice + platformFee + productTax + platformTax;

    const feeDetail = currentPrice >= 300000 ? activityCost * (fee / 2) : activityCost * fee;
    const finalCost = activityCost + feeDetail;

    // 更新 UI
    const details = `（平台手续费${formatNumber(platformFee)} + 商品税${formatNumber(productTax)} + 手续费税${formatNumber(platformTax)}）`;

    activityCostOutput.textContent = `${formatNumber(activityCost)} ${details}`;
    feeCostOutput.textContent = formatNumber(feeDetail);
    finalPriceInput.value = Math.round(finalCost);
}

// 反向计算
function reverseCalculatePrice() {
    isReversing = true;

    const finalPrice = parseFloat(finalPriceInput.value) || 0;
    const fee = (parseFloat(feeInput.value) || 0) / 100;
    const basePrice = finalPrice / (1 + (finalPrice >= 300000 ? fee / 2 : fee));

    const estimatedPrice = (() => {
        switch (selectedActivity) {
            case "activity1":
                if (basePrice < (17000 + 500) * 1.1) return basePrice / 1.1 - 500;
                return basePrice / (1.03 * 1.1);
            case "activity2":
                if (basePrice < (10000 + 500) * 1.1) return basePrice / 1.1 - 500;
                if (basePrice <= (49999 + 1000) * 1.1) return basePrice / 1.1 - 1000;
                if (basePrice <= (99999 + 2000) * 1.1) return basePrice / 1.1 - 2000;
                if (basePrice <= (499999 + 4000) * 1.1) return basePrice / 1.1 - 4000;
                if (basePrice <= (999999 + 8000) * 1.1) return basePrice / 1.1 - 8000;
                return basePrice / 1.1 - 10000;
            case "activity3": return basePrice / 1.1;
            case "activity4": return basePrice / (1.01 * 1.1);
            case "activity5": return basePrice / (1.02 * 1.1);
            case "activity6": return basePrice / (1.03 * 1.1);
            case "activity7": return basePrice / (1.05 * 1.1);
            case "activity8": return basePrice / (1.08 * 1.1);
            case "activity10":
                if (basePrice < (5000 + 500) * 1.1) return basePrice / 1.1 - 500;
                if (basePrice <= 20000 * 1.1 * 1.1) return basePrice / 1.1 / 1.1;
                return basePrice / 1.1 / 1.05;
            case "activity11":
                if (basePrice < 10000 * 1.15 * 1.1) return basePrice / 1.1 / 1.15;
                if (basePrice <= 20000 * 1.1 * 1.1) return basePrice / 1.1 / 1.1;
                return basePrice / 1.1 / 1.05;
            default: return basePrice;
        }
    })();

    currentPriceInput.value = Math.round(estimatedPrice);

    const platformFee = getPlatformFee(selectedActivity, estimatedPrice);
    const productTax = estimatedPrice * 0.1;
    const platformTax = platformFee * 0.1;
    const activityCost = estimatedPrice + platformFee + productTax + platformTax;

    const feeDetail = estimatedPrice >= 300000 ? activityCost * (fee / 2) : activityCost * fee;
    const details = `（平台手续费${formatNumber(platformFee)} + 商品税${formatNumber(productTax)} + 手续费税${formatNumber(platformTax)}）`;

    activityCostOutput.textContent = `${formatNumber(activityCost)} ${details}`;
    feeCostOutput.textContent = formatNumber(feeDetail);

    isReversing = false;

}
