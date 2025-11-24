
import { useState, useEffect } from 'react';

const MEDICOINS_KEY = 'mediCoins';
const INVENTORY_KEY = 'mediCoinsInventory';
const UPGRADES_KEY = 'mediCoinsUpgrades';

export const useMediCoins = () => {
  const [balance, setBalance] = useState(0);
  const [inventory, setInventory] = useState({});
  const [upgrades, setUpgrades] = useState({});

  // Cargar datos iniciales
  useEffect(() => {
    const savedBalance = localStorage.getItem(MEDICOINS_KEY);
    const savedInventory = localStorage.getItem(INVENTORY_KEY);
    const savedUpgrades = localStorage.getItem(UPGRADES_KEY);

    if (savedBalance) setBalance(parseInt(savedBalance, 10));
    if (savedInventory) setInventory(JSON.parse(savedInventory));
    if (savedUpgrades) setUpgrades(JSON.parse(savedUpgrades));
  }, []);

  // Guardar balance
  const saveBalance = (newBalance) => {
    setBalance(newBalance);
    localStorage.setItem(MEDICOINS_KEY, newBalance.toString());
  };

  // Guardar inventario
  const saveInventory = (newInventory) => {
    setInventory(newInventory);
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(newInventory));
  };

  // Guardar upgrades
  const saveUpgrades = (newUpgrades) => {
    setUpgrades(newUpgrades);
    localStorage.setItem(UPGRADES_KEY, JSON.stringify(newUpgrades));
  };

  // Ganar coins
  const earnCoins = (amount, reason = '') => {
    const newBalance = balance + amount;
    saveBalance(newBalance);
    console.log(`💰 Ganaste ${amount} MediCoins! Razón: ${reason}`);
    return newBalance;
  };

  // Gastar coins
  const spendCoins = (amount) => {
    if (balance < amount) return false;
    const newBalance = balance - amount;
    saveBalance(newBalance);
    return true;
  };

  // Comprar item consumible
  const buyConsumable = (itemId, itemName, price) => {
    if (!spendCoins(price)) return false;

    const newInventory = { ...inventory };
    newInventory[itemId] = (newInventory[itemId] || 0) + 1;
    saveInventory(newInventory);
    console.log(`🛍️ Compraste: ${itemName}`);
    return true;
  };

  // Usar item consumible
  const useConsumable = (itemId) => {
    if (!inventory[itemId] || inventory[itemId] <= 0) return false;

    const newInventory = { ...inventory };
    newInventory[itemId] -= 1;
    if (newInventory[itemId] === 0) delete newInventory[itemId];
    saveInventory(newInventory);
    console.log(`✅ Usaste item: ${itemId}`);
    return true;
  };

  // Comprar upgrade permanente
  const buyUpgrade = (upgradeId, upgradeName, price) => {
    if (upgrades[upgradeId]) return false; // Ya comprado
    if (!spendCoins(price)) return false;

    const newUpgrades = { ...upgrades, [upgradeId]: true };
    saveUpgrades(newUpgrades);
    console.log(`⬆️ Upgrade comprado: ${upgradeName}`);
    return true;
  };

  // Verificar si tiene upgrade
  const hasUpgrade = (upgradeId) => {
    return upgrades[upgradeId] === true;
  };

  // Obtener cantidad de item
  const getItemCount = (itemId) => {
    return inventory[itemId] || 0;
  };

  return {
    balance,
    inventory,
    upgrades,
    earnCoins,
    spendCoins,
    buyConsumable,
    useConsumable,
    buyUpgrade,
    hasUpgrade,
    getItemCount
  };
};
