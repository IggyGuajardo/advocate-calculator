import React, { useState, useEffect } from 'react';

const CommissionCalculator = () => {
  const [formData, setFormData] = useState({
    grossAddGoal: 20,
    accessoryGoal: 500,
    plans30: 0,
    plans40: 0,
    plans55: 0,
    plans60: 0,
    upgrades: 0,
    autoPayEnabled: 0,
    protectEnabled: 0,
    accessoriesValue: 0,
    grossAddsWith40Plus: 0,
    pppAccessoryRevenue: 0,
    aiaCount: 0
  });

  const [results, setResults] = useState({
    planCommission: 0,
    upgradeCommission: 0,
    autoPayCommission: 0,
    protectCommission: 0,
    accessoriesCommission: 0,
    pppCommission: 0,
    aiaCommission: 0,
    performanceMultiplier: 0,
    totalCommission: 0,
    grossAddPercentage: 0,
    performanceTier: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value) || 0
    });
  };

  // Calculate commissions whenever form data changes
  useEffect(() => {
    calculateCommission();
  }, [formData]);

  const calculateCommission = () => {
    // Plan commissions
    const plan30Commission = 0;
    const plan40Commission = formData.plans40 * 2;
    const plan55Commission = formData.plans55 * 5;
    const plan60Commission = formData.plans60 * 6;
    const totalPlanCommission = plan30Commission + plan40Commission + plan55Commission + plan60Commission;

    // Upgrade commission
    const upgradeCommission = formData.upgrades * 3;

    // Total gross adds
    const totalGrossAdds = formData.plans30 + formData.plans40 + formData.plans55 + formData.plans60;
    
    // Gross Add percentage of goal
    const grossAddPercentage = (totalGrossAdds / formData.grossAddGoal) * 100;

    // Determine performance tier
    let performanceTier = "";
    let performanceMultiplier = 0;
    
    if (grossAddPercentage <= 70) {
      performanceTier = "0% (0-70% of goal)";
      performanceMultiplier = 0;
    } else if (grossAddPercentage <= 80) {
      performanceTier = "50% (71-80% of goal)";
      performanceMultiplier = 0.5;
    } else if (grossAddPercentage <= 119) {
      performanceTier = "100% (81-119% of goal)";
      performanceMultiplier = grossAddPercentage / 100;
    } else {
      performanceTier = "120% (120%+ of goal)";
      performanceMultiplier = 1.2;
    }

    // Check if goal is reached for Auto Pay and Protect bonuses
    const isGoalReached = grossAddPercentage >= 100 || formData.accessoriesValue >= formData.accessoryGoal;
    
    // Auto Pay and Protect commissions
    const autoPayCommission = isGoalReached ? formData.autoPayEnabled * 1 : 0;
    const protectCommission = isGoalReached ? formData.protectEnabled * 1 : 0;

    // Accessories commission (standard 7%)
    const baseAccessoriesCommission = formData.accessoriesValue * 0.07;
    
    // PPP commissions
    const pppGrossAddCommission = formData.grossAddsWith40Plus * 1;
    const pppAccessoriesCommission = formData.pppAccessoryRevenue * 0.03;
    const totalPppCommission = pppGrossAddCommission + pppAccessoriesCommission;

    // AIA commission ($20 per, but not included in main total as it's paid after 90 days)
    const aiaCommission = formData.aiaCount * 20;

    // Calculate total commission before performance multiplier
    const subtotalCommission = totalPlanCommission + upgradeCommission + autoPayCommission + 
                             protectCommission + baseAccessoriesCommission + totalPppCommission;
    
    // Apply performance multiplier
    const totalCommission = subtotalCommission * performanceMultiplier;

    setResults({
      planCommission: totalPlanCommission,
      upgradeCommission,
      autoPayCommission,
      protectCommission,
      accessoriesCommission: baseAccessoriesCommission,
      pppCommission: totalPppCommission,
      aiaCommission,
      performanceMultiplier,
      totalCommission,
      grossAddPercentage,
      performanceTier,
    });
  };

  return (
    <div className="p-4 max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Employee Commission Calculator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-100 p-3 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Goals</h2>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium mb-1">Gross Add Goal</label>
              <input
                type="number"
                name="grossAddGoal"
                value={formData.grossAddGoal}
                onChange={handleInputChange}
                className="w-full p-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Accessory Goal ($)</label>
              <input
                type="number"
                name="accessoryGoal"
                value={formData.accessoryGoal}
                onChange={handleInputChange}
                className="w-full p-1 border rounded"
              />
            </div>
          </div>

          <h2 className="text-lg font-semibold mt-3 mb-2">Plans</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">$30 Plans</label>
              <input
                type="number"
                name="plans30"
                value={formData.plans30}
                onChange={handleInputChange}
                className="w-full p-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">$40 Plans</label>
              <input
                type="number"
                name="plans40"
                value={formData.plans40}
                onChange={handleInputChange}
                className="w-full p-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">$55 Plans</label>
              <input
                type="number"
                name="plans55"
                value={formData.plans55}
                onChange={handleInputChange}
                className="w-full p-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">$60 Plans</label>
              <input
                type="number"
                name="plans60"
                value={formData.plans60}
                onChange={handleInputChange}
                className="w-full p-1 border rounded"
              />
            </div>
          </div>

          <h2 className="text-lg font-semibold mt-3 mb-2">Additional Metrics</h2>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-medium mb-1">Upgrades</label>
              <input
                type="number"
                name="upgrades"
                value={formData.upgrades}
                onChange={handleInputChange}
                className="w-full p-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Auto Pay</label>
              <input
                type="number"
                name="autoPayEnabled"
                value={formData.autoPayEnabled}
                onChange={handleInputChange}
                className="w-full p-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Protect</label>
              <input
                type="number"
                name="protectEnabled"
                value={formData.protectEnabled}
                onChange={handleInputChange}
                className="w-full p-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Accessory Revenue ($)</label>
              <input
                type="number"
                name="accessoriesValue"
                value={formData.accessoriesValue}
                onChange={handleInputChange}
                className="w-full p-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">PPP Activations $40+</label>
              <input
                type="number"
                name="grossAddsWith40Plus"
                value={formData.grossAddsWith40Plus}
                onChange={handleInputChange}
                className="w-full p-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">PPP Accessory Rev ($)</label>
              <input
                type="number"
                name="pppAccessoryRevenue"
                value={formData.pppAccessoryRevenue}
                onChange={handleInputChange}
                className="w-full p-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">AIA Count</label>
              <input
                type="number"
                name="aiaCount"
                value={formData.aiaCount}
                onChange={handleInputChange}
                className="w-full p-1 border rounded"
              />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Commission Calculation</h2>
          
          <div className="mb-3">
            <div className="bg-blue-100 p-3 rounded-lg mb-2">
              <div className="flex justify-between font-semibold">
                <span>Gross Add Goal Completion:</span>
                <span>{results.grossAddPercentage.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Performance Tier:</span>
                <span>{results.performanceTier}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-1 mb-3">
            <div className="flex justify-between">
              <span>Plan Commission:</span>
              <span>${results.planCommission.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Upgrade Commission:</span>
              <span>${results.upgradeCommission.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Auto Pay Commission:</span>
              <span>${results.autoPayCommission.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Protect Commission:</span>
              <span>${results.protectCommission.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Accessories Commission (7%):</span>
              <span>${results.accessoriesCommission.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>PPP Commission:</span>
              <span>${results.pppCommission.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t mt-1 pt-1">
              <span>Subtotal:</span>
              <span>${(results.planCommission + results.upgradeCommission + results.autoPayCommission + 
                      results.protectCommission + results.accessoriesCommission + results.pppCommission).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Performance Multiplier:</span>
              <span>×{results.performanceMultiplier.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="bg-blue-500 text-white p-3 rounded-lg mb-4">
            <div className="flex justify-between text-lg font-bold">
              <span>TOTAL COMMISSION:</span>
              <span>${results.totalCommission.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="bg-gray-100 p-3 rounded-lg">
            <div className="flex justify-between">
              <span>AIA Commission (paid after 90 days):</span>
              <span>${results.aiaCommission.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionCalculator;
