<template>
  <div class="dashboard">
    <!-- 顶部欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1>欢迎使用 EnergyOne</h1>
        <p>实时监控企业能源使用情况，助力节能减排</p>
      </div>
      <div class="quick-actions">
        <el-button type="primary" icon="Plus">新增设备</el-button>
        <el-button type="success" icon="Document">生成报表</el-button>
        <el-button type="warning">
          <el-icon><Bell /></el-icon>
          <span>查看告警</span>
        </el-button>
      </div>
    </div>

    <!-- 实时告警区域 -->
    <div class="alert-banner" v-if="alerts.length > 0">
      <div class="alert-navigation">
        <el-button 
          :disabled="currentAlertIndex === 0" 
          @click="currentAlertIndex--"
          class="nav-button"
          text
        >
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <span class="alert-counter">{{ currentAlertIndex + 1 }} / {{ alerts.length }}</span>
        <el-button 
          :disabled="currentAlertIndex === alerts.length - 1" 
          @click="currentAlertIndex++"
          class="nav-button"
          text
        >
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
      <div class="alert-content">
        <el-icon class="alert-icon" :class="alerts[currentAlertIndex].level">
          <component :is="iconMap[alerts[currentAlertIndex].level]" />
        </el-icon>
        <span class="alert-message">{{ alerts[currentAlertIndex].message }}</span>
      </div>
      <div class="alert-actions">
        <el-button type="primary" size="small" @click="handleAction">处理</el-button>
        <el-button link @click="handleDismiss">关闭</el-button>
      </div>
    </div>

    <!-- 顶部卡片统计 -->
    <el-row :gutter="8" class="statistics-row">
      <el-col :xs="24" :sm="12" :md="6" :lg="3" v-for="(item, index) in statistics" :key="index">
        <el-card class="statistic-card" :body-style="{ padding: '12px' }">
          <div class="statistic-header">
            <el-icon :style="{ color: item.color }">
              <component :is="item.icon" />
            </el-icon>
            <span class="statistic-title">{{ item.title }}</span>
          </div>
          <div class="statistic-content">
            <div class="statistic-value" :style="{ color: item.color }">{{ item.value }}</div>
            <div class="statistic-footer">
              <span class="statistic-label">{{ item.label }}</span>
              <div class="statistic-trend" :class="{ 'is-increase': item.trend > 0, 'is-decrease': item.trend < 0 }">
                <el-icon><component :is="item.trend > 0 ? 'ArrowUp' : 'ArrowDown'" /></el-icon>
                <span>{{ Math.abs(item.trend) }}%</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" :lg="3" v-for="(item, index) in additionalStatistics" :key="index + 4">
        <el-card class="statistic-card" :body-style="{ padding: '12px' }">
          <div class="statistic-header">
            <el-icon :style="{ color: item.color }">
              <component :is="item.icon" />
            </el-icon>
            <span class="statistic-title">{{ item.title }}</span>
          </div>
          <div class="statistic-content">
            <div class="statistic-value" :style="{ color: item.color }">{{ item.value }}</div>
            <div class="statistic-footer">
              <span class="statistic-label">{{ item.label }}</span>
              <div class="statistic-trend" :class="{ 'is-increase': item.trend > 0, 'is-decrease': item.trend < 0 }">
                <el-icon><component :is="item.trend > 0 ? 'ArrowUp' : 'ArrowDown'" /></el-icon>
                <span>{{ Math.abs(item.trend) }}%</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 第一排图表 -->
    <el-row :gutter="16" class="chart-row compact-charts">
      <el-col :span="10">
        <el-card class="chart-card" :body-style="{ padding: '0' }">
          <template #header>
            <div class="card-header compact">
              <span class="card-title">能耗趋势</span>
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="quarter">本季</el-radio-button>
                <el-radio-button label="year">全年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="trendChart" class="chart-container trend-chart"></div>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card class="chart-card" :body-style="{ padding: '0' }">
          <template #header>
            <div class="card-header compact">
              <span class="card-title">能源分布</span>
              <el-radio-group v-model="distributionTimeRange" size="small">
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="quarter">本季</el-radio-button>
                <el-radio-button label="year">全年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="categoryChart" class="chart-container category-chart"></div>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card class="chart-card" :body-style="{ padding: '0' }">
          <template #header>
            <div class="card-header compact">
              <span class="card-title">实时功率曲线</span>
              <el-radio-group v-model="powerTimeRange" size="small">
                <el-radio-button label="day">今日</el-radio-button>
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="powerChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 第二排图表 -->
    <el-row :gutter="16" class="chart-row compact-charts">
      <el-col :span="10">
        <el-card class="chart-card" :body-style="{ padding: '0' }">
          <template #header>
            <div class="card-header compact">
              <span class="card-title">重点设备能耗排行</span>
              <el-radio-group v-model="rankingTimeRange" size="small">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="quarter">本季</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="ranking-table-container">
            <el-table :data="deviceRanking" :header-cell-style="tableHeaderStyle">
              <el-table-column prop="name" label="设备名称" min-width="120" />
              <el-table-column prop="energy" label="能耗" width="100">
                <template #default="{ row }">
                  {{ row.energy }} kWh
                </template>
              </el-table-column>
              <el-table-column prop="ratio" label="占比" width="160">
                <template #default="{ row }">
                  <div class="ratio-wrapper">
                    <el-progress :percentage="row.ratio" :color="getProgressColor(row.ratio)" :show-text="false" :stroke-width="6" />
                    <span class="ratio-text">{{ row.ratio }}%</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card class="chart-card" :body-style="{ padding: '0' }">
          <template #header>
            <div class="card-header compact">
              <span class="card-title">能源使用效率</span>
              <el-radio-group v-model="efficiencyTimeRange" size="small">
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="quarter">本季</el-radio-button>
                <el-radio-button label="year">全年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="attachment-content compact">
            <div class="efficiency-grid">
              <div class="efficiency-item" v-for="(item, index) in efficiencyData" :key="index">
                <div class="efficiency-header">
                  <span class="efficiency-label">{{ item.label }}</span>
                  <span class="efficiency-value">{{ item.value }}%</span>
                </div>
                <el-progress :percentage="item.value" :color="item.color" :show-text="false" :stroke-width="8" />
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card class="chart-card" :body-style="{ padding: '0' }">
          <template #header>
            <div class="card-header compact">
              <span class="card-title">能源成本分析</span>
              <el-radio-group v-model="costTimeRange" size="small">
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="quarter">本季</el-radio-button>
                <el-radio-button label="year">全年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="attachment-content compact">
            <div class="cost-grid">
              <div class="cost-item" v-for="(item, index) in costData" :key="index">
                <div class="cost-info">
                  <el-icon :style="{ color: getCostColor(index) }">
                    <component :is="getCostIcon(index)" />
                  </el-icon>
                  <span class="cost-label">{{ item.label }}</span>
                </div>
                <span class="cost-value" :style="{ color: getCostColor(index) }">{{ item.value }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 第三排图表 -->
    <el-row :gutter="16" class="chart-row compact-charts">
      <el-col :span="10">
        <el-card class="chart-card" :body-style="{ padding: '0' }">
          <template #header>
            <div class="card-header compact">
              <span class="card-title">部门能耗费用</span>
              <el-radio-group v-model="deptTimeRange" size="small">
                <el-radio-button label="day">日</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
                <el-radio-button label="quarter">季</el-radio-button>
                <el-radio-button label="year">年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="dept-cost-container">
            <div class="dept-list">
              <div v-for="(dept, index) in deptCostData" :key="index" class="dept-item">
                <div class="dept-info">
                  <div class="dept-rank">{{ index + 1 }}</div>
                  <span class="dept-name">{{ dept.name }}</span>
                </div>
                <div class="dept-progress">
                  <el-progress 
                    :percentage="dept.ratio" 
                    :color="getDeptColor(index)"
                    :show-text="false"
                    :stroke-width="8"
                  />
                  <span class="ratio-text">占比: {{ dept.ratio }}%</span>
                </div>
                <div class="dept-value">{{ dept.cost }}元</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card class="chart-card" :body-style="{ padding: '0' }">
          <template #header>
            <div class="card-header compact">
              <span class="card-title">供能部门</span>
              <el-radio-group v-model="meterView" size="small">
                <el-radio-button label="分">分</el-radio-button>
                <el-radio-button label="total">总</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="meter-overview-container">
            <div v-if="meterView === 'total'" class="total-view">
              <div class="power-info">
                <div class="power-value">
                  <span class="value">189139615.2</span>
                  <span class="unit">kWh</span>
                </div>
                <div class="power-bar">
                  <div class="bar-wrapper">
                    <div class="bar-bg"></div>
                    <div class="bar-progress" :style="{ width: '75%' }"></div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="meter-list">
              <div v-for="(meter, index) in totalMeterData" :key="index" class="meter-item">
                <div class="meter-header">
                  <el-icon class="meter-icon"><Odometer /></el-icon>
                  <span class="meter-name">{{ meter.name }}</span>
                </div>
                <div class="meter-content">
                  <div class="meter-reading">
                    <span class="label">最新读数：</span>
                    <span class="value">{{ meter.currentReading }} kWh</span>
                  </div>
                  <div class="meter-increment">
                    <span class="label">增量：</span>
                    <span class="value">{{ meter.increment }} kWh</span>
                  </div>
                  <div class="meter-time">{{ meter.time }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import * as echarts from 'echarts'
import { 
  Bell, 
  Warning, 
  CircleClose, 
  InfoFilled,
  ArrowLeft, 
  ArrowRight,
  Odometer
} from '@element-plus/icons-vue'

const timeRange = ref('month')
const trendChart = ref(null)
const categoryChart = ref(null)
const powerChart = ref(null)

// 顶部统计数据
const statistics = ref([
  {
    title: '总能耗',
    value: '345,789 kWh',
    label: '月同比',
    trend: 12.3,
    icon: 'Lightning',
    color: '#409EFF'
  },
  {
    title: '碳排放量',
    value: '1,234.5 吨',
    label: '月同比',
    trend: -8.4,
    icon: 'WindPower',
    color: '#67C23A'
  },
  {
    title: '能源成本',
    value: '¥ 567,890',
    label: '月同比',
    trend: 5.6,
    icon: 'Money',
    color: '#E6A23C'
  },
  {
    title: '节能率',
    value: '15.8%',
    label: '月同比',
    trend: 2.1,
    icon: 'TrendCharts',
    color: '#909399'
  }
])

// 新增统计卡片数据
const additionalStatistics = ref([
  {
    title: '峰时用电',
    value: '12,500 kWh',
    label: '月同比',
    trend: 5.2,
    icon: 'Lightning',
    color: '#E6A23C'
  },
  {
    title: '谷时用电',
    value: '8,300 kWh',
    label: '月同比',
    trend: -3.8,
    icon: 'Lightning',
    color: '#67C23A'
  },
  {
    title: '功率因数',
    value: '0.95',
    label: '月同比',
    trend: 2.1,
    icon: 'TrendCharts',
    color: '#409EFF'
  },
  {
    title: '需量',
    value: '1,200 kW',
    label: '月同比',
    trend: -1.5,
    icon: 'DataLine',
    color: '#F56C6C'
  }
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

// 图标组件映射
const iconMap = {
  high: CircleClose,
  medium: Warning,
  low: InfoFilled
}

// 实时告警数据
const alerts = ref([
  {
    level: 'high',
    message: 'A区主变压器温度过高，请立即检查',
    time: '10:30:45',
    status: 'unread'
  },
  {
    level: 'medium',
    message: 'B区水压异常波动',
    time: '09:15:22',
    status: 'unread'
  },
  {
    level: 'low',
    message: 'C区空调系统设备能耗异常',
    time: '08:45:10',
    status: 'unread'
  }
])

const currentAlertIndex = ref(0)

const handleAction = () => {
  // 处理告警的逻辑
}

const handleDismiss = () => {
  alerts.value.splice(currentAlertIndex.value, 1)
  if (currentAlertIndex.value >= alerts.value.length) {
    currentAlertIndex.value = Math.max(0, alerts.value.length - 1)
  }
}

// 效率数据
const efficiencyData = ref([
  { label: '能源转换效率', value: 85, color: '#409EFF' },
  { label: '设备运行效率', value: 92, color: '#67C23A' },
  { label: '能源回收率', value: 78, color: '#E6A23C' },
  { label: '系统综合效率', value: 88, color: '#909399' }
])

// 成本数据
const costData = ref([
  { label: '电费支出', value: '¥125,000' },
  { label: '水费支出', value: '¥25,000' },
  { label: '天然气支出', value: '¥45,000' },
  { label: '蒸汽支出', value: '¥35,000' }
])

// 获取成本图标
const getCostIcon = (index) => {
  const icons = ['Money', 'WaterMeter', 'Van', 'WindPower']
  return icons[index]
}

// 获取成本颜色
const getCostColor = (index) => {
  const colors = ['#409EFF', '#67C23A', '#E6A23C', '#909399']
  return colors[index]
}

// 添加新的时间范围变量
const distributionTimeRange = ref('month')
const powerTimeRange = ref('day')
const rankingTimeRange = ref('month')
const efficiencyTimeRange = ref('month')
const costTimeRange = ref('month')

// 部门能耗费用数据
const deptTimeRange = ref('day')
const deptCostData = ref([
  { name: '选矿车间', cost: 1023, ratio: 56.40 },
  { name: '采矿车间', cost: 678, ratio: 37.39 },
  { name: '动修车间', cost: 74, ratio: 4.10 },
  { name: '后勤、生活', cost: 38, ratio: 2.11 },
  { name: '科学城集团总部', cost: 0, ratio: 0 }
])

// 获取部门颜色
const getDeptColor = (index) => {
  const colors = ['#f56c6c', '#e6a23c', '#67c23a', '#909399', '#c0c4cc']
  return colors[index]
}

// 总表概况数据
const meterView = ref('分')
const meterData = ref([
  {
    name: '1#配电房(6768)',
    currentReading: '100000',
    increment: '148668000',
    time: '2024-09-01 08:00 ~ 2024-12-25 08:00'
  },
  {
    name: '2#配电房(9281)',
    currentReading: '7244',
    increment: '884960',
    time: '2023-05-05 08:00 ~ 2023-09-12 08:00'
  },
  {
    name: '3#配电房(8050)',
    currentReading: '10260.28',
    increment: '117120',
    time: '2022-08-31 08:00 ~ 2022-09-01 08:00'
  },
  {
    name: '三车间水泵',
    currentReading: '3245835.2',
    increment: '--',
    time: '2024-07-21 06:00 ~ 2024-07-22 06:00'
  },
  {
    name: '新表',
    currentReading: '136650',
    increment: '--',
    time: '2024-07-21 06:00 ~ 2024-07-22 06:00'
  }
])

// 添加计算属性来处理总视图数据
const totalMeterData = computed(() => {
  if (meterView.value === 'total') {
    return [{
      name: '供能部门总表',
      currentReading: '189139615.2',
      increment: '149670080',
      time: '2024-09-01 08:00 ~ 2024-12-25 08:00'
    }]
  }
  return meterData.value
})

// 初始化能耗趋势图
const initTrendChart = () => {
  const chart = echarts.init(trendChart.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#eee',
      borderWidth: 1,
      textStyle: { color: '#666' },
      padding: [8, 12]
    },
    grid: {
      top: '8%',
      left: '4%',
      right: '4%',
      bottom: '8%',
      containLabel: true
    },
    legend: {
      data: ['用电量', '用水量', '天然气'],
      right: '4%',
      top: '0%',
      textStyle: { color: '#666' },
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 16
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: { lineStyle: { color: '#eee' } },
      axisTick: { show: false },
      axisLabel: { color: '#666' }
    },
    yAxis: {
      type: 'value',
      name: '用量',
      nameTextStyle: { color: '#666' },
      splitLine: { lineStyle: { color: '#eee', type: 'dashed' } },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { 
        color: '#666',
        formatter: '{value}',
        margin: 16
      },
      splitNumber: 4
    },
    series: [
      {
        name: '用电量',
        type: 'line',
        smooth: true,
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        itemStyle: { color: '#409EFF' },
        lineStyle: { width: 3 },
        symbol: 'circle',
        symbolSize: 8,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(64,158,255,0.3)' },
              { offset: 1, color: 'rgba(64,158,255,0.1)' }
            ]
          }
        }
      },
      {
        name: '用水量',
        type: 'line',
        smooth: true,
        data: [320, 332, 301, 334, 390, 330, 320],
        itemStyle: { color: '#67C23A' },
        lineStyle: { width: 3 },
        symbol: 'circle',
        symbolSize: 8,
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
      },
      {
        name: '天然气',
        type: 'line',
        smooth: true,
        data: [220, 232, 201, 234, 290, 230, 220],
        itemStyle: { color: '#E6A23C' },
        lineStyle: { width: 3 },
        symbol: 'circle',
        symbolSize: 8,
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

// 初始化能源分布图
const initCategoryChart = () => {
  const chart = echarts.init(categoryChart.value)
  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#eee',
      borderWidth: 1,
      textStyle: { color: '#666' },
      padding: [8, 12]
    },
    legend: {
      orient: 'horizontal',
      bottom: '8%',
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      textStyle: { color: '#666' },
      itemGap: 16
    },
    series: [
      {
        type: 'pie',
        radius: ['45%', '75%'],
        center: ['50%', '46%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'inside',
          formatter: '{d}%',
          fontSize: 12,
          fontWeight: 'bold',
          color: '#fff'
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
      textStyle: { color: '#666' },
      padding: [8, 12],
      formatter: (params) => {
        const time = params[0].axisValue
        const value = params[0].value
        return `${time}<br/>${params[0].marker} 功率: ${value} kW`
      }
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
      axisLine: { lineStyle: { color: '#eee' } },
      axisTick: { show: false },
      axisLabel: { color: '#666' }
    },
    yAxis: {
      type: 'value',
      name: 'kW',
      splitLine: { lineStyle: { color: '#eee', type: 'dashed' } },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#666' }
    },
    series: [
      {
        type: 'line',
        smooth: true,
        data: [820, 932, 1200, 934, 1290, 1330, 920],
        itemStyle: { color: '#409EFF' },
        lineStyle: { width: 3 },
        symbol: 'circle',
        symbolSize: 8,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(64,158,255,0.3)' },
              { offset: 1, color: 'rgba(64,158,255,0.1)' }
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

<style lang="scss" scoped>
.dashboard {
  margin-top: -32px;
  padding: 16px 0 16px 0;
  background-color: #f6f8fa;
  min-height: calc(100vh - 84px);
}

.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 24px 24px 24px 24px;
  background: linear-gradient(135deg, #409EFF 0%, #67C23A 100%);
  border-radius: 8px;
  color: white;
}

.welcome-content h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.welcome-content p {
  margin: 8px 0 0;
  font-size: 14px;
  opacity: 0.9;
}

.quick-actions {
  display: flex;
  gap: 12px;
}

.statistics-row {
  margin: 0 16px 16px 16px;
  white-space: nowrap;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #dcdfe6;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f5f7fa;
  }
  
  .el-col {
    float: none;
    display: inline-block;
    vertical-align: top;
    width: calc(12.5% - 7px);
    padding: 0 4px;
    
    &:first-child {
      padding-left: 0;
    }
    
    &:last-child {
      padding-right: 0;
    }
  }
}

.statistic-card {
  background: #fff;
  border: none;
  border-radius: 2px;
  box-shadow: none;
  transition: none;
  
  :deep(.el-card__body) {
    padding: 16px !important;
  }
  
  .statistic-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    
    .el-icon {
      font-size: 14px;
      margin-right: 6px;
    }
    
    .statistic-title {
      font-size: 13px;
      color: #606266;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  
  .statistic-content {
    .statistic-value {
      font-size: 20px;
      font-weight: 500;
      line-height: 1.2;
      margin-bottom: 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .statistic-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .statistic-label {
        font-size: 12px;
        color: #909399;
      }
      
      .statistic-trend {
        display: flex;
        align-items: center;
        font-size: 12px;
        padding: 0 4px;
        border-radius: 2px;
        
        &.is-increase {
          color: #f56c6c;
          background-color: rgba(245, 108, 108, 0.1);
        }
        
        &.is-decrease {
          color: #67c23a;
          background-color: rgba(103, 194, 58, 0.1);
        }
        
        .el-icon {
          margin-right: 2px;
          font-size: 12px;
        }
      }
    }
  }
}

.chart-row {
  margin: 0 24px 16px;
  
  &.compact-charts {
    .chart-card {
      border-radius: 4px;
      box-shadow: none;
      height: 100%;
      
      .card-header.compact {
        min-height: auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff;
        
        .card-title {
          font-size: 14px;
          font-weight: 500;
          color: #1f2f3d;
        }
        
        :deep(.el-radio-group) {
          .el-radio-button__inner {
            padding: 4px 12px;
            font-size: 12px;
            height: 28px;
            line-height: 20px;
          }
        }
      }
      
      .chart-container {
        height: 260px;
        padding: 16px 12px 12px 12px;
      }
    }
  }
}

.alert-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #fef7e0;
  border: 1px solid #feefc3;
  border-radius: 4px;
  margin: 0 24px 12px 24px;
}

.alert-navigation {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 100px;
}

.alert-counter {
  font-size: 13px;
  color: #5f6368;
}

.nav-button {
  padding: 4px;
  color: #5f6368;
}

.nav-button:disabled {
  color: #bdc1c6;
}

.alert-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.alert-icon {
  font-size: 20px;
}

.alert-icon.high {
  color: #d93025;
}

.alert-icon.medium {
  color: #ea8600;
}

.alert-icon.low {
  color: #1a73e8;
}

.alert-message {
  font-size: 14px;
  color: #3c4043;
}

.alert-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-button--small) {
  font-size: 13px;
}

/* 移除之前的告警卡片相关样式 */
.alert-card,
.alert-header,
.alert-list,
.alert-item {
  display: none;
}

.attachment-row {
  margin: 0 24px 24px;
}

.compact-card {
  .card-header.compact {
    padding: 12px 16px;
    min-height: auto;
  }
}

.attachment-content.compact {
  padding: 16px;
  height: 248px;
}

.efficiency-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  
  .efficiency-item {
    margin-bottom: 0;
    
    .efficiency-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
      
      .efficiency-label {
        font-size: 13px;
        color: #606266;
      }
      
      .efficiency-value {
        font-size: 13px;
        font-weight: 500;
        color: #303133;
      }
    }
    
    :deep(.el-progress-bar__outer) {
      background-color: #f5f7fa;
    }
  }
}

.cost-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  
  .cost-item {
    padding: 0;
    border: none;
    display: flex;
    flex-direction: column;
    gap: 4px;
    
    .cost-info {
      display: flex;
      align-items: center;
      gap: 6px;
      
      .el-icon {
        font-size: 16px;
      }
      
      .cost-label {
        font-size: 13px;
        color: #606266;
      }
    }
    
    .cost-value {
      font-size: 15px;
      font-weight: 500;
      padding-left: 22px;
    }
  }
}

.ranking-table-container {
  padding: 16px;
  
  :deep(.el-table) {
    --el-table-header-bg-color: #fafafa;
    
    .el-table__header th {
      font-weight: 500;
      color: #1f2f3d;
    }
  }
}

.dept-cost-container {
  padding: 16px;
  height: 280px;
  overflow-y: auto;
  
  .dept-list {
    .dept-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .dept-info {
        width: 140px;
        display: flex;
        align-items: center;
        gap: 8px;
        
        .dept-rank {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #f5f7fa;
          color: #909399;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .dept-name {
          font-size: 13px;
          color: #606266;
        }
      }
      
      .dept-progress {
        flex: 1;
        margin: 0 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        
        :deep(.el-progress-bar__outer) {
          background-color: #f5f7fa;
        }
        
        .ratio-text {
          font-size: 12px;
          color: #909399;
          min-width: 70px;
        }
      }
      
      .dept-value {
        font-size: 13px;
        color: #303133;
        font-weight: 500;
        min-width: 80px;
        text-align: right;
      }
    }
  }
}

.meter-overview-container {
  padding: 12px 12px 12px 12px;
  height: 280px;
  overflow-y: auto;
  
  .meter-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    
    .meter-item {
      padding: 12px;
      border: 1px solid #ebeef5;
      border-radius: 4px;
      height: 80px;
      display: flex;
      flex-direction: column;
      
      .meter-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        
        .meter-icon {
          font-size: 16px;
          color: #409EFF;
        }
        
        .meter-name {
          font-size: 13px;
          color: #303133;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      
      .meter-content {
        padding-left: 24px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        
        .meter-reading,
        .meter-increment {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
          
          .label {
            font-size: 12px;
            color: #909399;
            width: 65px;
          }
          
          .value {
            font-size: 12px;
            color: #303133;
          }
        }
        
        .meter-time {
          font-size: 11px;
          color: #909399;
          margin-top: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}

/* 修改滚动条样式 */
.dept-cost-container,
.meter-overview-container {
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #dcdfe6;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f5f7fa;
  }
}

.total-view {
  padding: 20px;
  
  .power-info {
    .power-value {
      margin-bottom: 16px;
      
      .value {
        font-size: 24px;
        font-weight: 500;
        color: #303133;
      }
      
      .unit {
        font-size: 14px;
        color: #909399;
        margin-left: 4px;
      }
    }
    
    .power-bar {
      .bar-wrapper {
        position: relative;
        height: 8px;
        background: #f5f7fa;
        border-radius: 4px;
        overflow: hidden;
        
        .bar-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #f5f7fa;
        }
        
        .bar-progress {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(90deg, #409EFF 0%, #67C23A 100%);
          border-radius: 4px;
          transition: width 0.3s ease;
        }
      }
    }
  }
}
</style> 