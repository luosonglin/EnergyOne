<template>
  <div class="analysis">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>能耗分析</span>
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button label="day">日</el-radio-button>
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
                <el-radio-button label="year">年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="energyAnalysisChart" style="height: 400px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>产量与单耗趋势</span>
            </div>
          </template>
          <div ref="productionChart" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>用电安全分析</span>
            </div>
          </template>
          <div ref="safetyChart" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>电量预测</span>
            </div>
          </template>
          <div ref="forecastChart" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>功率因数分析</span>
            </div>
          </template>
          <div ref="powerFactorChart" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const timeRange = ref('month')
const energyAnalysisChart = ref(null)
const productionChart = ref(null)
const safetyChart = ref(null)
const forecastChart = ref(null)
const powerFactorChart = ref(null)

const initEnergyAnalysisChart = () => {
  const chart = echarts.init(energyAnalysisChart.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['电力', '水', '天然气', '蒸汽']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxis: {
      type: 'value',
      name: '消耗量'
    },
    series: [
      {
        name: '电力',
        type: 'bar',
        data: [320, 302, 341, 374, 390, 450, 420, 380, 360, 340, 320, 310]
      },
      {
        name: '水',
        type: 'bar',
        data: [120, 132, 101, 134, 90, 230, 210, 180, 160, 140, 120, 110]
      },
      {
        name: '天然气',
        type: 'bar',
        data: [220, 182, 191, 234, 290, 330, 310, 280, 260, 240, 220, 210]
      },
      {
        name: '蒸汽',
        type: 'bar',
        data: [150, 212, 201, 154, 190, 330, 410, 380, 360, 340, 320, 310]
      }
    ]
  }
  chart.setOption(option)
}

const initProductionChart = () => {
  const chart = echarts.init(productionChart.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['产量', '单耗']
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: [
      {
        type: 'value',
        name: '产量',
        position: 'left'
      },
      {
        type: 'value',
        name: '单耗',
        position: 'right'
      }
    ],
    series: [
      {
        name: '产量',
        type: 'bar',
        data: [320, 302, 341, 374, 390, 450]
      },
      {
        name: '单耗',
        type: 'line',
        yAxisIndex: 1,
        data: [0.8, 0.82, 0.79, 0.81, 0.78, 0.75]
      }
    ]
  }
  chart.setOption(option)
}

const initSafetyChart = () => {
  const chart = echarts.init(safetyChart.value)
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '用电安全',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 85, name: '安全' },
          { value: 10, name: '警告' },
          { value: 5, name: '危险' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  chart.setOption(option)
}

const initForecastChart = () => {
  const chart = echarts.init(forecastChart.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['实际', '预测']
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
    },
    yAxis: {
      type: 'value',
      name: '电量 (kWh)'
    },
    series: [
      {
        name: '实际',
        type: 'line',
        data: [320, 302, 341, 374, 390, 450, 420]
      },
      {
        name: '预测',
        type: 'line',
        data: [310, 320, 330, 340, 350, 360, 370],
        lineStyle: {
          type: 'dashed'
        }
      }
    ]
  }
  chart.setOption(option)
}

const initPowerFactorChart = () => {
  const chart = echarts.init(powerFactorChart.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
      type: 'value',
      name: '功率因数',
      min: 0.8,
      max: 1
    },
    series: [
      {
        data: [0.95, 0.96, 0.94, 0.95, 0.96, 0.95],
        type: 'line',
        smooth: true,
        markLine: {
          data: [
            { type: 'average', name: '平均值' }
          ]
        }
      }
    ]
  }
  chart.setOption(option)
}

onMounted(() => {
  initEnergyAnalysisChart()
  initProductionChart()
  initSafetyChart()
  initForecastChart()
  initPowerFactorChart()
})
</script>

<script>
export default {
  name: 'AnalysisView'
}
</script>

<style scoped>
.analysis {
  margin-top: -32px;
  padding: 16px 0 16px 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-row {
  margin-top: 20px;
}
</style> 