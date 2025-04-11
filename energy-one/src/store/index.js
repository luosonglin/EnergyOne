import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    // Mock data for energy consumption
    energyData: {
      electricity: {
        yesterday: 12500,
        thisMonth: 375000,
        thisYear: 4500000,
        dailyTrend: [
          { date: '2024-04-01', value: 12000 },
          { date: '2024-04-02', value: 12500 },
          { date: '2024-04-03', value: 13000 },
          { date: '2024-04-04', value: 12800 },
          { date: '2024-04-05', value: 13200 },
          { date: '2024-04-06', value: 12500 },
          { date: '2024-04-07', value: 12000 }
        ],
        categoryDistribution: [
          { name: '生产用电', value: 60 },
          { name: '非生产用电', value: 25 },
          { name: '辅助用电', value: 15 }
        ]
      },
      water: {
        yesterday: 500,
        thisMonth: 15000,
        thisYear: 180000
      },
      gas: {
        yesterday: 300,
        thisMonth: 9000,
        thisYear: 108000
      },
      steam: {
        yesterday: 200,
        thisMonth: 6000,
        thisYear: 72000
      }
    },
    // Mock data for alarms
    alarms: [
      {
        id: 1,
        level: 'high',
        type: 'electricity',
        message: 'A区用电量异常',
        time: '2024-04-10 10:30:00',
        status: 'unhandled'
      },
      {
        id: 2,
        level: 'medium',
        type: 'water',
        message: 'B区水压异常',
        time: '2024-04-10 09:15:00',
        status: 'handled'
      }
    ]
  }),
  getters: {
    getEnergyData: (state) => state.energyData,
    getAlarms: (state) => state.alarms
  },
  actions: {
    // Add methods for data manipulation here
  }
}) 