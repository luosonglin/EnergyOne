<template>
  <div class="analysis">
    <!-- 顶部筛选器 -->
    <div class="filter-container">
      <div class="filter-controls">
        <el-cascader
          :options="selectedDepartment"
          :props="props"
          :show-all-levels="true"
          collapse-tags-tooltip
          collapse-tags
          clearable
          size="small"
          placeholder="部门"
          class="filter-item"
        />
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          size="small"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="filter-item"
        />
        <el-radio-group v-model="timeRange" size="small" class="filter-item">
          <el-radio-button :value="'day'">日</el-radio-button>
          <el-radio-button :value="'week'">周</el-radio-button>
          <el-radio-button :value="'month'">月</el-radio-button>
          <el-radio-button :value="'year'">年</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="chart-container">
      <div class="chart-layout">
        <!-- 左侧布局 -->
        <div class="left-section">
          <!-- 能耗分析 -->
          <div class="chart-section">
            <div class="chart-title">能耗分析</div>
            <div ref="energyAnalysisChart" class="main-chart"></div>
          </div>

          <!-- 产量与单耗趋势 & 用电安全分析 -->
          <div class="chart-grid">
            <div class="chart-item">
              <div class="chart-title">产量与单耗趋势</div>
              <div ref="productionChart" class="chart"></div>
            </div>
            <div class="chart-item">
              <div class="chart-title">用电安全分析</div>
              <div ref="safetyChart" class="chart"></div>
            </div>
          </div>

          <!-- 功率因数分析 -->
          <div class="chart-section">
            <div class="chart-title">功率因数分析</div>
            <div ref="powerFactorChart" class="chart"></div>
          </div>
        </div>

        <!-- 右侧布局 -->
        <div class="right-section">
          <!-- 电量预测 -->
          <div class="chart-item">
            <div class="chart-title">电量预测</div>
            <div ref="forecastChart" class="chart"></div>
          </div>

          <!-- 用水趋势 -->
          <div class="chart-item">
            <div class="chart-title">用水趋势</div>
            <div ref="waterTrendChart" class="chart"></div>
          </div>

          <!-- 用汽趋势 -->
          <div class="chart-item">
            <div class="chart-title">用汽趋势</div>
            <div ref="steamTrendChart" class="chart"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

const timeRange = ref('month')
const dateRange = ref([])
const props = { multiple: true }
const selectedDepartment = ref([
  {
    value: 'honglingCopper',
    label: '红岭铜矿',
    children: [
      {
        value: 'mining',
        label: '采矿车间',
        children: [
          {
            value: 'excavation',
            label: '采掘'
          },
          {
            value: 'lifting',
            label: '提升'
          },
          {
            value: 'pressureVent',
            label: '压风'
          },
          {
            value: 'ventilation',
            label: '通风'
          }
        ]
      },
      {
        value: 'processing',
        label: '选矿车间',
        children: [
          {
            value: 'crushing2000',
            label: '碎矿(2000T)'
          },
          {
            value: 'crushing3000',
            label: '碎矿(3000T)'
          },
          {
            value: 'grinding2000',
            label: '磨矿(2000T)'
          },
          {
            value: 'grinding3000',
            label: '磨矿(3000T)'
          },
          {
            value: 'floating2000',
            label: '浮选(2000T)'
          },
          {
            value: 'floating3000',
            label: '浮选(3000T)'
          }
        ]
      },
      {
        value: 'maintenance',
        label: '动修车间'
      },
      {
        value: 'powerSupply',
        label: '机动'
      },
      {
        value: 'logistics',
        label: '后勤、生活'
      }
    ]
  },
  {
    value: 'scienceCity',
    label: '科学城集团总部',
    children: [
      {
        value: 'powerStation',
        label: '配电房'
      }
    ]
  },
  {
    value: 'machineRoom',
    label: '机房',
    children: [
      {
        value: 'machineRoom1',
        label: '一楼机房'
      },
      {
        value: 'machineRoom2',
        label: '二楼机房'
      },
      {
        value: 'machineRoom3',
        label: '三楼机房'
      }
    ]
  }
])
const energyAnalysisChart = ref(null)
const waterTrendChart = ref(null)
const steamTrendChart = ref(null)
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
      orient: 'horizontal',
      right: '4%',
      top: '0%',
      itemWidth: 15,
      itemHeight: 10,
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      top: '40px',
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

const initWaterTrendChart = () => {
  const chart = echarts.init(waterTrendChart.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      orient: 'horizontal',
      right: '4%',
      top: '0%',
      itemWidth: 15,
      itemHeight: 10,
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      top: '40px',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
    },
    yAxis: {
      type: 'value',
      name: '用水量(m³)'
    },
    series: [
      {
        name: '用水量',
        type: 'line',
        smooth: true,
        data: [320, 332, 301, 334, 390, 330, 320],
        itemStyle: { color: '#67C23A' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(103,194,58,0.3)' },
              { offset: 1, color: 'rgba(103,194,58,0.1)' }
            ]
          }
        }
      }
    ]
  }
  chart.setOption(option)
}

const initSteamTrendChart = () => {
  const chart = echarts.init(steamTrendChart.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      orient: 'horizontal',
      right: '4%',
      top: '0%',
      itemWidth: 15,
      itemHeight: 10,
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      top: '40px',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
    },
    yAxis: {
      type: 'value',
      name: '用汽量(t)'
    },
    series: [
      {
        name: '用汽量',
        type: 'line',
        smooth: true,
        data: [150, 212, 201, 154, 190, 330, 410],
        itemStyle: { color: '#E6A23C' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(230,162,60,0.3)' },
              { offset: 1, color: 'rgba(230,162,60,0.1)' }
            ]
          }
        }
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
      orient: 'horizontal',
      right: '4%',
      top: '0%',
      itemWidth: 15,
      itemHeight: 10,
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      top: '40px',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
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
      orient: 'horizontal',
      right: '4%',
      top: '0%',
      itemWidth: 15,
      itemHeight: 10,
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      top: '40px',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
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
      orient: 'horizontal',
      right: '4%',
      top: '0%',
      itemWidth: 15,
      itemHeight: 10,
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      top: '40px',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
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
    legend: {
      orient: 'horizontal',
      right: '4%',
      top: '0%',
      itemWidth: 15,
      itemHeight: 10,
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      top: '40px',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
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
  initWaterTrendChart()
  initSteamTrendChart()
  initProductionChart()
  initSafetyChart()
  initForecastChart()
  initPowerFactorChart()
})

watch([timeRange, dateRange, () => selectedDepartment.value], () => {
  updateChartData()
})

const updateChartData = () => {
  initEnergyAnalysisChart()
  initWaterTrendChart()
  initSteamTrendChart()
  initProductionChart()
  initSafetyChart()
  initForecastChart()
  initPowerFactorChart()
}
</script>

<script>
export default {
  name: 'AnalysisView'
}
</script>

<style scoped>
.analysis {
  margin-top: -32px;
  padding: 0;
  background-color: #f5f7fa;
  height: calc(100vh - 52px);
  display: flex;
  flex-direction: column;
}

.filter-container {
  background-color: white;
  padding: 12px 26px;
  margin-bottom: 6px;
}

.filter-controls {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  align-items: center;
}

.filter-item {
  min-width: 120px;
}

.chart-container {
  flex: 1;
  padding: 6px 0;
  /* overflow: auto; */
}

.chart-layout {
  display: flex;
  gap: 16px;
  height: 100%;
}

.left-section {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0; /* 防止flex子项溢出 */
}

.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0; /* 防止flex子项溢出 */
}

.chart-section {
  background-color: white;
  padding: 16px;
  border-radius: 4px;
  flex: 0 0 auto;
}

.chart-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.chart-item {
  background-color: white;
  padding: 16px;
  border-radius: 4px;
}

.chart-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 12px;
}

.main-chart {
  height: 360px;
}

.chart {
  height: 260px;
}

/* 响应式调整 */
@media (max-width: 1400px) {
  .chart-layout {
    flex-direction: column;
  }

  .left-section,
  .right-section {
    flex: none;
  }

  .main-chart {
    height: 300px;
  }

  .chart {
    height: 240px;
  }
}

@media (max-width: 768px) {
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-item {
    width: 100%;
  }

  .chart-grid {
    grid-template-columns: 1fr;
  }
}
</style>