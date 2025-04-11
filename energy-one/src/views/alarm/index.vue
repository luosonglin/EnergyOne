<template>
  <div class="alarm">
    <el-row :gutter="24">
      <el-col :span="8">
        <el-card class="modern-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">告警等级统计</span>
            </div>
          </template>
          <div ref="alarmLevelChart" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="modern-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">告警类型占比</span>
            </div>
          </template>
          <div ref="alarmTypeChart" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="modern-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">告警排行</span>
            </div>
          </template>
          <el-table :data="alarmRanking" style="width: 100%" :header-cell-style="tableHeaderStyle">
            <el-table-column prop="device" label="设备" />
            <el-table-column prop="count" label="告警次数" width="100" align="right" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row class="alarm-list-row">
      <el-col :span="24">
        <el-card class="modern-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">告警消息列表</span>
              <div class="filter-group">
                <el-select v-model="filterStatus" placeholder="告警状态" class="filter-select">
                  <el-option label="全部" value="" />
                  <el-option label="未处理" value="unhandled" />
                  <el-option label="已处理" value="handled" />
                </el-select>
                <el-select v-model="filterLevel" placeholder="告警等级" class="filter-select">
                  <el-option label="全部" value="" />
                  <el-option label="高" value="high" />
                  <el-option label="中" value="medium" />
                  <el-option label="低" value="low" />
                </el-select>
              </div>
            </div>
          </template>
          <el-table 
            :data="filteredAlarms" 
            style="width: 100%" 
            :header-cell-style="tableHeaderStyle"
            :row-class-name="tableRowClassName">
            <el-table-column prop="time" label="时间" width="180" />
            <el-table-column prop="level" label="等级" width="100">
              <template #default="{ row }">
                <el-tag 
                  :type="getLevelType(row.level)"
                  class="status-tag"
                  effect="plain">
                  {{ getLevelText(row.level) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" width="120">
              <template #default="{ row }">
                <el-tag 
                  type="info" 
                  class="status-tag"
                  effect="plain">
                  {{ getTypeText(row.type) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="message" label="告警信息" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag 
                  :type="row.status === 'handled' ? 'success' : 'danger'"
                  class="status-tag"
                  effect="plain">
                  {{ row.status === 'handled' ? '已处理' : '未处理' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button
                  v-if="row.status === 'unhandled'"
                  type="primary"
                  link
                  class="action-button"
                  @click="handleProcess(row)">
                  处理
                </el-button>
                <el-button 
                  type="primary" 
                  link
                  class="action-button"
                  @click="handleDetail(row)">
                  详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMainStore } from '@/store'
import * as echarts from 'echarts'

const mainStore = useMainStore()
const filterStatus = ref('')
const filterLevel = ref('')
const alarmLevelChart = ref(null)
const alarmTypeChart = ref(null)

// Mock data for alarm ranking
const alarmRanking = ref([
  { device: 'A区主变压器', count: 12 },
  { device: 'B区主变压器', count: 8 },
  { device: 'C区主变压器', count: 5 },
  { device: 'D区主变压器', count: 3 },
  { device: 'E区主变压器', count: 2 }
])

const tableHeaderStyle = {
  background: '#f5f7fa',
  color: '#606266',
  fontWeight: '500',
  height: '44px'
}

const tableRowClassName = ({ row }) => {
  if (row.status === 'unhandled') {
    return 'unhandled-row'
  }
  return ''
}

const getLevelType = (level) => {
  const types = {
    high: 'danger',
    medium: 'warning',
    low: 'info'
  }
  return types[level] || 'info'
}

const getLevelText = (level) => {
  const texts = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return texts[level] || '未知'
}

const getTypeText = (type) => {
  const texts = {
    electricity: '电力',
    water: '水',
    gas: '天然气',
    steam: '蒸汽'
  }
  return texts[type] || '未知'
}

const filteredAlarms = computed(() => {
  return mainStore.getAlarms.filter(alarm => {
    const statusMatch = !filterStatus.value || alarm.status === filterStatus.value
    const levelMatch = !filterLevel.value || alarm.level === filterLevel.value
    return statusMatch && levelMatch
  })
})

const initAlarmLevelChart = () => {
  const chart = echarts.init(alarmLevelChart.value)
  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#eee',
      borderWidth: 1,
      textStyle: {
        color: '#666'
      }
    },
    legend: {
      orient: 'horizontal',
      bottom: '0',
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        color: '#666'
      }
    },
    series: [
      {
        name: '告警等级',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 5, name: '高', itemStyle: { color: '#F56C6C' } },
          { value: 10, name: '中', itemStyle: { color: '#E6A23C' } },
          { value: 15, name: '低', itemStyle: { color: '#909399' } }
        ]
      }
    ]
  }
  chart.setOption(option)
}

const initAlarmTypeChart = () => {
  const chart = echarts.init(alarmTypeChart.value)
  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#eee',
      borderWidth: 1,
      textStyle: {
        color: '#666'
      }
    },
    legend: {
      orient: 'horizontal',
      bottom: '0',
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        color: '#666'
      }
    },
    series: [
      {
        name: '告警类型',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 12, name: '电力', itemStyle: { color: '#409EFF' } },
          { value: 8, name: '水', itemStyle: { color: '#67C23A' } },
          { value: 6, name: '天然气', itemStyle: { color: '#E6A23C' } },
          { value: 4, name: '蒸汽', itemStyle: { color: '#909399' } }
        ]
      }
    ]
  }
  chart.setOption(option)
}

const handleProcess = (row) => {
  // Implement process logic here
  console.log('Processing alarm:', row)
}

const handleDetail = (row) => {
  // Implement detail logic here
  console.log('Viewing details:', row)
}

onMounted(() => {
  initAlarmLevelChart()
  initAlarmTypeChart()
})
</script>

<script>
export default {
  name: 'AlarmView'
}
</script>

<style scoped>
.alarm {
  margin-top: -32px;
  padding: 16px 0 16px 0;
  background-color: #f0f2f5;
  min-height: calc(100vh - 84px);
}

.modern-card {
  border-radius: 8px;
  border: none;
  transition: all 0.3s ease;
  margin-bottom: 24px;
}

.modern-card:hover {
  transform: translateY(-2px);
}

.card-header {
  border-bottom: none;
  padding: 16px 20px;
}

.card-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.chart-container {
  height: 300px;
  padding: 0 20px 20px;
}

.filter-group {
  display: flex;
  gap: 12px;
}

.filter-select {
  width: 140px;
}

.status-tag {
  border-radius: 4px;
  padding: 4px 8px;
  font-weight: 500;
}

.action-button {
  padding: 4px 0;
  font-size: 14px;
}

.action-button + .action-button {
  margin-left: 12px;
}

:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table th) {
  background-color: #f5f7fa !important;
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
  background-color: #f5f7fa;
}

.unhandled-row {
  background-color: #fef0f0;
}

.alarm-list-row {
  margin-top: 0;
}

:deep(.el-card__body) {
  padding: 0;
}

:deep(.el-table .cell) {
  padding: 8px 12px;
}
</style> 