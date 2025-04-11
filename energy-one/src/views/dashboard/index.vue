<template>
  <div class="dashboard">
    <!-- 顶部卡片统计 -->
    <a-row :gutter="24">
      <a-col :span="6" v-for="(item, index) in statistics" :key="index">
        <a-card bordered style="margin-bottom: 24px;">
          <a-statistic
            :title="item.title"
            :value="item.value"
            :suffix="item.label"
            valueStyle="{ fontSize: '24px', fontWeight: 'bold' }"
          />
        </a-card>
      </a-col>
    </a-row>

    <!-- 能耗趋势图 -->
    <el-row :gutter="16" class="chart-row">
      <el-col :span="16">
        <el-card class="modern-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">能耗趋势</span>
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="year">全年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="trendChart" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="modern-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">能源分布</span>
            </div>
          </template>
          <div ref="categoryChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 实时监控数据 -->
    <el-row :gutter="16" class="chart-row">
      <el-col :span="12">
        <el-card class="modern-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">实时功率曲线</span>
            </div>
          </template>
          <div ref="powerChart" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="modern-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">重点设备能耗排行</span>
            </div>
          </template>
          <el-table :data="deviceRanking" style="width: 100%" :header-cell-style="tableHeaderStyle">
            <el-table-column prop="name" label="设备名称" />
            <el-table-column prop="energy" label="能耗" width="120">
              <template #default="{ row }">
                {{ row.energy }} kWh
              </template>
            </el-table-column>
            <el-table-column prop="ratio" label="占比" width="180">
              <template #default="{ row }">
                <div class="ratio-wrapper">
                  <el-progress :percentage="row.ratio" :color="getProgressColor(row.ratio)" :show-text="false" />
                  <span class="ratio-text">{{ row.ratio }}%</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { Row as ARow, Col as ACol, Card as ACard, Statistic as AStatistic } from 'ant-design-vue'

const timeRange = ref('month')
const trendChart = ref(null)
const categoryChart = ref(null)
const powerChart = ref(null)

// 顶部统计数据
const statistics = ref([
  { title: '总用电量', value: '4,500,000', label: '千瓦时' },
  { title: '总用水量', value: '180,000', label: '立方米' },
  { title: '天然气用量', value: '108,000', label: '立方米' },
  { title: '综合能耗', value: '6,280', label: '吨标煤' }
])

// 设备能耗排行
const deviceRanking = ref([
  { name: 'A区主变压器', energy: 1250, ratio: 25 },
  { name: 'B区空压机组', energy: 850, ratio: 17 },
  { name: '中央空调系统', energy: 720, ratio: 14 },
  { name: '生产线1号机组', energy: 680, ratio: 13 },
  { name: '污水处理设备', energy: 450, ratio: 9 }
])

const tableHeaderStyle = {
  background: '#f5f7fa',
  color: '#606266',
  fontWeight: '500',
  height: '44px'
}

// 获取进度条颜色
const getProgressColor = (ratio) => {
  if (ratio > 20) return '#F56C6C'
  if (ratio > 10) return '#E6A23C'
  return '#67C23A'
}

// 初始化能耗趋势图
const initTrendChart = () => {
  const chart = echarts.init(trendChart.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#eee',
      borderWidth: 1,
      textStyle: { color: '#666' }
    },
    legend: {
      data: ['电力', '水', '天然气', '蒸汽'],
      bottom: '0',
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      textStyle: { color: '#666' }
    },
    grid: {
      top: '5%',
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: { lineStyle: { color: '#eee' } }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#eee' } }
    },
    series: [
      {
        name: '电力',
        type: 'line',
        smooth: true,
        data: [120, 132, 101, 134, 90, 230, 210],
        itemStyle: { color: '#409EFF' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(64,158,255,0.2)' },
              { offset: 1, color: 'rgba(64,158,255,0)' }
            ]
          }
        }
      },
      {
        name: '水',
        type: 'line',
        smooth: true,
        data: [220, 182, 191, 234, 290, 330, 310],
        itemStyle: { color: '#67C23A' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(103,194,58,0.2)' },
              { offset: 1, color: 'rgba(103,194,58,0)' }
            ]
          }
        }
      },
      {
        name: '天然气',
        type: 'line',
        smooth: true,
        data: [150, 232, 201, 154, 190, 330, 410],
        itemStyle: { color: '#E6A23C' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(230,162,60,0.2)' },
              { offset: 1, color: 'rgba(230,162,60,0)' }
            ]
          }
        }
      },
      {
        name: '蒸汽',
        type: 'line',
        smooth: true,
        data: [320, 332, 301, 334, 390, 330, 320],
        itemStyle: { color: '#909399' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(144,147,153,0.2)' },
              { offset: 1, color: 'rgba(144,147,153,0)' }
            ]
          }
        }
      }
    ]
  }
  chart.setOption(option)
}

// 初始化能源分布图
const initCategoryChart = () => {
  const chart = echarts.init(categoryChart.value)
  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#eee',
      borderWidth: 1,
      textStyle: { color: '#666' }
    },
    legend: {
      orient: 'horizontal',
      bottom: '0',
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      textStyle: { color: '#666' }
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold'
          }
        },
        labelLine: { show: false },
        data: [
          { value: 45, name: '电力', itemStyle: { color: '#409EFF' } },
          { value: 25, name: '水', itemStyle: { color: '#67C23A' } },
          { value: 20, name: '天然气', itemStyle: { color: '#E6A23C' } },
          { value: 10, name: '蒸汽', itemStyle: { color: '#909399' } }
        ]
      }
    ]
  }
  chart.setOption(option)
}

// 初始化实时功率图
const initPowerChart = () => {
  const chart = echarts.init(powerChart.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#eee',
      borderWidth: 1,
      textStyle: { color: '#666' }
    },
    grid: {
      top: '5%',
      left: '3%',
      right: '4%',
      bottom: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
      axisLine: { lineStyle: { color: '#eee' } }
    },
    yAxis: {
      type: 'value',
      name: 'kW',
      splitLine: { lineStyle: { color: '#eee' } }
    },
    series: [
      {
        type: 'line',
        smooth: true,
        data: [820, 932, 1200, 934, 1290, 1330, 920],
        itemStyle: { color: '#409EFF' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(64,158,255,0.2)' },
              { offset: 1, color: 'rgba(64,158,255,0)' }
            ]
          }
        }
      }
    ]
  }
  chart.setOption(option)
}

onMounted(() => {
  initTrendChart()
  initCategoryChart()
  initPowerChart()
})
</script>

<script>
export default {
  name: 'DashboardView'
}
</script>

<style scoped>
.dashboard {
  margin-top: -32px;
  padding: 16px;
  background-color: #f6f8fa;
  min-height: calc(100vh - 84px);
}

.a-card {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.a-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.chart-container {
  height: 300px;
  padding: 16px;
}

.chart-row {
  margin-top: 0;
}

:deep(.el-card__body) {
  padding: 0;
}

:deep(.el-table) {
  background: transparent;
}

:deep(.el-table th) {
  background-color: #fafafa !important;
  font-weight: 600;
  color: #1a1a1a;
  height: 40px;
}

:deep(.el-table td) {
  padding: 12px 0;
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
  background-color: #f8f9fa;
}

.ratio-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ratio-text {
  min-width: 40px;
  color: #666;
}

:deep(.el-progress-bar__outer) {
  background-color: #f0f2f5;
  height: 6px !important;
}

:deep(.el-progress-bar__inner) {
  border-radius: 3px;
}

:deep(.el-radio-group) {
  background: #f6f8fa;
  padding: 2px;
  border-radius: 6px;
}

:deep(.el-radio-button__inner) {
  border: none !important;
  background: transparent;
  padding: 4px 12px;
  font-size: 12px;
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  border-radius: 3px;
  color: #409EFF;
}

:deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-radius: 3px;
}

:deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 3px;
}
</style> 